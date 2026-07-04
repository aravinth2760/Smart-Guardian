import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Key } from "lucide-react-native";

import styles from "@/styles/auth.styles";
import colors from "@/constants/colors";
import AppTextInput from "@/components/common/AppTextInput";
import AppButton from "../common/AppButton";

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

      <AppTextInput
        value={otp}
        onChangeText={(text) => {
          setError(null);
          setOtp(text.replace(/[^0-9]/g, ""));
        }}
        placeholder="Enter 6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
        Icon={Key}
        error={error}
      />

      <AppButton title="Verify & Login" onPress={onVerify} loading={loading} />

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
