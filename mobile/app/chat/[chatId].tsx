// React
import { useEffect, useRef, useState } from "react";

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
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, CheckCheck, Phone, SendHorizontal, Video } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";

// Constants
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

// Services
import { getMessages, sendMessage } from "@/services/chat.service";
import { socket } from "@/services/socket";

// Store
import {
  setMessages,
  appendMessage,
  updateMessageStatus,
  markChatAsRead,
  clearUnread,
  type ChatMessage,
  type MessageStatus,
} from "@/store/slices/chatSlice";
import type { AppDispatch, RootState } from "@/store";

// ── Tick Icon ────────────────────────────────────────────────────────────────

function TickIcon({ status }: { status: MessageStatus }) {
  if (status === "read") {
    return <CheckCheck size={14} color="#34B7F1" />;
  }
  if (status === "delivered") {
    return <CheckCheck size={14} color={colors.light.textSecondary} />;
  }
  return <Check size={14} color={colors.light.textSecondary} />;
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function ChatDetailsScreen() {
  const { chatId, name, phone } = useLocalSearchParams<{
    chatId: string;
    name: string;
    phone: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const cachedMessages = useSelector(
    (state: RootState) => state.chat.messages[chatId] ?? [],
  );

  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // ── Load messages ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        const res = await getMessages(chatId);
        dispatch(setMessages({ chatId, messages: res.data.data }));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
      } catch (err) {
        console.log("Load messages error:", err);
      }
    };

    // Join socket room
    const joinChat = () => socket.emit("join-chat", chatId);
    if (socket.connected) {
      joinChat();
    } else {
      socket.once("connect", joinChat);
    }

    // Emit read receipt so sender sees blue ticks
    if (currentUser?.id) {
      socket.emit("read-chat", { chatId, readerId: currentUser.id });
    }

    // Clear unread count for this chat
    dispatch(clearUnread(chatId));
    dispatch(markChatAsRead(chatId));

    // Socket: new message arrives while this chat is open
    const handleNewMessage = (newMessage: ChatMessage) => {
      if (newMessage.chatId !== chatId) return;
      dispatch(appendMessage({ chatId, message: { ...newMessage, status: "read" } }));
      // Immediately inform sender we read it
      if (currentUser?.id) {
        socket.emit("read-chat", { chatId, readerId: currentUser.id });
      }
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    // Socket: sender learns a message was delivered/read
    const handleStatusUpdate = ({
      messageId,
      status,
    }: {
      chatId: string;
      messageId: string;
      status: MessageStatus;
    }) => {
      dispatch(updateMessageStatus({ chatId, messageId, status }));
    };

    // Socket: our messages were read by the other person
    const handleMessagesRead = ({ chatId: cId }: { chatId: string; readerId: string }) => {
      if (cId === chatId) {
        dispatch(markChatAsRead(chatId));
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("message-delivered", handleStatusUpdate);
    socket.on("messages-read", handleMessagesRead);

    void loadMessages();

    return () => {
      socket.emit("leave-chat", chatId);
      socket.off("new-message", handleNewMessage);
      socket.off("message-delivered", handleStatusUpdate);
      socket.off("messages-read", handleMessagesRead);
      socket.off("connect", joinChat);
    };
  }, [chatId, currentUser?.id, dispatch]);

  // ── Send message ──────────────────────────────────────────────────────────

  const onSend = async () => {
    if (!message.trim()) return;
    const text = message.trim();
    setMessage("");
    try {
      await sendMessage(chatId, text);
      // The server broadcasts "new-message" back; we also scroll
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  // ── Render message ────────────────────────────────────────────────────────

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === currentUser?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={[styles.messageText, isMe && { color: "#fff" }]}>
          {item.text}
        </Text>

        <View style={styles.messageMeta}>
          <Text style={[styles.messageTime, isMe && { color: "#FCE7F3" }]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {isMe && (
            <View style={styles.tickWrapper}>
              <TickIcon status={item.status ?? "sent"} />
            </View>
          )}
        </View>
      </View>
    );
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace(ROUTES.TABS.CHAT)}>
            <ArrowLeft size={24} color={colors.light.text} />
          </Pressable>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {String(name || "?").charAt(0).toUpperCase()}
              </Text>
            </View>

            <View>
              <Text style={styles.name}>{name || "Unknown"}</Text>
              <Text style={styles.status}>{phone || "No Number"}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Phone size={20} color={colors.light.text} />
            <Video size={20} color={colors.light.text} />
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={cachedMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.light.textSecondary}
            style={styles.input}
            onSubmitEditing={onSend}
            returnKeyType="send"
          />

          <Pressable style={styles.sendButton} onPress={onSend}>
            <SendHorizontal size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
  },

  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.primary,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.light.text,
  },

  status: {
    fontSize: 12,
    color: colors.light.success,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    gap: 18,
  },

  messages: {
    padding: 20,
  },

  messageContainer: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.light.primary,
    borderBottomRightRadius: 6,
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.light.card,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
  },

  messageText: {
    fontSize: 15,
    color: colors.light.text,
    lineHeight: 22,
  },

  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 6,
    gap: 4,
  },

  messageTime: {
    fontSize: 11,
    color: colors.light.textSecondary,
  },

  tickWrapper: {
    marginLeft: 2,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
  },

  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light.backgroundSecondary,
    paddingHorizontal: 18,
    color: colors.light.text,
    fontSize: 15,
  },

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
