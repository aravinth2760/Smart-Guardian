import crypto from "crypto";
import { prisma } from "../prisma/client.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const REFRESH_TOKEN_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_DAYS || 30);
const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
const getExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_TOKEN_DAYS);
  return date;
};

// Login / OTP Verify Token Creation

export const createTokens = async (userId: string) => {
  const accessToken = generateAccessToken({ userId });
  const refreshToken = generateRefreshToken({ userId });
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getExpiryDate();

  //Single device login

  await prisma.refreshToken.upsert({
    where: {
      userId,
    },
    update: {
      tokenHash,
      expiresAt,
      revokedAt: null,
    },
    create: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

// Refresh Token Rotation

export const rotateRefreshToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }
  if (storedToken.revokedAt) {
    throw new Error("Refresh token revoked");
  }
  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
  });
  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
  });

  const newHash = hashToken(newRefreshToken);
  const expiresAt = getExpiryDate();

  /*
     Replace old refresh token
     Same userId
     Same row update
  */
  await prisma.refreshToken.update({
    where: {
      userId: decoded.userId,
    },
    data: {
      tokenHash: newHash,
      expiresAt,
      revokedAt: null,
    },
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
