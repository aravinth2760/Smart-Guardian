import crypto from "crypto";

export const generateInviteCode = () => {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
};