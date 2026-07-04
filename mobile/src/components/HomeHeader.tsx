import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  Users,
  MapPin,
  Activity,
  LucideIcon,
  Shield,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import colors from "@/constants/colors";
import useLocationCheck from "@/hooks/useLocationCheck";

type HomeHeaderProps = {
  contacts: number;
  userName?: string;
};

export default function HomeHeader({
  contacts,
  userName = "Aravinth",
}: HomeHeaderProps) {
  const { locationEnabled } = useLocationCheck();

  const stats: {
    Icon: LucideIcon;
    value: string | number;
    label: string;
  }[] = [
    {
      Icon: Users,
      value: contacts,
      label: "Guardians",
    },
    {
      Icon: MapPin,
      value: locationEnabled ? "Live" : "Off",
      label: "Location",
    },
    {
      Icon: Activity,
      value: "Safe",
      label: "Status",
    },
  ];

  return (
    <LinearGradient
      colors={[colors.light.gradientStart, colors.light.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        {/* TOP */}
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <Shield size={26} color="#fff" strokeWidth={2.5} />
            <Text style={styles.appName}>Smart Guardian</Text>
          </View>
        </View>

        {/* WELCOME */}
        <Text style={styles.welcomeText}>Welcome back, {userName} 👋</Text>

        <Text style={styles.headerSubtitle}>
          Protecting you and your loved ones, whenever help is needed.
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {stats.map(({ Icon, value, label }, index) => (
          <React.Fragment key={label}>
            <View style={styles.statCard}>
              <Icon size={20} strokeWidth={2.2} color={colors.light.primary} />
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>

            {index !== stats.length - 1 && <View style={styles.statDivider} />}
          </React.Fragment>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 54,
    paddingBottom: 22,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  headerContent: {
    paddingHorizontal: 24,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },

  welcomeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },

  headerSubtitle: {
    width: "92%",
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 22,
    marginHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  statDivider: {
    width: 1,
    height: 58,
    alignSelf: "center",
    backgroundColor: "#E5E7EB",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },

  statLabel: {
    fontSize: 11,
    color: colors.light.textSecondary,
  },
});
