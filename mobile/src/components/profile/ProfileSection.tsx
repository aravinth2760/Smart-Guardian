import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

import colors from "@/constants/colors";

interface SectionItem {
  icon: LucideIcon;
  title: string;
  onPress?: () => void;
}

interface ProfileSectionProps {
  title: string;
  items: SectionItem[];
}

export default function ProfileSection({ title, items }: ProfileSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <Pressable key={index} style={styles.row} onPress={item.onPress}>
            <View style={styles.left}>
              <Icon size={20} color={colors.light.primary} />
              <Text style={styles.rowTitle}>{item.title}</Text>
            </View>

            <ChevronRight size={18} color={colors.light.textSecondary} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    paddingHorizontal: 24,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#9CA3AF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowTitle: {
    marginLeft: 16,
    fontSize: 14,
    color: colors.light.text,
  },
});
