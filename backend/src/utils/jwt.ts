import jwt, { SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is missing");
}

if (!REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is missing");
}

interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"],
    algorithm: "HS256",
  };

  return jwt.sign(payload, ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
      "30d") as SignOptions["expiresIn"],
    algorithm: "HS256",
  };

  return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
