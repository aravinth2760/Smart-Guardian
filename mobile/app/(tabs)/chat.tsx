// React
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";

// Third-party
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

// Constants
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

// Providers
import { useContacts } from "@/provider/ContactsProvider";

import type { AppDispatch, RootState } from "@/store";

// Components
import ChatCard from "@/components/chat/ChatCard";
import FloatingButton from "@/components/chat/FloatingButton";
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import SearchBar from "@/components/common/SearchBar";

// Services & Cache
import { setChats, setGroupChat } from "@/store/slices/chatSlice";
import { getChats } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";
import { chatCache } from "@/storage/chatCache";

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
  const isActiveScreen = useRef(false);
  // Tracks which chatId screen the user is currently viewing so we don't
  // double-increment unread while they're actively reading that chat.
  const activeChatIdRef = useRef<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [chatsRes, groupRes] = await Promise.all([
        getChats().catch(() => ({ data: { data: [] } })),
        getMyGroup().catch(() => ({ data: null })),
      ]);

      const updatedChats = chatsRes.data?.data ?? [];
      const updatedGroup = groupRes.data?.data ?? groupRes.data ?? null;

      dispatch(setChats(updatedChats));
      dispatch(setGroupChat(updatedGroup));

      await Promise.all([
        chatCache.saveChats(updatedChats),
        chatCache.saveGroup(updatedGroup),
      ]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      isActiveScreen.current = true;
      return () => {
        isActiveScreen.current = false;
      };
    }, []),
  );

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
            ? new Date(group.lastMessage.createdAt).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              )
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                  ? new Date(lastMsg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
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
