import { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSelector } from "react-redux";

import { getChats } from "@/services/chat.service";
import { useContacts } from "@/provider/ContactsProvider";
import { RootState } from "@/store";

import colors from "@/constants/colors";
import ChatCard from "@/components/chat/ChatCard";
import SearchBar from "@/components/common/SearchBar";
import FloatingButton from "@/components/chat/FloatingButton";

type Chat = {
  id: string;
  type: "private" | "group";
  members: {
    user: {
      id: string;
      name: string | null;
      phone: string;
    };
  }[];
  messages: {
    id: string;
    text: string;
    createdAt: string;
  }[];
};

export default function ChatScreen() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const { loaded, getName } = useContacts();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await getChats();
        setChats(res.data.data);
      } catch (error) {
        console.log("Load chats error:", error);
      }
    };

    void loadChats();
  }, []);

  const filteredChats = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return chats.filter((chat) => {
      const otherUser = chat.members.find(
        (member) => member.user.id !== currentUserId,
      )?.user;

      const displayName = getName(otherUser?.phone, otherUser?.name ?? "");

      if (!keyword) {
        return true;
      }

      return (
        displayName.toLowerCase().includes(keyword) ||
        otherUser?.phone?.includes(search.trim())
      );
    });
  }, [chats, search, currentUserId, getName]);

  if (!loaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      <View style={{ marginBottom: 16 }}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <ChatCard
        name="Safety Circle"
        message="Stay connected with your trusted family."
        time=""
        isSafetyCircle
        onPress={() =>
          router.push({
            pathname: "/chat/[chatId]",
            params: {
              chatId: "0",
              name: "Safety Circle",
              phone: "",
            },
          })
        }
      />

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const otherUser = item.members.find(
            (member) => member.user.id !== currentUserId,
          )?.user;

          const displayName = getName(
            otherUser?.phone,
            otherUser?.name ?? "Unknown",
          );

          return (
            <ChatCard
              name={displayName}
              message={item.messages[0]?.text ?? ""}
              time={
                item.messages[0]
                  ? new Date(item.messages[0].createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : ""
              }
              onPress={() =>
                router.push({
                  pathname: "/chat/[chatId]",
                  params: {
                    chatId: item.id,
                    name: displayName,
                    phone: otherUser?.phone ?? "",
                  },
                })
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

      <FloatingButton onPress={() => router.push("/contacts")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: 10,
  },

  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: 2,
  },

  list: {
    paddingTop: 8,
    paddingBottom: 100,
  },

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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },
});
