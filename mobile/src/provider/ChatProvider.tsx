import { ReactNode, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "expo-router";

import type { AppDispatch, RootState } from "@/store";

import { getChats } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";
import { chatCache } from "@/storage/chatCache";

import {
  setChats,
  setGroupChat,
  setChatsLoading,
  incrementUnread,
  updateChatLastMessage,
  updateGroupLastMessage,
} from "@/store/slices/chatSlice";
import { socket } from "@/services/socket";

interface ChatProviderProps {
  children: ReactNode;
}

export default function ChatProvider({ children }: ChatProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const groupChat = useSelector((state: RootState) => state.chat.groupChat);
  const pathname = usePathname();
  const activeChatIdRef = useRef<string | null>(null);

  // Track currently active chat screen so we don't increment unread for an open chat
  useEffect(() => {
    const cleanPath = pathname.split("?")[0];
    const privateMatch = cleanPath.match(/^\/chat\/([^/]+)$/);
    const isGroupChat =
      cleanPath === "/chat/group" || cleanPath === "/chat/group/index";

    if (
      privateMatch &&
      privateMatch[1] !== "group" &&
      privateMatch[1] !== "contacts"
    ) {
      activeChatIdRef.current = privateMatch[1];
    } else if (isGroupChat) {
      activeChatIdRef.current = groupChat?.id ?? null;
    } else {
      activeChatIdRef.current = null;
    }
  }, [pathname, groupChat?.id]);

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

    const handleNewMessage = (message: any) => {
      if (!message?.chatId) return;

      const currentUserId = user.id;

      // Update last-message preview in the chat list
      dispatch(
        updateChatLastMessage({
          chatId: message.chatId,
          message,
        }),
      );

      // Update the group chat preview if this is a group message
      if (groupChat?.id === message.chatId) {
        dispatch(
          updateGroupLastMessage({
            id: message.id,
            text: message.text,
            createdAt: message.createdAt,
            sender: message.sender,
          }),
        );
      }

      // Only increment unread when:
      // 1. The message is from someone else (not the current user)
      // 2. The user is NOT actively viewing that specific chat screen
      if (
        message.senderId !== currentUserId &&
        activeChatIdRef.current !== message.chatId
      ) {
        dispatch(incrementUnread({ chatId: message.chatId, messageId: message.id }));
      }
    };

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

    socket.on("new-message", handleNewMessage);
    socket.on("group-created", handleGroupCreated);
    socket.on("group-deleted", handleGroupDeleted);
    socket.on("group-updated", handleGroupUpdated);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("group-created", handleGroupCreated);
      socket.off("group-deleted", handleGroupDeleted);
      socket.off("group-updated", handleGroupUpdated);
    };
  }, [user, dispatch, groupChat?.id]);

  return <>{children}</>;
}
