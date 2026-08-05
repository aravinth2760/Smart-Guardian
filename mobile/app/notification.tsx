import { router } from "expo-router";
import { ArrowRight, Bell } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

const theme = colors.light;

export default function NotificationScreen() {
  // Replace with API data
  const notifications: any[] = [];

  return (
    <ScreenContainer>
      <ScreenHeader title="Notifications" showBack />

      {notifications.length === 0 && (
        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Bell size={52} color={theme.primary} strokeWidth={2} />
          </View>

          <Text style={styles.title}>No Notifications Yet</Text>

          <Text style={styles.description}>
            You're all caught up. We'll notify you about SOS alerts, new
            messages, guardian activity, and important family updates.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.replace(ROUTES.TABS.HOME)}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
            <ArrowRight size={18} color={theme.card} />
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 80,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 12,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.textSecondary,
    textAlign: "center",
    marginBottom: 36,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,

    shadowColor: theme.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  buttonText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: "600",
  },
});
