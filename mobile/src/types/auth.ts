// Relationship
export type Relationship =
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "grandfather"
  | "grandmother"
  | "guardian"
  | "other";

// Family Permission
export type Permission = "owner" | "manager" | "member";

// User
export interface User {
  id: string;
  familyId: string;

  name: string;
  phone: string;
  email: string;

  relationship: Relationship;
  permission: Permission;
}

// Redux Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;

  isAuthenticated: boolean;
}

// Request Types
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

// Response Types
export interface VerifyOtpResponse {
  success: boolean;
  isNewUser: boolean;

  accessToken?: string;
  user?: User;

  phone?: string;
}

export interface CompleteProfileResponse {
  success: boolean;

  accessToken: string;
  user: User;
}
