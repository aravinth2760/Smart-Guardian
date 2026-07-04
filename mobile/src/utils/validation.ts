import type { Relationship } from "@/types/auth";

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return "Phone number is required.";
  }

  if (!/^\d{10}$/.test(phone)) {
    return "Please enter a valid 10-digit phone number.";
  }

  return null;
};

export const validateOtp = (otp: string): string | null => {
  if (!otp.trim()) {
    return "OTP is required.";
  }

  if (!/^\d{6}$/.test(otp)) {
    return "Please enter a valid 6-digit OTP.";
  }

  return null;
};

export const validateProfile = (
  name: string,
  email: string,
  relationship: Relationship,
): string | null => {
  const cleanName = name.trim();
  const cleanEmail = email.trim();

  // NAME REQUIRED
  if (!cleanName) {
    return "Name is required.";
  }

  // NAME LENGTH
  if (cleanName.length < 3) {
    return "Name must be at least 3 characters.";
  }

  // NAME ONLY LETTERS + SPACES
  if (!/^[A-Za-z\s]+$/.test(cleanName)) {
    return "Name can only contain letters and spaces.";
  }

  // EMAIL REQUIRED
  if (!cleanEmail) {
    return "Email is required.";
  }

  // EMAIL FORMAT CHECK
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return "Please enter a valid email address.";
  }

  // RELATIONSHIP CHECK
  if (!relationship) {
    return "Please select a relationship.";
  }

  return null;
};
