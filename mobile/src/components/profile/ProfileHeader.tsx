import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import colors from "@/constants/colors";

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export default function ProfileHeader({ name, email }: ProfileHeaderProps) {
  const avatarInitial = name.charAt(0).toUpperCase();

  return (
    <LinearGradient
      colors={[colors.light.gradientStart, colors.light.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitial}</Text>
        </View>

        <Text style={styles.name}>{name}</Text>

        <Text style={styles.email}>{email}</Text>

        <Text style={styles.tagline}>Stay Safe Always ❤️</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  content: {
    alignItems: "center",
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  email: {
    marginTop: 6,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },

  tagline: {
    marginTop: 14,
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
  },
});
