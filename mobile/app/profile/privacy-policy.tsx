import { Bell, Lock, MapPin, ShieldCheck, User } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";

const theme = colors.light;

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Privacy Policy" showBack />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Your privacy is important to us. Guardian is committed to protecting
          your personal information and ensuring your data is handled securely.
        </Text>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <User size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Information We Collect</Text>
            <Text style={styles.subtitle}>
              We may collect your name, email address, phone number, and profile
              information to provide Guardian services.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MapPin size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Location Data</Text>
            <Text style={styles.subtitle}>
              Your location is shared only with your approved guardians during
              normal use or emergency SOS events, based on your permissions.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Bell size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              We send notifications for SOS alerts, messages, and important
              safety updates to keep you informed.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Lock size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Data Security</Text>
            <Text style={styles.subtitle}>
              We use secure technologies and encrypted communication to help
              protect your personal information from unauthorized access.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <ShieldCheck size={22} color={theme.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Your Privacy Rights</Text>
            <Text style={styles.subtitle}>
              You can update your profile information, manage permissions, and
              control notification preferences at any time.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Last Updated</Text>
          <Text style={styles.footerText}>August 2026</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
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
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 16,
    marginBottom: 16,
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
    alignItems: "center",
    marginTop: 12,
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
