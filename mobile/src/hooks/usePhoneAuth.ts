import { useEffect, useState } from "react";

import { sendOtp, verifyOtp } from "@/api/auth.api";

const usePhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Resend Timer
  useEffect(() => {
    if (!codeSent || resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [codeSent, resendTimer]);

  // Send OTP
  const handleSendOTP = async () => {
    if (phone.trim().length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await sendOtp({
        phone: `+91${phone.trim()}`,
      });

      setCodeSent(true);
      setResendTimer(60);

      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await verifyOtp({
        phone: `+91${phone.trim()}`,
        otp: otp.trim(),
      });

      return response;
    } catch (err: any) {
      setError(err?.message || "Invalid OTP.");
      return null;
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

    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    resetPhoneAuth,
  };
};

export default usePhoneAuth;
