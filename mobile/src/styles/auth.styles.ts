import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: 64,
    paddingBottom: 48,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
    gap: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: colors.light.card,
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: -24,
    padding: 24,
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  stateContainer: {
    width: "100%",
  },
  backLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  phoneLabel: {
    fontWeight: "700",
    color: colors.light.text,
  },
  codeInput: {
    flex: 1,
    fontSize: 18,
    color: colors.light.text,
    fontWeight: "700",
    letterSpacing: 2,
    padding: 0,
  },

  resendRow: {
    alignItems: "center",
    marginTop: 20,
  },
  resendLabel: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  timer: {
    fontWeight: "700",
    color: colors.light.primary,
  },
  resendAction: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.light.primary,
  },
  footer: {
    paddingHorizontal: 36,
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
