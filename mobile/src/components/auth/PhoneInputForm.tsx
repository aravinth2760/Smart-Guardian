import { View, Text } from "react-native";
import { Phone } from "lucide-react-native";

import styles from "@/styles/auth.styles";
import AppTextInput from "@/components/common/AppTextInput";
import AppButton from "@/components/common/AppButton";

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

      <AppTextInput
        value={phone}
        onChangeText={(text) => {
          setError(null);
          setPhone(text.replace(/[^0-9]/g, ""));
        }}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
        Icon={Phone}
        error={error}
        isLogin={true}
      />

      <AppButton title="Send Code" onPress={onSendOTP} loading={loading} />
    </View>
  );
}
