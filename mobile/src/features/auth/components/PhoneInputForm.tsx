import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Phone } from "lucide-react-native";

import { styles } from "@/features/auth/styles/auth.styles";
import { colors } from "@/constants/colors";

interface PhoneInputFormProps {
  phone: string;
  setPhone: (value: string) => void;
  loading: boolean;
  error: string | null;
  setError: (value: string | null) => void;
  onSendOTP: () => void;
}

export default function PhoneInputForm({
  phone,
  setPhone,
  loading,
  error,
  setError,
  onSendOTP,
}: PhoneInputFormProps) {
  return (
    <View style={styles.stateContainer}>
      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.description}>
        Enter your mobile number to receive a 6-digit verification code.
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
        </View>

        <View style={styles.divider} />

        <Phone
          size={20}
          color={colors.light.textSecondary}
          style={styles.inputIcon}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={colors.light.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setError(null);
            setPhone(text.replace(/[^0-9]/g, ""));
          }}
          editable={!loading}
          maxLength={10}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        onPress={onSendOTP}
        disabled={loading}
        style={[styles.primaryButton, loading && styles.disabledButton]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
