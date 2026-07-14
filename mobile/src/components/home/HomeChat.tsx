import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, MessageCircle } from "lucide-react-native";

import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

interface HomeChatProps {
  groupUnread?: number;
  groupId?: string | undefined;
  groupMember?: number;
}

export default function HomeChat({
  groupUnread = 0,
  groupId,
  groupMember,
}: HomeChatProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push(
            groupId ? ROUTES.CHAT.GROUP.INDEX : ROUTES.CHAT.GROUP.SETUP,
          )
        }
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MessageCircle size={22} color="#FFFFFF" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              {groupId ? "Family Group" : "No Groups Yet"}
            </Text>

            <Text style={styles.subtitle}>
              {groupId
                ? groupMember
                  ? "Stay connected with your guardians and family members."
                  : "No members yet. Add your family and guardians to this group."
                : "You haven't created or joined any groups yet."}
            </Text>
          </View>

          {groupUnread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {groupUnread > 99 ? "99+" : groupUnread}
              </Text>
            </View>
          )}

          <ChevronRight size={20} color={colors.light.success} />
        </View>
        {groupId && groupMember && (
          <>
            <View style={styles.divider} />

            <Text
              style={[
                styles.status,
                {
                  color:
                    groupUnread > 0
                      ? colors.light.success
                      : colors.light.textSecondary,
                },
              ]}
            >
              <Text style={styles.status}>
                {groupUnread > 0
                  ? `${groupUnread} unread message${groupUnread > 1 ? "s" : ""}`
                  : "No new messages ✓"}
              </Text>
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 28,
  },

  card: {
    backgroundColor: colors.light.successLight,
    borderRadius: 20,
    padding: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.light.success,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.light.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.light.successLight,
    marginVertical: 14,
  },

  status: {
    fontSize: 13,
    fontWeight: "600",
  },

  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 8,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
