import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { LucideIcon } from "lucide-react-native";

import colors from "@/constants/colors";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  Icon?: LucideIcon;
}

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  Icon,
}: AppButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.primaryButton, isDisabled && styles.disabledButton]}
    >
      {loading ? (
        <ActivityIndicator color={colors.light.card} />
      ) : (
        <View style={styles.buttonContent}>
          {Icon && <Icon size={20} color="#fff" strokeWidth={2.2} />}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: colors.light.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // If your RN version doesn't support gap, use marginRight on the Icon instead.
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
