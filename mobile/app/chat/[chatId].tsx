import { useEffect, useState, useRef } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Phone, Video, SendHorizontal } from "lucide-react-native";
import { useSelector } from "react-redux";

import { getMessages, sendMessage } from "@/services/chat.service";

import { useSocket } from "@/provider/SocketProvider";

import colors from "@/constants/colors";
import { RootState } from "@/store";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
};

export default function ChatDetailsScreen() {
  const { chatId, name, phone } = useLocalSearchParams<{
    chatId: string;
    name: string;
    phone: string;
  }>();

  const currentUser = useSelector((state: RootState) => state.auth?.user);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { socket } = useSocket();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    };

    const loadMessages = async () => {
      try {
        const res = await getMessages(chatId);
        setMessages(res.data.data);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({
            animated: false,
          });
        }, 100);
      } catch (err) {
        console.log(err);
      }
    };

    const joinChat = () => socket.emit("join-chat", chatId);
    if (socket.connected) {
      joinChat();
    } else {
      socket.once("connect", joinChat);
    }
    socket.on("new-message", handleNewMessage);
    void loadMessages();

    return () => {
      socket.emit("leave-chat", chatId);
      socket.off("new-message", handleNewMessage);
      socket.off("connect", joinChat);
    };
  }, [chatId]);

  const onSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage(chatId, message);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.senderId === currentUser?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMe && {
              color: "#fff",
            },
          ]}
        >
          {item.text}
        </Text>

        <Text
          style={[
            styles.messageTime,
            isMe && {
              color: "#FCE7F3",
            },
          ]}
        >
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace("/(tabs)/chat")}>
            <ArrowLeft size={24} color={colors.light.text} />
          </Pressable>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {String(name || "?")
                  .charAt(0)
                  .toUpperCase()}
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
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.light.textSecondary}
            style={styles.input}
          />

          <Pressable style={styles.sendButton} onPress={onSend}>
            <SendHorizontal size={20} color="#fff" />
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

  messageTime: {
    alignSelf: "flex-end",
    marginTop: 6,
    fontSize: 11,
    color: colors.light.textSecondary,
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
