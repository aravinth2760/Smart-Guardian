import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";

import { getChats } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";
import { chatCache } from "@/storage/chatCache";

import {
  setChats,
  setGroupChat,
  setChatsLoading,
} from "@/store/slices/chatSlice";
import { socket } from "@/services/socket";

interface ChatProviderProps {
  children: ReactNode;
}

export default function ChatProvider({ children }: ChatProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const syncChats = async () => {
      dispatch(setChatsLoading(true));

      try {
        // 1. Load cached data for instant UI
        const [cachedChats, cachedGroup] = await Promise.all([
          chatCache.loadChats(),
          chatCache.loadGroup(),
        ]);

        if (!isMounted) return;

        if (cachedChats.length > 0) {
          dispatch(setChats(cachedChats));
        }

        if (cachedGroup) {
          dispatch(setGroupChat(cachedGroup));
        }

        // 2. Sync latest data from server
        const [chatsRes, groupRes] = await Promise.all([
          getChats(),
          getMyGroup().catch(() => ({ data: null })),
        ]);

        if (!isMounted) return;

        const chats = chatsRes.data?.data ?? [];
        const group = groupRes.data?.data ?? groupRes.data ?? null;

        dispatch(setChats(chats));
        dispatch(setGroupChat(group));

        // 3. Update cache
        await Promise.all([
          chatCache.saveChats(chats),
          chatCache.saveGroup(group),
        ]);
      } catch (error) {
        console.error("Chat sync failed:", error);
      } finally {
        if (isMounted) {
          dispatch(setChatsLoading(false));
        }
      }
    };

    void syncChats();

    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) return;

    const handleGroupCreated = async () => {
      try {
        const groupRes = await getMyGroup().catch(() => ({ data: null }));
        const group = groupRes.data?.data ?? groupRes.data ?? null;
        dispatch(setGroupChat(group));
        chatCache.saveGroup(group).catch(console.error);
      } catch (error) {
        console.error("Group creation fetch failed:", error);
      }
    };

    const handleGroupDeleted = () => {
      dispatch(setGroupChat(null));
      chatCache.saveGroup(null).catch(console.error);
    };

    const handleGroupUpdated = async () => {
      try {
        const groupRes = await getMyGroup().catch(() => ({ data: null }));
        const group = groupRes.data?.data ?? groupRes.data ?? null;
        dispatch(setGroupChat(group));
        chatCache.saveGroup(group).catch(console.error);
      } catch (error) {
        console.error("Group update fetch failed:", error);
      }
    };

    socket.on("group-created", handleGroupCreated);
    socket.on("group-deleted", handleGroupDeleted);
    socket.on("group-updated", handleGroupUpdated);

    return () => {
      socket.off("group-created", handleGroupCreated);
      socket.off("group-deleted", handleGroupDeleted);
      socket.off("group-updated", handleGroupUpdated);
    };
  }, [user, dispatch]);

  return <>{children}</>;
}
