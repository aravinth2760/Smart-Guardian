import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";

const usePhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Resend timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (codeSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [codeSent, resendTimer]);

  // Send OTP
  const sendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const auth = getAuth();
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`);

      setConfirm(confirmation);
      setCodeSent(true);
      setResendTimer(60);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!confirm) {
      Alert.alert("Error", "Please request an OTP first.");
      return false;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await confirm.confirm(otp);

      return true;
    } catch (err: any) {
      setError("Invalid OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset
  const resetPhoneAuth = () => {
    setCodeSent(false);
    setOtp("");
    setError(null);
    setResendTimer(60);
  };

  return {
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
  };
};
export default usePhoneAuth;
