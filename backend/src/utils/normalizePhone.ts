export const normalizePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned;
  }

  throw new Error("Invalid phone number");
};
