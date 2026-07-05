import api from "./client";

import type {
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  CompleteProfileRequest,
  CompleteProfileResponse,
} from "@/types/auth";

export const sendOtp = async (data: SendOtpRequest) => {
  const response = await api.post("/auth/send-otp", data);
  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await api.post("/auth/verify-otp", data);
  console.log("Verify OTP Response:", response.data); // Log the response data to see what is being returned
  return response.data;
};

export const completeProfile = async (
  data: CompleteProfileRequest,
): Promise<CompleteProfileResponse> => {
  const response = await api.post("/auth/complete-profile", data);
  return response.data;
};
