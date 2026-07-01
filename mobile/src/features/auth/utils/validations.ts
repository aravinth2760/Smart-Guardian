const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
};

export const validateProfile = (name: string, email: string, role: string) => {
  if (!name.trim()) {
    return "Please enter your name";
  }

  if (!email.trim()) {
    return "Please enter your email";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }

  if (!role) {
    return "Please select your role";
  }

  return null;
};
