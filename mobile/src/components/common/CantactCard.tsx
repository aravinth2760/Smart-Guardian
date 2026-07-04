import { Pressable, StyleSheet, Text, View } from "react-native";
import { Phone, Trash2 } from "lucide-react-native";

import Colors from "@/constants/colors";

interface ContactCardProps {
  name: string;
  phone: string;
  relationship: string;
  onDelete: () => void;
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  Parent: Colors.light.primary,
  Guardian: "#8B5CF6",
  Sibling: "#3B82F6",
  Relative: "#F59E0B",
  Teacher: "#22C55E",
  Friend: "#06B6D4",
  Neighbor: "#EC4899",
  Other: Colors.light.textSecondary,
};

export default function ContactCard({
  name,
  phone,
  relationship,
  onDelete,
}: ContactCardProps) {
  const accentColor = RELATIONSHIP_COLORS[relationship] ?? Colors.light.primary;

  return (
    <View style={styles.card}>
      {/* Content */}
      <View style={styles.content}>
        {/* Name + Relationship */}
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>

          <View
            style={[
              styles.relationshipBadgeInline,
              { backgroundColor: `${accentColor}18` },
            ]}
          >
            <Text
              style={[styles.relationshipTextInline, { color: accentColor }]}
            >
              {relationship}
            </Text>
          </View>
        </View>

        {/* Phone */}
        <View style={styles.phoneRow}>
          <Phone size={13} color={Colors.light.textSecondary} />
          <Text style={styles.phone}>{phone}</Text>
        </View>
      </View>

      {/* Delete */}
      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${name}`}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deletePressed,
        ]}
      >
        <Trash2 size={18} color={Colors.light.emergency} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  content: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginRight: 8,
  },

  relationshipBadgeInline: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  relationshipTextInline: {
    fontSize: 9,
    fontWeight: "600",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  phone: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },

  deletePressed: {
    opacity: 0.7,
    backgroundColor: "#FEE2E2",
  },
});
