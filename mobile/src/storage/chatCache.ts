/**
 * chatCache.ts
 *
 * Persists Redux chat state (chats list + group) to SecureStorage so the app
 * can render the Chat tab instantly without waiting for a network round-trip.
 * Messages are NOT persisted to keep storage lean; they are re-fetched from
 * the server (or socket) as needed.
 */
import { secureStorage } from "./secureStorage";
import { PrivateChat, GroupChat } from "@/store/slices/chatSlice";

const CHATS_KEY = "cached_chats";
const GROUP_KEY = "cached_group";

export const chatCache = {
  async saveChats(chats: PrivateChat[]): Promise<void> {
    try {
      await secureStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch {
      /* non-critical */
    }
  },

  async loadChats(): Promise<PrivateChat[]> {
    try {
      const raw = await secureStorage.getItem(CHATS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveGroup(group: GroupChat | null): Promise<void> {
    try {
      await secureStorage.setItem(GROUP_KEY, JSON.stringify(group));
    } catch {
      /* non-critical */
    }
  },

  async loadGroup(): Promise<GroupChat | null> {
    try {
      const raw = await secureStorage.getItem(GROUP_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async clearAll(): Promise<void> {
    await secureStorage.deleteItem(CHATS_KEY);
    await secureStorage.deleteItem(GROUP_KEY);
  },
};
