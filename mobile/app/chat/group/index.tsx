// React
import { useCallback, useEffect, useRef, useState } from "react";

// React Native
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Third-party
import { router, useFocusEffect } from "expo-router";
import { ArrowLeft, Check, CheckCheck, Info, Users } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";

// Constants
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

// Services
import { getGroupMessages, sendGroupMessage } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";
import { socket } from "@/services/socket";

// Store
import {
  setMessages,
  appendMessage,
  markChatAsRead,
  clearUnread,
  setGroupChat,
  type ChatMessage,
  type MessageStatus,
} from "@/store/slices/chatSlice";
import type { AppDispatch, RootState } from "@/store";

// Components
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";

// ── Tick icon ────────────────────────────────────────────────────────────────

function TickIcon({ status }: { status: MessageStatus }) {
  if (status === "read") return <CheckCheck size={13} color="#34B7F1" />;
  if (status === "delivered") return <CheckCheck size={13} color={colors.light.textSecondary} />;
  return <Check size={13} color={colors.light.textSecondary} />;
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function GroupChatScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const group = useSelector((state: RootState) => state.chat.groupChat);

  // Derive groupId from Redux cache
  const groupId = group?.id;
  const cachedMessages = useSelector(
    (state: RootState) => state.chat.messages[groupId ?? ""] ?? [],
  );

  const [loading, setLoading] = useState(cachedMessages.length === 0);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [role, setRole] = useState("member");

  const flatListRef = useRef<FlatList>(null);
  const hasOtherMembers = (group as any)?.members
    ? ((group as any).members.length ?? 0) > 1
    : false;

  // ── Load group + messages ─────────────────────────────────────────────────

  const loadGroup = useCallback(async () => {
    try {
      const res = await getMyGroup();
      const groupData = res.data?.data ?? res.data;
      if (groupData) {
        dispatch(setGroupChat(groupData));
        const currentMember = (groupData.members ?? []).find(
          (m: any) => m.id === currentUserId,
        );
        setRole(currentMember?.role ?? "member");
        return groupData;
      }
    } catch (err) {
      console.log("Load Group error:", err);
    }
    return null;
  }, [dispatch, currentUserId]);

  const loadMessages = useCallback(
    async (gId: string) => {
      try {
        const res = await getGroupMessages();
        dispatch(setMessages({ chatId: gId, messages: res.data.data ?? [] }));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 200);
      } catch (err) {
        console.log("Load group messages error:", err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const initialize = async () => {
      const groupData = await loadGroup();
      const gId: string | undefined = groupData?.id;
      if (!gId) return;

      // Emit read receipt
      if (currentUserId) socket.emit("read-chat", { chatId: gId, readerId: currentUserId });
      dispatch(clearUnread(gId));
      dispatch(markChatAsRead(gId));

      // Join socket room
      const joinChat = () => socket.emit("join-chat", gId);
      if (socket.connected) joinChat();
      else socket.once("connect", joinChat);

      const handleNewMessage = (msg: ChatMessage) => {
        dispatch(appendMessage({ chatId: gId, message: msg }));
        if (currentUserId) socket.emit("read-chat", { chatId: gId, readerId: currentUserId });
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      };

      socket.on("new-message", handleNewMessage);

      await loadMessages(gId);

      return () => {
        socket.emit("leave-chat", gId);
        socket.off("new-message", handleNewMessage);
        socket.off("connect", joinChat);
      };
    };

    void initialize();
  }, [loadGroup, loadMessages, currentUserId, dispatch]);

  // Re-fetch messages when screen re-focuses (e.g., returning from group info)
  useFocusEffect(
    useCallback(() => {
      if (groupId) {
        void loadMessages(groupId);
        dispatch(clearUnread(groupId));
        dispatch(markChatAsRead(groupId));
      }
    }, [groupId, loadMessages, dispatch]),
  );

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = async () => {
    const value = text.trim();
    if (!value || sending) return;
    try {
      setSending(true);
      await sendGroupMessage(value);
      setText("");
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.log("Send Group Message error:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <ScreenContainer loading />;

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Safety Circle"
          subtitle="Family Group"
          avatarIcon={Users}
          rightComponent={
            <Pressable
              onPress={() =>
                router.push({
                  pathname: ROUTES.CHAT.GROUP.INFO.INDEX,
                  params: { role },
                })
              }
            >
              <Info size={22} color={colors.light.text} />
            </Pressable>
          }
        />

        <FlatList
          ref={flatListRef}
          data={cachedMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => {
            const isMe = (item.sender?.id ?? item.senderId) === currentUserId;
            const senderName = item.sender?.name ?? "Unknown";

            return (
              <View
                style={[
                  styles.messageContainer,
                  isMe && styles.myMessageContainer,
                ]}
              >
                {!isMe && (
                  <Text style={styles.senderName}>{senderName}</Text>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  <Text
                    style={[styles.messageText, isMe && styles.myMessageText]}
                  >
                    {item.text}
                  </Text>
                </View>

                <View style={[styles.metaRow, isMe && styles.myMetaRow]}>
                  <Text style={[styles.time, isMe && styles.myTime]}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  {isMe && <TickIcon status={item.status ?? "sent"} />}
                </View>
              </View>
            );
          }}
        />

        {hasOtherMembers ? (
          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={colors.light.textSecondary}
              style={styles.input}
              multiline
            />

            <Pressable
              style={[styles.sendButton, sending && { opacity: 0.6 }]}
              disabled={sending}
              onPress={handleSend}
            >
              <Text style={styles.sendText}>{sending ? "Sending..." : "Send"}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No members in your Safety Circle</Text>
            <Text style={styles.emptySubtitle}>
              Ask your family members to send a join request to start chatting.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 20 },

  messageContainer: { marginBottom: 16 },
  myMessageContainer: { alignItems: "flex-end" },

  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.light.textSecondary,
    marginBottom: 4,
    marginLeft: 10,
  },

  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: colors.light.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderBottomLeftRadius: 4,
  },

  messageText: { fontSize: 16, color: colors.light.text, lineHeight: 22 },
  myMessageText: { color: "#fff" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 10,
    gap: 4,
  },
  myMetaRow: { marginLeft: 0, marginRight: 10, justifyContent: "flex-end" },

  time: { fontSize: 11, color: colors.light.textSecondary },
  myTime: { color: colors.light.textSecondary },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.light.backgroundSecondary,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.light.text,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.light.primary,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  emptyState: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: colors.light.text },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
});
