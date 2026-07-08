import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Shield, UserRound } from "lucide-react-native";

import colors from "@/constants/colors";

type ChatCardProps = {
  name: string;
  message: string;
  time?: string;
  unread?: number;
  isSafetyCircle?: boolean;
  onPress: () => void;
};

function ChatCard({
  name,
  message,
  time,
  unread = 0,
  isSafetyCircle = false,
  onPress,
}: ChatCardProps) {
  return (
    <Pressable
      style={[styles.container, isSafetyCircle && styles.safetyContainer]}
      onPress={onPress}
    >
      <View style={[styles.avatar, isSafetyCircle && styles.safetyAvatar]}>
        {isSafetyCircle ? (
          <Shield size={24} color={colors.light.primary} strokeWidth={2.2} />
        ) : (
          <UserRound
            size={24}
            color={colors.light.textSecondary}
            strokeWidth={2.2}
          />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            numberOfLines={1}
            style={[styles.name, isSafetyCircle && styles.safetyTitle]}
          >
            {name}
          </Text>

          {time ? (
            <Text style={styles.time}>{time}</Text>
          ) : (
            <ChevronRight size={18} color={colors.light.textTertiary} />
          )}
        </View>

        <View style={styles.footer}>
          <Text numberOfLines={1} style={styles.message}>
            {message}
          </Text>

          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unread > 99 ? "99+" : unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default memo(ChatCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  safetyContainer: {
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.backgroundSecondary,
  },

  safetyAvatar: {
    backgroundColor: colors.light.primaryLight,
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
    marginRight: 8,
  },

  safetyTitle: {
    color: colors.light.primary,
  },

  time: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },

  message: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textSecondary,
    marginRight: 10,
  },

  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
