import colors from "@/constants/colors";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafetyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Safety Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 12,
    marginTop: 20,
  },
});
