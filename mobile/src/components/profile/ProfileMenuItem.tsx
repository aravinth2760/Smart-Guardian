import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

import colors from "@/constants/colors";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
  showBorder?: boolean;
}

export default function ProfileMenuItem({
  icon: Icon,
  title,
  onPress,
  showBorder = true,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.light.backgroundSecondary }}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        showBorder && styles.border,
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.light.primary} strokeWidth={2.2} />
        </View>

        <Text style={styles.title}>{title}</Text>
      </View>

      <ChevronRight
        size={20}
        color={colors.light.textSecondary}
        strokeWidth={2.2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light.card,
  },

  pressed: {
    backgroundColor: colors.light.backgroundSecondary,
  },

  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light.cardBorder,
  },

  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.light.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
  },
});
