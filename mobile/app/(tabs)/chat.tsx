import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import colors from "@/constants/colors";
import ChatCard from "@/components/chat/ChatCard";
import SearchBar from "@/components/common/SearchBar";
import FloatingButton from "@/components/chat/FloatingButton";

type Chat = {
  id: string;
  name: string;
  message: string;
  time: string;
  unread?: number;
  isSafetyCircle?: boolean;
};

const chats: Chat[] = [];

export default function ChatScreen() {
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;

    return chats.filter((chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

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
        isSafetyCircle={true}
        onPress={() => router.push(`/chat/0`)}
      />

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChatCard
            name={item.name}
            message={item.message}
            time={item.time}
            unread={item.unread}
            isSafetyCircle={item.isSafetyCircle}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No chats found</Text>

            <Text style={styles.emptySubtitle}>
              Start a new conversation using the + button.
            </Text>
          </View>
        }
      />

      <FloatingButton
        onPress={() => {
          router.push("/contacts");
        }}
      />
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
    paddingBottom: 100,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: colors.light.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
