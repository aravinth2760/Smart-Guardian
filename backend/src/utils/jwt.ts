import jwt, { SignOptions } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in .env");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export const generateToken = <T extends object>(payload: T) => {
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";

  const options: SignOptions = {
    expiresIn,
    algorithm: "HS256",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};
