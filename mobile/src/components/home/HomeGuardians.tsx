import { View, Text, StyleSheet } from "react-native";
import { Phone } from "lucide-react-native";

import ContactCard from "@/components/common/CantactCard";
import Colors from "@/constants/colors";

interface GuardiansListProps {
  contacts: any[];
  removeContact: (id: string) => void;
  router: any;
}

export default function GuardiansList({
  contacts,
  removeContact,
  router,
}: GuardiansListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Guardians</Text>

        <Text
          style={styles.addButton}
          onPress={() => router.push("/add-contact")}
        >
          Add New
        </Text>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Phone size={28} color={Colors.light.primary} />
          </View>

          <Text style={styles.emptyTitle}>No guardians yet</Text>

          <Text style={styles.emptyDescription}>
            Add family members or trusted contacts who will receive your
            emergency SOS alerts.
          </Text>

          <Text
            style={styles.emptyAction}
            onPress={() => router.push("/add-contact")}
          >
            Add your first guardian
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {contacts.map((contact: any) => (
            <ContactCard
              key={contact.id}
              name={contact.name}
              phone={contact.phone}
              relationship={contact.relationship}
              onDelete={() => removeContact(contact.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },

  addButton: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
  },

  list: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  emptyCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.light.cardBorder,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 18,
  },

  emptyAction: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.primary,
  },
});
