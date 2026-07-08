import { useState } from "react";
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

import colors from "@/constants/colors";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
};

export default function ChatDetailsScreen() {
  const { chatId, name, phone } = useLocalSearchParams<{
    chatId: string;
    name: string;
    phone: string;
  }>();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello 👋",
      sender: "other",
      time: "10:20 AM",
    },
    {
      id: "2",
      text: "Hi, how are you?",
      sender: "me",
      time: "10:21 AM",
    },
    {
      id: "3",
      text: "I'm safe. Reached home.",
      sender: "other",
      time: "10:22 AM",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: "me",
        time: "Now",
      },
    ]);

    setMessage("");
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "me" && {
            color: "#fff",
          },
        ]}
      >
        {item.text}
      </Text>

      <Text
        style={[
          styles.messageTime,
          item.sender === "me" && {
            color: "#FCE7F3",
          },
        ]}
      >
        {item.time}
      </Text>
    </View>
  );

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

        {/* Messages */}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.light.textSecondary}
            style={styles.input}
          />

          <Pressable style={styles.sendButton} onPress={sendMessage}>
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
