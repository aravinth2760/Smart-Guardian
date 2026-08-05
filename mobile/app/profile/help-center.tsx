import {
  Mail,
  MessageCircleQuestion,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";

const theme = colors.light;

export default function HelpCenterScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Help Center" showBack />

      <View style={styles.container}>
        <Text style={styles.description}>
          Find answers to common questions and learn how to use Guardian safely.
        </Text>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <ShieldAlert size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Emergency SOS</Text>
            <Text style={styles.subtitle}>
              Press and hold the SOS button to notify your guardians during an
              emergency.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MessageCircleQuestion size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Family & Chat</Text>
            <Text style={styles.subtitle}>
              Add guardians, create your safety circle, and communicate through
              private or group chats.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <TriangleAlert size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Report a Problem</Text>
            <Text style={styles.subtitle}>
              If something isn't working as expected, contact our support team.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Mail size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Contact Support</Text>
            <Text style={styles.subtitle}>
              aravinth2760@gmail.com{"\n"}
              Monday – Friday • 9:00 AM – 6:00 PM
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>App Version</Text>
          <Text style={styles.footerText}>Guardian v1.0.0</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  description: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },

  card: {
    flexDirection: "row",
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 21,
  },

  footer: {
    marginTop: 12,
    alignItems: "center",
  },

  footerTitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },

  footerText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.text,
  },
});
