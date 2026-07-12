import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import {
  Bell,
  CircleHelp,
  FileText,
  Globe,
  MapPin,
  Shield,
  User,
  Users,
} from "lucide-react-native";

import LogoutButton from "@/components/profile/LogoutButton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SettinnsSection from "@/components/common/SettingsSection";
import ScreenContainer from "@/components/common/ScreenContainer";

const accountItems = [
  {
    icon: User,
    title: "Edit Profile",
    onPress: () => router.push("/profile/edit"),
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
    onPress: () => router.push("/profile/family-members"),
  },
  {
    icon: Shield,
    title: "SOS Settings",
    onPress: () => router.push("/profile/sos"),
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
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader />

        <SettinnsSection title="ACCOUNT" items={accountItems} />

        <SettinnsSection title="SAFETY" items={safetyItems} />

        <SettinnsSection title="PREFERENCES" items={preferenceItems} />

        <SettinnsSection title="SUPPORT" items={supportItems} />

        <LogoutButton />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
});
