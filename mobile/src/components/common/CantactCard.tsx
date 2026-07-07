import { StyleSheet, Text, View } from "react-native";
import { Phone, UserRound } from "lucide-react-native";

import colors from "@/constants/colors";

interface ContactCardProps {
  name: string;
  phone: string;
  status?: string;
}

export default function ContactCard({
  name,
  phone,
  status = "Active",
}: ContactCardProps) {
  const isActive = status.toLowerCase() === "active";

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <UserRound size={22} color={colors.light.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isActive
                    ? colors.light.success
                    : colors.light.textSecondary,
                },
              ]}
            />

            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.phoneRow}>
          <Phone size={14} color={colors.light.textSecondary} />
          <Text style={styles.phone}>{phone}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
    marginRight: 10,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },

  statusText: {
    fontSize: 11,
    color: colors.light.textSecondary,
    fontWeight: "600",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  phone: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: "500",
  },
});
