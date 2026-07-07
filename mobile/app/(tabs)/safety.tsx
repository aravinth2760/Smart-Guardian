import colors from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

export default function SafetyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Safety Screen</Text>
    </View>
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
