import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";
import { RootState } from "@/store";
import { setSOSSettings } from "@/store/slices/sosSettingsSlice";
import { sosSettingsService } from "@/services/sos-settings.service";

const LOCATION_DURATION_OPTIONS = [
  {
    label: "15 Minutes",
    value: 15,
  },
  {
    label: "30 Minutes",
    value: 30,
  },
  {
    label: "1 Hour",
    value: 60,
  },
  {
    label: "Until SOS Ends",
    value: 0,
  },
];

export default function SOSLiveLocationDurationScreen() {
  const dispatch = useDispatch();
  const sosSettings = useSelector((state: RootState) => state.sosSettings);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (duration: number) => {
    try {
      setSaving(true);

      const updatedSettings = await sosSettingsService.update({
        liveLocationDuration: duration,
      });

      dispatch(setSOSSettings(updatedSettings));

      Alert.alert("Success", "Live location duration updated.");
    } catch {
      Alert.alert("Error", "Failed to update location duration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Live Location Duration" />

      <View style={styles.container}>
        <Text style={styles.title}>Location sharing duration</Text>

        <Text style={styles.description}>
          Choose how long your live location should be shared after SOS
          activation.
        </Text>

        <View style={styles.options}>
          {LOCATION_DURATION_OPTIONS.map((item) => {
            const selected = sosSettings.liveLocationDuration === item.value;
            return (
              <Pressable
                key={item.value}
                style={[
                  styles.option,
                  selected && styles.selectedOption,
                  saving && styles.disabled,
                ]}
                disabled={saving}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  style={[styles.optionText, selected && styles.selectedText]}
                >
                  {item.label}
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

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },

  options: {
    marginTop: 25,
    gap: 12,
  },

  option: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
  },

  selectedOption: {
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
