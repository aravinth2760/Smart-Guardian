import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Shield, Bell } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "react-native";

import SOSButton from "@/components/common/SOSButton";
import colors from "@/constants/colors";

type HomeHeaderProps = {
  userName?: string;
  onSOSPress: () => void;
  sendingAlert?: boolean;
};

export default function HomeHeader({
  userName = "Aravinth",
  onSOSPress,
  sendingAlert = false,
}: HomeHeaderProps) {
  const clamp = (min: number, preferred: number, max: number) =>
    Math.max(min, Math.min(preferred, max));

  const { width } = useWindowDimensions();

  const appNameSize = clamp(18, width * 0.085, 22);
  const welcomeSize = clamp(16, width * 0.11, 18);
  const subtitleSize = clamp(12, width * 0.043, 14);
  const sosTitleSize = clamp(14, width * 0.06, 16);
  const sosDescSize = clamp(10, width * 0.04, 12);

  return (
    <View>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={[colors.light.gradientStart, colors.light.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {/* Header */}
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <Shield size={22} color="#fff" strokeWidth={2.5} />
              <Text style={[styles.appName, { fontSize: appNameSize }]}>
                Guardian
              </Text>
            </View>

            <TouchableOpacity style={styles.iconButton}>
              <Bell size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Welcome */}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={[styles.welcomeText, { fontSize: welcomeSize }]}
          >
            Welcome back, {userName} 👋
          </Text>

          <Text
            style={[
              styles.headerSubtitle,
              {
                fontSize: subtitleSize,
                lineHeight: subtitleSize * 1.5,
              },
            ]}
          >
            Keeping your family connected and protected.
          </Text>
        </View>
      </LinearGradient>

      {/* Floating SOS Card */}
      <View style={styles.sosWrapper}>
        <View style={styles.sosCard}>
          <View style={styles.sosContent}>
            <View style={styles.sosHeader}>
              <View style={styles.indicator} />
              <Text
                style={[
                  styles.sosTitle,
                  {
                    fontSize: sosTitleSize,
                  },
                ]}
                numberOfLines={2}
              >
                Emergency SOS
              </Text>
            </View>

            <Text
              style={[
                styles.sosDescription,
                {
                  fontSize: sosDescSize,
                  lineHeight: sosDescSize * 1.5,
                },
              ]}
            >
              Tap the SOS button to instantly notify all your guardians.
            </Text>
          </View>

          <SOSButton onPress={onSOSPress} disabled={sendingAlert} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 72,
    paddingBottom: 90,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  headerContent: {
    paddingHorizontal: 24,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  appName: {
    fontWeight: "800",
    color: "#fff",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  welcomeText: {
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.92)",
    width: "88%",
    fontWeight: "500",
  },

  sosWrapper: {
    marginTop: -70,
    paddingHorizontal: 24,
  },

  sosCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  sosContent: {
    flex: 1,
    paddingRight: 16,
  },

  sosHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    marginRight: 8,
  },

  sosTitle: {
    fontWeight: "800",
    color: "#DC2626",
    flexShrink: 1,
  },

  sosDescription: {
    color: colors.light.textSecondary,
  },
});
