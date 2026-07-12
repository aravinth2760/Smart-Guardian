import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";
import {
  disableInvite,
  enableInvite,
  getMyGroup,
  regenerateInvite,
} from "@/services/group.service";

type Group = {
  id: string;
  name: string;
  inviteEnabled: boolean;
  inviteCode: string | null;
  role: "owner" | "manager" | "member";
};

export default function InviteScreen() {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadGroup();
  }, []);

  const loadGroup = async () => {
    setLoading(true);

    try {
      const res = await getMyGroup();

      setGroup(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to load group details.");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = async () => {
    if (!group?.inviteCode) {
      return;
    }

    await Clipboard.setStringAsync(group.inviteCode);

    Alert.alert("Copied", "Invite code copied to clipboard.");
  };

  const toggleInvite = async (value: boolean) => {
    try {
      if (value) {
        await enableInvite();
      } else {
        await disableInvite();
      }

      setGroup((prev) =>
        prev
          ? {
              ...prev,
              inviteEnabled: value,
            }
          : prev,
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to update invite settings.");
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateInvite();
      await loadGroup();

      Alert.alert("Success", "Invite code regenerated successfully.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to regenerate invite code.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text>Unable to load group.</Text>
      </SafeAreaView>
    );
  }

  const isOwnerOrManager = group.role === "owner" || group.role === "manager";

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Invite Settings" />

      <View style={styles.card}>
        <View>
          <Text style={styles.label}>Invite Enabled</Text>
          <Text style={styles.value}>
            {group.inviteEnabled
              ? "Anyone with the invite code can request to join."
              : "Joining via invite code is disabled."}
          </Text>
        </View>

        <Switch
          value={group.inviteEnabled}
          disabled={!isOwnerOrManager}
          onValueChange={toggleInvite}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Invite Code</Text>

        <Text style={styles.code}>{group.inviteCode ?? "Not Available"}</Text>

        {isOwnerOrManager && (
          <>
            <Pressable style={styles.secondaryButton} onPress={copyInviteCode}>
              <Text style={styles.secondaryButtonText}>Copy Invite Code</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleRegenerate}>
              <Text style={styles.buttonText}>Generate New Code</Text>
            </Pressable>
          </>
        )}
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

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.light.text,
  },

  value: {
    marginTop: 6,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },

  code: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.light.primary,
  },

  button: {
    marginTop: 20,
    backgroundColor: colors.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.light.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: colors.light.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
