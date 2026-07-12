import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useSelector } from "react-redux";
import { ArrowLeft, Info, Users } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";

import colors from "@/constants/colors";
import { RootState } from "@/store";
import { socket } from "@/services/socket";
import { getGroupMessages, sendGroupMessage } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
  };
};

type GroupMember = {
  id: string;
  name: string | null;
  phone: string;
  role: "owner" | "manager" | "member";
};

export default function GroupChatScreen() {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [group, setGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [role, setRole] = useState("member");

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let groupId: string | undefined;

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === newMessage.id);

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    const initialize = async () => {
      const groupData = await loadGroup();
      if (!groupData?.id) return;
      groupId = groupData.id;

      socket.on("new-message", handleNewMessage);
      const joinChat = () => {
        socket.emit("join-chat", groupId);
      };
      if (socket.connected) {
        joinChat();
      } else {
        socket.once("connect", joinChat);
      }

      await loadMessages();
    };

    void initialize();

    return () => {
      if (groupId) socket.emit("leave-chat", groupId);
      socket.off("new-message", handleNewMessage);
      socket.off("connect");
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadMessages();
    }, []),
  );

  const loadGroup = async () => {
    try {
      const res = await getMyGroup();

      const currentMember = (res.data.members as GroupMember[]).find(
        (member) => member.id === currentUserId,
      );
      const myRole = currentMember?.role ?? "member";
      setRole(myRole);

      setGroup(res.data);

      return res.data;
    } catch (err) {
      console.log("Load Group:", err);
      return null;
    }
  };

  const loadMessages = async () => {
    try {
      const res = await getGroupMessages();
      setMessages(res.data.data);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: false,
        });
      }, 200);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const value = text.trim();
    if (!value || sending) return;

    try {
      setSending(true);
      await sendGroupMessage(value);
      setText("");
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    } catch (err) {
      console.log("Send Message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.light.text} />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.avatar}>
              <Users size={20} color="#fff" />
            </View>

            <View>
              <Text style={styles.title}>Safety Circle</Text>

              <Text style={styles.subtitle}>Family Group</Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/chat/group-info",
                params: {
                  role: role,
                },
              })
            }
          >
            <Info size={22} color={colors.light.text} />
          </Pressable>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => {
            const isMe = item.sender.id === currentUserId;

            return (
              <View
                style={[
                  styles.messageContainer,
                  isMe && styles.myMessageContainer,
                ]}
              >
                {!isMe && (
                  <Text style={styles.senderName}>
                    {item.sender.name ?? "Unknown"}
                  </Text>
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

                <Text style={[styles.time, isMe && styles.myTime]}>
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
        />
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
            <Text style={styles.sendText}>
              {sending ? "Sending..." : "Send"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.cardBorder,
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 14,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  subtitle: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginTop: 2,
  },

  list: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },

  myMessageContainer: {
    alignItems: "flex-end",
  },

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

  messageText: {
    fontSize: 16,
    color: colors.light.text,
    lineHeight: 22,
  },

  myMessageText: {
    color: "#fff",
  },

  time: {
    marginTop: 4,
    fontSize: 11,
    color: colors.light.textSecondary,
    marginLeft: 10,
  },

  myTime: {
    marginRight: 10,
  },
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

  sendText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
