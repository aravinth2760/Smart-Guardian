import { View, TextInput, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

import colors from "@/constants/colors";

interface AppTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  maxLength?: number;
  editable?: boolean;
  Icon?: LucideIcon;
  error?: string | null;
  isLogin?: boolean;
}

export default function AppTextInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  editable = true,
  Icon,
  error,
  isLogin = false,
}: AppTextInputProps) {
  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={[styles.inputContainer, !editable && styles.disabledContainer]}
      >
        {isLogin && (
          <>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>

            <View style={styles.divider} />
          </>
        )}

        {Icon && (
          <Icon
            size={20}
            color={colors.light.textSecondary}
            style={styles.inputIcon}
          />
        )}

        <TextInput
          style={[styles.input, !editable && styles.disabledInput]}
          placeholder={placeholder}
          placeholderTextColor={colors.light.textSecondary}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          maxLength={maxLength}
          cursorColor={editable ? colors.light.primary : "transparent"}
          selectionColor={colors.light.primary}
          selectTextOnFocus={editable}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  disabledContainer: {
    backgroundColor: colors.light.backgroundSecondary,
    borderColor: colors.light.cardBorder,
  },
  countryCode: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.light.cardBorder,
    marginRight: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: colors.light.text,
    fontSize: 16,
  },
  disabledInput: {
    color: colors.light.textSecondary,
  },
  inputIcon: {
    marginRight: 10,
  },
  errorText: {
    color: colors.light.emergency,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 16,
    paddingLeft: 4,
  },
});
