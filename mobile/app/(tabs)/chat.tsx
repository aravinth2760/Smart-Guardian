// React
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// React Native
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

// Third-party
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

// Constants
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

// Providers
import { useContacts } from "@/provider/ContactsProvider";

// Services
import { getChats } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";

// Storage cache
import { chatCache } from "@/storage/chatCache";

// Store
import {
  setChats,
  setGroupChat,
  setChatsLoading,
  updateChatLastMessage,
  updateGroupLastMessage,
  incrementUnread,
  type PrivateChat,
  type GroupChat,
} from "@/store/slices/chatSlice";
import type { AppDispatch, RootState } from "@/store";

// Components
import ChatCard from "@/components/chat/ChatCard";
import FloatingButton from "@/components/chat/FloatingButton";
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import SearchBar from "@/components/common/SearchBar";

// Socket
import { socket } from "@/services/socket";

export default function ChatScreen() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const chats = useSelector((state: RootState) => state.chat.chats);
  const group = useSelector((state: RootState) => state.chat.groupChat);
  const unreadCounts = useSelector(
    (state: RootState) => state.chat.unreadCounts,
  );
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const { loaded, getName } = useContacts();

  // Track whether we are currently on this screen (for unread increment)
  const isActiveScreen = useRef(false);

  // ── Load from cache + then sync from server ──────────────────────────────

  const loadFromServer = useCallback(async () => {
    try {
      dispatch(setChatsLoading(true));
      const [chatsRes, groupRes] = await Promise.all([
        getChats(),
        getMyGroup().catch(() => ({ data: null })),
      ]);

      const serverChats: PrivateChat[] = chatsRes.data.data ?? [];
      const serverGroup: GroupChat | null =
        groupRes.data?.data ?? groupRes.data ?? null;

      dispatch(setChats(serverChats));
      dispatch(setGroupChat(serverGroup));

      // Persist for next cold launch
      await chatCache.saveChats(serverChats);
      await chatCache.saveGroup(serverGroup);
    } catch (error) {
      console.log("Load chats from server error:", error);
    } finally {
      dispatch(setChatsLoading(false));
    }
  }, [dispatch]);

  // On mount: load cache instantly, then sync from server
  useEffect(() => {
    const init = async () => {
      const [cachedChats, cachedGroup] = await Promise.all([
        chatCache.loadChats(),
        chatCache.loadGroup(),
      ]);
      if (cachedChats.length > 0) dispatch(setChats(cachedChats));
      if (cachedGroup) dispatch(setGroupChat(cachedGroup));
      // Always fetch fresh data in background
      await loadFromServer();
    };
    void init();
  }, []);

  // Refresh when tab is focused
  useFocusEffect(
    useCallback(() => {
      isActiveScreen.current = true;
      void loadFromServer();
      return () => {
        isActiveScreen.current = false;
      };
    }, [loadFromServer]),
  );

  // ── Socket: real-time last message update in chat list ───────────────────

  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      if (!msg?.chatId) return;

      // Update preview in chat list
      dispatch(updateChatLastMessage({ chatId: msg.chatId, message: msg }));

      // If the message is for the group, update group preview
      if (group && msg.chatId === group.id) {
        dispatch(
          updateGroupLastMessage({
            id: msg.id,
            text: msg.text,
            createdAt: msg.createdAt,
            sender: msg.sender,
          }),
        );
      }

      // Increment unread if message is from someone else and screen not focused on that chat
      if (msg.senderId !== currentUserId) {
        dispatch(incrementUnread(msg.chatId));
      }
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [dispatch, currentUserId, group]);

  // ── Filter chats by search ───────────────────────────────────────────────

  const filteredChats = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return chats.filter((chat) => {
      const otherUser = chat.members.find(
        (member) => member.user.id !== currentUserId,
      )?.user;

      const displayName = getName(otherUser?.phone, otherUser?.name ?? "");

      if (!keyword) return true;

      return (
        displayName.toLowerCase().includes(keyword) ||
        otherUser?.phone?.includes(search.trim())
      );
    });
  }, [chats, search, currentUserId, getName]);

  const hasOtherMembers = (group?.members?.length ?? 0) > 1;

  if (!loaded) {
    return <ScreenContainer loading />;
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Chat" showBack={false} />

      <View style={{ marginBottom: 16 }}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <ChatCard
        name={group ? group.name : "No Groups Yet"}
        message={
          !group
            ? "You haven't created or joined any groups yet."
            : !hasOtherMembers
              ? "No members yet. Add your family and guardians to this group."
              : group.lastMessage
                ? group.lastMessage.sender.id === currentUserId
                  ? `You: ${group.lastMessage.text}`
                  : `${group.lastMessage.sender.name}: ${group.lastMessage.text}`
                : "Stay connected with your guardians and family members."
        }
        time={
          group?.lastMessage
            ? new Date(group.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
        }
        unread={group ? (unreadCounts[group.id] ?? 0) : 0}
        isSafetyCircle
        onPress={() => {
          if (group) {
            router.push(ROUTES.CHAT.GROUP.INDEX);
          } else {
            router.push(ROUTES.CHAT.GROUP.SETUP);
          }
        }}
      />

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: StatusBar.currentHeight || 0 }}
        renderItem={({ item }) => {
          const otherUser = item.members.find(
            (member) => member.user.id !== currentUserId,
          )?.user;

          const displayName = getName(
            otherUser?.phone,
            otherUser?.name ?? otherUser?.phone,
          );

          const lastMsg = item.messages[0];
          const unread = unreadCounts[item.id] ?? 0;

          return (
            <ChatCard
              name={displayName}
              message={lastMsg?.text ?? ""}
              time={
                lastMsg
                  ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              unread={unread}
              onPress={() =>
                router.push(
                  ROUTES.CHAT.ROOM(
                    item.id,
                    displayName,
                    otherUser?.phone ?? "",
                  ),
                )
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No chats found</Text>
            <Text style={styles.emptySubtitle}>
              Start a new conversation using the + button.
            </Text>
          </View>
        }
      />

      <FloatingButton onPress={() => router.push(ROUTES.CHAT.CONTACTS)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
