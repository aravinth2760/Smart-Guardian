import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Bell,
  CircleHelp,
  Info,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react-native";

import colors from "@/constants/colors";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";
import LogoutButton from "@/components/profile/LogoutButton";

export default function ProfileScreen() {
  const user = {
    name: "Manivannan",
    email: "manivannan@gmail.com",
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader name={user.name} email={user.email} />

      <View style={styles.content}>
        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          <ProfileMenuItem
            icon={UserRound}
            title="Edit Profile"
            onPress={() => {}}
          />
        </View>

        {/* Safety */}
        <Text style={styles.sectionTitle}>Safety</Text>

        <View style={styles.card}>
          <ProfileMenuItem
            icon={Users}
            title="Guardians"
            onPress={() => router.push("/(tabs)/home")}
          />

          <ProfileMenuItem
            icon={MapPin}
            title="Live Location"
            onPress={() => router.push("/(tabs)/home")}
          />

          <ProfileMenuItem
            icon={ShieldCheck}
            title="Safety Tips"
            onPress={() => router.push("/safety-tips")}
          />

          <ProfileMenuItem
            icon={Bell}
            title="Notifications"
            onPress={() => {}}
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.card}>
          <ProfileMenuItem
            icon={CircleHelp}
            title="Help & Support"
            onPress={() => {}}
          />

          <ProfileMenuItem icon={Info} title="About" onPress={() => {}} />
        </View>

        <LogoutButton />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 12,
    marginTop: 20,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    overflow: "hidden",
  },
});
