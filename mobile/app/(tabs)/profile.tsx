// React Native
import { ScrollView, StyleSheet } from "react-native";

// Third-party
import { router } from "expo-router";
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

// Constants
import { ROUTES } from "@/constants/routes";

// Components
import ScreenContainer from "@/components/common/ScreenContainer";
import SettinnsSection from "@/components/common/SettingsSection";
import LogoutButton from "@/components/profile/LogoutButton";
import ProfileHeader from "@/components/profile/ProfileHeader";

const accountItems = [
  {
    icon: User,
    title: "Edit Profile",
    onPress: () => router.push(ROUTES.PROFILE.EDIT),
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
    onPress: () => router.push(ROUTES.PROFILE.FAMILY_MEMBERS),
  },
  {
    icon: Shield,
    title: "SOS Settings",
    onPress: () => router.push(ROUTES.PROFILE.SOS.INDEX),
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
