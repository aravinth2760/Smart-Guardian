import { api } from "@/services/api";

export const checkUser = async (phone: string) => {
  return api("/auth/check-user", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
};

export const registerUser = async (
  firebaseUid: string,
  phone: string,
  name: string,
  email: string,
  role: string,
) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      firebaseUid,
      phone,
      name,
      email,
      role,
    }),
  });
};
