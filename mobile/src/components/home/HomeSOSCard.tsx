import { View, Text, StyleSheet } from "react-native";

import SOSButton from "@/components/common/SOSButton";
import colors from "@/constants/colors";

interface HomeSOSCardProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function HomeSOSCard({ onPress, disabled }: HomeSOSCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.indicator} />
            <Text style={styles.title}>Emergency SOS</Text>
          </View>

          <Text style={styles.description}>
            Tap the button to instantly{"\n"}
            send emergency alert to guardians
          </Text>
        </View>

        <SOSButton onPress={onPress} disabled={disabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 24,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  content: {
    flex: 1,
    gap: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.light.emergency,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.light.emergency,
  },

  description: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
});
