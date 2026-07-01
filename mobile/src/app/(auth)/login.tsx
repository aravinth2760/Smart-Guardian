import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";
import { router } from "expo-router";

import {
  styles,
  AuthHeader,
  PhoneInputForm,
  OTPVerificationForm,
  usePhoneAuth,
  checkUser,
  setUser,
} from "@/features/auth/index";
import { useDispatch } from "react-redux";

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
    const success = await verifyOTP();

    if (!success) return;

    try {
      const response = await checkUser("+91" + phone);

      dispatch(
        setUser({
          firebaseUid: response.user.firebase_uid,
          phoneNumber: response.user.phone,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
        }),
      );

      if (response.exists) {
        router.replace("/home");
      } else {
        router.replace("/complete-profile");
      }
    } catch (error) {
      console.log("Error : ", error);
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
            By continuing, you agree to Guardian's Terms of Service and Privacy
            Policy. SMS charges may apply.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
