import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import * as Contacts from "expo-contacts/legacy";

import colors from "@/constants/colors";
import ContactCard from "@/components/contacts/ContactCard";
import SearchBar from "@/components/common/SearchBar";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

export default function ContactScreen() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const formatPhone = (phone: string) => {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(-10);
    }
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return phone;
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const formattedContacts: Contact[] = data
        .filter((contact) => contact.phoneNumbers?.length)
        .map((contact) => ({
          id: contact.id,
          name: contact.name || "Unknown",
          phone: formatPhone(contact.phoneNumbers?.[0]?.number || ""),
        }));

      setContacts(formattedContacts);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone.includes(search),
    );
  }, [contacts, search]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.light.text} />
        </Pressable>

        <View style={styles.searchContainer}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ContactCard
            name={item.name}
            phone={item.phone}
            onPress={() =>
              router.push({
                pathname: "/chat/[chatId]",
                params: {
                  chatId: item.id,
                  name: item.name,
                  phone: item.phone,
                },
              })
            }
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
