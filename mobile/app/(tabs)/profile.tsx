import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import {
  User,
  Shield,
  Users,
  MapPin,
  Bell,
  Globe,
  CircleHelp,
  FileText,
  LogOut,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSection from "@/components/profile/ProfileSection";
import LogoutButton from "@/components/profile/LogoutButton";

const accountItems = [
  {
    icon: User,
    title: "Edit Profile",
    onPress: () => {
      console.log("Edit Profile");
    },
  },
  {
    icon: Shield,
    title: "Personal Information",
    onPress: () => {
      console.log("Personal Information");
    },
  },
];

const safetyItems = [
  {
    icon: Users,
    title: "Manage Guardians",
    onPress: () => {
      console.log("Manage Guardians");
    },
  },
  {
    icon: Shield,
    title: "SOS Settings",
    onPress: () => {
      console.log("SOS Settings");
    },
  },
  {
    icon: MapPin,
    title: "Location Sharing",
    onPress: () => {
      console.log("Location Sharing");
    },
  },
];

const preferenceItems = [
  {
    icon: Bell,
    title: "Notifications",
    onPress: () => {
      console.log("Notifications");
    },
  },
  {
    icon: Globe,
    title: "Language",
    onPress: () => {
      console.log("Language");
    },
  },
];

const supportItems = [
  {
    icon: CircleHelp,
    title: "Help Center",
    onPress: () => {
      console.log("Help Center");
    },
  },
  {
    icon: FileText,
    title: "Privacy Policy",
    onPress: () => {
      console.log("Privacy Policy");
    },
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader />

        <ProfileSection title="ACCOUNT" items={accountItems} />

        <ProfileSection title="SAFETY" items={safetyItems} />

        <ProfileSection title="PREFERENCES" items={preferenceItems} />

        <ProfileSection title="SUPPORT" items={supportItems} />

        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  content: {
    paddingBottom: 40,
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginTop: 8,
  },
});
