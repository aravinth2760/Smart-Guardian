import { View, Text } from "react-native";
import { Shield } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "@/features/auth/styles/auth.styles";
import { colors } from "@/constants/colors";

export default function AuthHeader() {
  return (
    <LinearGradient
      colors={[colors.light.gradientStart, colors.light.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <View style={styles.logoRow}>
          <Shield size={36} color="#FFFFFF" strokeWidth={2.5} />

          <Text style={styles.appName}>Guardian</Text>
        </View>

        <Text style={styles.headerSubtitle}>Secure Mobile Verification</Text>
      </View>
    </LinearGradient>
  );
}
