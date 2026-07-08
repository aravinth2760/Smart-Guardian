import { secureStorage } from "../storage/secureStorage";
import type { User } from "@/types/auth";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const USER_DATA = "user";

export const tokenService = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await Promise.all([
      secureStorage.setItem(ACCESS_TOKEN, accessToken),
      secureStorage.setItem(REFRESH_TOKEN, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return secureStorage.getItem(ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return secureStorage.getItem(REFRESH_TOKEN);
  },

  async saveUser(user: User) {
    await secureStorage.setItem(USER_DATA, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await secureStorage.getItem(USER_DATA);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  async removeTokens() {
    await secureStorage.clearAuth();
  },
};
