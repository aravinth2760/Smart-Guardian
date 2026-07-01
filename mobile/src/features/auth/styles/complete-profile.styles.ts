import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const completeProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.light.background,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    marginBottom: 32,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.light.text,
    backgroundColor: colors.light.card,
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: 12,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    backgroundColor: colors.light.card,
    justifyContent: "center",
    alignItems: "center",
  },

  roleButtonSelected: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },

  roleText: {
    color: colors.light.text,
    fontSize: 15,
    fontWeight: "600",
  },

  roleTextSelected: {
    color: colors.light.card,
  },

  errorText: {
    color: colors.light.emergency,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },

  button: {
    height: 56,
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.light.card,
    fontSize: 16,
    fontWeight: "600",
  },
});
