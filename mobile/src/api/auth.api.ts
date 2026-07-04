// import api from "./client";

// import type {
//   SendOtpRequest,
//   VerifyOtpRequest,
//   VerifyOtpResponse,
//   CompleteProfileRequest,
//   CompleteProfileResponse,
// } from "@/types/auth";

// export const sendOtp = async (data: SendOtpRequest) => {
//   const response = await api.post("/auth/send-otp", data);
//   return response.data;
// };

// export const verifyOtp = async (
//   data: VerifyOtpRequest,
// ): Promise<VerifyOtpResponse> => {
//   const response = await api.post("/auth/verify-otp", data);
//   return response.data;
// };

// export const completeProfile = async (
//   data: CompleteProfileRequest,
// ): Promise<CompleteProfileResponse> => {
//   const response = await api.post("/auth/complete-profile", data);
//   return response.data;
// };

import type {
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  CompleteProfileRequest,
  CompleteProfileResponse,
} from "@/types/auth";

// Mock - Send OTP
export const sendOtp = async (_data: SendOtpRequest): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return;
};

// Mock - Verify OTP
export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Existing User
  if (data.phone === "+916385686150") {
    return {
      success: true,
      isNewUser: false,
      accessToken: "mock-jwt-token",
      user: {
        id: "1",
        familyId: "family-001",
        name: "Aravinth",
        phone: data.phone,
        email: "aravinth@gmail.com",
        relationship: "son",
        permission: "owner",
      },
    };
  }

  // New User
  return {
    success: true,
    isNewUser: true,
    phone: data.phone,
  };
};

// Mock - Complete Profile
export const completeProfile = async (
  data: CompleteProfileRequest,
): Promise<CompleteProfileResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    accessToken: "mock-jwt-token",
    user: {
      id: "2",
      familyId: "family-001",
      name: data.name,
      phone: "+910000000000", // phone-ஐ request-ல சேர்த்தால் இதை அதிலிருந்து பயன்படுத்தலாம்
      email: data.email,
      relationship: data.relationship,
      permission: "member",
    },
  };
};
