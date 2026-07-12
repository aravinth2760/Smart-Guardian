import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";
import { RootState } from "@/store";
import { setSOSSettings } from "@/store/slices/sosSettingsSlice";
import { sosSettingsService } from "@/services/sos-settings.service";

const DEFAULT_MESSAGE =
  "🚨 I need help! This is an emergency. My live location is being shared. Please contact me immediately.";

const MAX_LENGTH = 200;

export default function SOSMessageScreen() {
  const dispatch = useDispatch();

  const sosSettings = useSelector((state: RootState) => state.sosSettings);

  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing && sosSettings.message) {
      setMessage(sosSettings.message);
    }
  }, [sosSettings.message, isEditing]);

  const handleChangeMessage = (text: string) => {
    setIsEditing(true);
    setMessage(text);
  };

  const handleReset = () => {
    setMessage(DEFAULT_MESSAGE);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updatedSettings = await sosSettingsService.update({
        message,
      });

      dispatch(setSOSSettings(updatedSettings));

      setIsEditing(false);

      Alert.alert("Success", "SOS message updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update SOS message.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="SOS Message" />

      <View style={styles.container}>
        <Text style={styles.label}>Emergency Message</Text>

        <TextInput
          style={styles.input}
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={handleChangeMessage}
          maxLength={MAX_LENGTH}
          placeholder="Enter your emergency message..."
          placeholderTextColor={colors.light.textSecondary}
          editable={!saving}
        />

        <Text style={styles.count}>
          {message.length}/{MAX_LENGTH}
        </Text>

        <Pressable
          style={[styles.resetButton, saving && styles.disabled]}
          onPress={handleReset}
          disabled={saving}
        >
          <Text style={styles.resetText}>Reset to Default</Text>
        </Pressable>

        <Pressable
          style={[styles.saveButton, saving && styles.disabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
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

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: 10,
  },

  input: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.light.text,
  },

  count: {
    marginTop: 8,
    alignSelf: "flex-end",
    color: colors.light.textSecondary,
    fontSize: 13,
  },

  resetButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.primary,
  },

  resetText: {
    color: colors.light.primary,
    fontWeight: "600",
    fontSize: 16,
  },

  saveButton: {
    marginTop: 14,
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  disabled: {
    opacity: 0.6,
  },
});
