import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";

import styles from "@/styles/auth.styles";
import AuthHeader from "@/components/auth/AuthHeader";
import PhoneInputForm from "@/components/auth/PhoneInputForm";
import OTPVerificationForm from "@/components/auth/OTPVerificationForm";
import usePhoneAuth from "@/hooks/usePhoneAuth";

import { login } from "@/store/slices/authSlice";

import { tokenService } from "@/services/token.service";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const {
    phone,
    setPhone,

    otp,
    setOtp,

    loading,
    error,
    setError,

    codeSent,
    resendTimer,

    sendOTP,
    verifyOTP,
    resetPhoneAuth,
  } = usePhoneAuth();

  const handleVerifyOTP = async () => {
    try {
      const response = await verifyOTP();

      if (!response) return;

      const { user, accessToken, refreshToken, isNewUser } = response.data;

      // Save tokens and user in SecureStore
      await tokenService.saveTokens(accessToken, refreshToken);
      await tokenService.saveUser(user);

      // Save auth state in Redux
      dispatch(
        login({
          user,
          accessToken,
          refreshToken,
          isNewUser,
        }),
      );

      // Navigate
      if (!isNewUser && user.profileCompleted) {
        router.replace("/home");
        return;
      }

      router.replace({
        pathname: "/complete-profile",
        params: {
          phone: user.phone ?? `+91${phone}`,
        },
      });
    } catch (err) {
      console.error("Verify OTP Error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />

        <View style={styles.formCard}>
          {!codeSent ? (
            <PhoneInputForm
              phone={phone}
              setPhone={setPhone}
              loading={loading}
              error={error}
              setError={setError}
              onSendOTP={sendOTP}
            />
          ) : (
            <OTPVerificationForm
              phone={phone}
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              error={error}
              setError={setError}
              resendTimer={resendTimer}
              onVerify={handleVerifyOTP}
              onResend={sendOTP}
              onChangeNumber={resetPhoneAuth}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to Smart Guardian's Terms of Service and
            Privacy Policy. SMS charges may apply.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
