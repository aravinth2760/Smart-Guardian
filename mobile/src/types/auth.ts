// Enums
export type Relationship =
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "grandfather"
  | "grandmother"
  | "guardian"
  | "other";

export type Permission = "owner" | "manager" | "member";

// Models
export interface User {
  id: string;

  familyId: string | null;

  name: string | null;
  phone: string;
  email: string | null;

  relationship: Relationship | null;
  role: Permission;

  profileCompleted: boolean;

  createdAt: string;
  updatedAt: string;
}

// Redux
export interface AuthState {
  user: User | null;

  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isNewUser: boolean;
}

// Requests
export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface CompleteProfileRequest {
  phone: string;
  name: string;
  email: string;
  relationship: Relationship;
}

// Responses
export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;

  data: {
    accessToken: string;
    refreshToken: string;

    isNewUser: boolean;

    user: User;
  };
}

export interface CompleteProfileResponse {
  success: boolean;
  message: string;
  data: User;
}
