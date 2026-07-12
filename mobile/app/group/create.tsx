import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import colors from "@/constants/colors";
import { createGroup } from "@/services/group.service";

export default function CreateGroupScreen() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);

      await createGroup();

      Alert.alert("Success", "Your Safety Circle has been created.");

      router.replace("/chat/group");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message ?? "Unable to create Safety Circle.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Safety Circle</Text>

        <Text style={styles.description}>
          Create a private Safety Circle to stay connected with your trusted
          family members. You can invite people and manage requests after the
          group is created.
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Safety Circle</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    justifyContent: "center",
    padding: 20,
  },

  content: {
    backgroundColor: colors.light.card,
    borderRadius: 16,
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },

  button: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
