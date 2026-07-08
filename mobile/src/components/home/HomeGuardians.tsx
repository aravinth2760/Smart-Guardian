import { View, Text, StyleSheet } from "react-native";
import { ShieldCheck } from "lucide-react-native";

import ContactCard from "@/components/common/CantactCard";
import Colors from "@/constants/colors";

interface HomeGuardianProps {
  contacts: any[];
}

export default function HomeGuardian({ contacts }: HomeGuardianProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Your Guardians</Text>

      {contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.iconContainer}>
            <ShieldCheck size={26} color={Colors.light.success} />
          </View>

          <Text style={styles.emptyTitle}>No guardians available</Text>

          <Text style={styles.emptyDescription}>
            Your trusted guardians will appear here once they have been added to
            your account.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {contacts.map((contact: any) => (
            <ContactCard
              key={contact.id}
              name={contact.name}
              phone={contact.phone}
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
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 16,
  },

  list: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
  },

  emptyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    textAlign: "center",
  },
});
