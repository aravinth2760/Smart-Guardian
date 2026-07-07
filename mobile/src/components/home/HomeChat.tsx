import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, MessageCircle } from "lucide-react-native";

import colors from "@/constants/colors";

export default function HomeChat() {
  const router = useRouter();
  const unreadMessages = 0;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.card}
        onPress={() => router.push("/(tabs)/chat")}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MessageCircle size={22} color="#FFFFFF" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Family Group</Text>
            <Text style={styles.subtitle}>
              Stay connected with your guardians and family members.
            </Text>
          </View>

          <ChevronRight size={20} color={colors.light.success} />
        </View>

        <View style={styles.divider} />

        <Text
          style={[
            styles.status,
            {
              color:
                unreadMessages > 0
                  ? colors.light.success
                  : colors.light.textSecondary,
            },
          ]}
        >
          {unreadMessages > 0
            ? `${unreadMessages} unread message${unreadMessages > 1 ? "s" : ""}`
            : "Everyone is caught up ✓"}
        </Text>
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
});
