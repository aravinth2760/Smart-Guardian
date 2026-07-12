import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";

export default function TestSOSScreen() {
  const handleTestSOS = () => {
    Alert.alert(
      "Test SOS",
      "This is a test SOS alert. No emergency message will be sent.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start Test",
          onPress: () => {
            console.log("TEST SOS STARTED");
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Test SOS" />

      <View style={styles.container}>
        <Text style={styles.title}>Test your SOS system</Text>

        <Text style={styles.description}>
          Run a test to check how your SOS alert works without notifying
          emergency contacts.
        </Text>

        <Pressable style={styles.button} onPress={handleTestSOS}>
          <Text style={styles.buttonText}>Start Test SOS</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },

  button: {
    marginTop: 30,
    backgroundColor: colors.light.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
