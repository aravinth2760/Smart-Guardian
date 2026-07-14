import { router } from "expo-router";
import { LucideIcon, ArrowLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  avatarIcon?: LucideIcon;
  rightComponent?: ReactNode;
};

export default function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  avatarIcon: AvatarIcon,
  rightComponent,
}: Props) {
  return (
    <View style={styles.header}>
      {showBack && (
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.light.text} />
        </Pressable>
      )}

      {AvatarIcon && (
        <View style={styles.avatar}>
          <AvatarIcon size={20} color="#fff" />
        </View>
      )}

      <View style={[styles.content, !showBack && styles.noBackContent]}>
        <Text style={styles.title}>{title}</Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {rightComponent && (
        <View style={styles.rightComponent}>{rightComponent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    marginRight: 12,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  noBackContent: {
    marginLeft: 0,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.light.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.light.textSecondary,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  rightComponent: {
    marginRight: 8,
  },
});
