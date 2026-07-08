import api from "./client";

import type {
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  CompleteProfileRequest,
  CompleteProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/auth";

export const sendOtp = async (data: SendOtpRequest) => {
  const response = await api.post("/auth/send-otp", data);
  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const completeProfile = async (
  data: CompleteProfileRequest,
): Promise<CompleteProfileResponse> => {
  const response = await api.post("/auth/complete-profile", data);
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const response = await api.put("/auth/update-profile", data);
  return response.data;
};
