import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

export default StyleSheet.create({
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
    lineHeight: 22,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: 12,
  },

  // ================= INPUT =================
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.light.text,
    backgroundColor: colors.light.card,
    marginBottom: 18,
  },

  // ================= DROPDOWN =================
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 14,
    backgroundColor: colors.light.card,
    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.light.text,
  },

  // ================= MODAL =================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: colors.light.card,
    borderRadius: 16,
    paddingVertical: 8,
    maxHeight: "60%",
  },

  optionItem: {
    padding: 16,
  },

  optionSelected: {
    backgroundColor: colors.light.primaryLight,
  },

  optionText: {
    fontSize: 16,
    color: colors.light.text,
  },

  optionTextSelected: {
    color: colors.light.primary,
    fontWeight: "700",
  },

  // ================= FIELD ERROR =================
  fieldError: {
    color: colors.light.emergency,
    fontSize: 13,
    marginTop: -6,
    marginBottom: 10,
  },

  // ================= BUTTON =================
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.light.card,
    fontSize: 16,
    fontWeight: "700",
  },
});
