import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Key } from "lucide-react-native";

import { styles } from "@/features/auth/styles/auth.styles";
import { colors } from "@/constants/colors";

interface OTPVerificationFormProps {
  phone: string;
  otp: string;
  setOtp: (value: string) => void;

  loading: boolean;
  error: string | null;
  setError: (value: string | null) => void;

  resendTimer: number;

  onVerify: () => void;
  onResend: () => void;
  onChangeNumber: () => void;
}

export default function OTPVerificationForm({
  phone,
  otp,
  setOtp,
  loading,
  error,
  setError,
  resendTimer,
  onVerify,
  onResend,
  onChangeNumber,
}: OTPVerificationFormProps) {
  return (
    <View style={styles.stateContainer}>
      <TouchableOpacity onPress={onChangeNumber} style={styles.backLinkRow}>
        <ArrowLeft size={16} color={colors.light.primary} />

        <Text style={styles.backLinkText}>Change Number</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Enter Code</Text>

      <Text style={styles.description}>
        We sent a 6-digit verification code to{"\n"}
        <Text style={styles.phoneLabel}>+91 {phone}</Text>
      </Text>

      <View style={styles.inputContainer}>
        <Key
          size={20}
          color={colors.light.textSecondary}
          style={styles.inputIcon}
        />

        <TextInput
          style={styles.codeInput}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor={colors.light.textSecondary}
          keyboardType="number-pad"
          value={otp}
          onChangeText={(text) => {
            setError(null);
            setOtp(text.replace(/[^0-9]/g, ""));
          }}
          editable={!loading}
          maxLength={6}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        onPress={onVerify}
        disabled={loading}
        style={[styles.primaryButton, loading && styles.disabledButton]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Verify & Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendRow}>
        {resendTimer > 0 ? (
          <Text style={styles.resendLabel}>
            Resend code in <Text style={styles.timer}>{resendTimer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={onResend} disabled={loading}>
            <Text style={styles.resendAction}>Resend OTP Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
