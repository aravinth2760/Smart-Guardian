// React
import { useState } from "react";

// React Native
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Third-party
import { router } from "expo-router";

// Constants
import colors from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

// Services
import { createGroup, joinGroup } from "@/services/group.service";

// Components
import ScreenHeader from "@/components/common/ScreenHeader";

export default function SafetyCircleScreen() {
  const [inviteCode, setInviteCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreate = async () => {
    try {
      setCreating(true);

      await createGroup();

      Alert.alert("Success", "Your Safety Circle has been created.");

      router.replace(ROUTES.CHAT.GROUP.INDEX);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message ?? "Unable to create Safety Circle.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    const code = inviteCode.trim().toUpperCase();

    if (!code) {
      Alert.alert("Invite Code", "Please enter an invite code.");
      return;
    }

    try {
      setJoining(true);

      await joinGroup(code);

      Alert.alert(
        "Request Sent",
        "Your request has been sent to the Safety Circle owner.",
      );

      router.back();
    } catch (err: any) {
      Alert.alert(
        "Unable to Join",
        err?.response?.data?.message ?? "Something went wrong.",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Safety Circle" />

      <Text style={styles.subtitle}>
        Create a new Safety Circle or join an existing one using an invite code.
      </Text>

      {/* Create Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Safety Circle</Text>

        <Text style={styles.cardDescription}>
          Start your own private Safety Circle and invite trusted family
          members.
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleCreate}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create</Text>
          )}
        </Pressable>
      </View>

      {/* Join Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Join Safety Circle</Text>

        <Text style={styles.cardDescription}>
          Enter the invite code shared by the Safety Circle owner.
        </Text>

        <TextInput
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="Invite Code"
          autoCapitalize="characters"
          style={styles.input}
        />

        <Pressable
          style={styles.button}
          onPress={handleJoin}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Join</Text>
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
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },

  input: {
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 16,
  },

  button: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
