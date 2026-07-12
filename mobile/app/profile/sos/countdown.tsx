import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";
import { RootState } from "@/store";
import { setSOSSettings } from "@/store/slices/sosSettingsSlice";
import { sosSettingsService } from "@/services/sos-settings.service";

const COUNTDOWN_OPTIONS = [0, 3, 5, 10, 15, 30];

export default function SOSCountdownScreen() {
  const dispatch = useDispatch();

  const sosSettings = useSelector((state: RootState) => state.sosSettings);

  const [saving, setSaving] = useState(false);

  const handleSelect = async (seconds: number) => {
    try {
      setSaving(true);

      const updatedSettings = await sosSettingsService.update({
        countdown: seconds,
      });

      dispatch(setSOSSettings(updatedSettings));

      Alert.alert("Success", `SOS countdown set to ${seconds} seconds`);
    } catch {
      Alert.alert("Error", "Failed to update countdown");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="SOS Countdown" />

      <View style={styles.container}>
        <Text style={styles.title}>Select countdown delay</Text>

        <Text style={styles.subtitle}>
          SOS will activate after selected time
        </Text>

        <View style={styles.options}>
          {COUNTDOWN_OPTIONS.map((seconds) => {
            const selected = sosSettings.countdown === seconds;

            return (
              <Pressable
                key={seconds}
                style={[
                  styles.option,
                  selected && styles.selected,
                  saving && styles.disabled,
                ]}
                disabled={saving}
                onPress={() => handleSelect(seconds)}
              >
                <Text
                  style={[styles.optionText, selected && styles.selectedText]}
                >
                  {seconds === 0 ? "Instant" : `${seconds} sec`}
                </Text>
              </Pressable>
            );
          })}
        </View>
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

  subtitle: {
    marginTop: 6,
    color: colors.light.textSecondary,
  },

  options: {
    marginTop: 25,
    gap: 12,
  },

  option: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
  },

  selected: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.primary,
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
  },

  selectedText: {
    color: "#fff",
  },

  disabled: {
    opacity: 0.6,
  },
});
