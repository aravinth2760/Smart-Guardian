// React
import { useMemo, useState } from "react";

// React Native
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Third-party
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

// Constants
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

// Providers
import { useContacts } from "@/provider/ContactsProvider";

// Services
import { createPrivateChat } from "@/services/chat.service";

// Components
import ContactCard from "@/components/common/CantactCard";
import ScreenContainer from "@/components/common/ScreenContainer";
import SearchBar from "@/components/common/SearchBar";

export default function ContactScreen() {
  const { contacts, loaded } = useContacts();
  const [search, setSearch] = useState("");

  const filteredContacts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return contacts;
    }

    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(keyword) ||
        contact.phone.includes(search.trim()),
    );
  }, [contacts, search]);

  const handleContactPress = async (item: any) => {
    if (!item.isRegistered || !item.userId) {
      return;
    }

    try {
      const response = await createPrivateChat(item.userId);
      const chat = response.data.data;

      router.push(ROUTES.CHAT.ROOM(chat.id, item.name, item.phone));
    } catch (error) {
      console.log("Create chat error:", error);
    }
  };

  if (!loaded) {
    return <ScreenContainer loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.light.text} />
        </Pressable>

        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts..."
          />
        </View>
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ContactCard
            name={item.name}
            phone={item.phone}
            isRegistered={item.isRegistered}
            onPress={() => handleContactPress(item)}
            onInvite={() => {
              // TODO: Invite logic
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No contacts found</Text>

            <Text style={styles.emptySubtitle}>
              Try searching with another name or phone number.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.card,
  },

  searchContainer: {
    flex: 1,
  },

  listContainer: {
    paddingBottom: 20,
  },

  separator: {
    height: 8,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
