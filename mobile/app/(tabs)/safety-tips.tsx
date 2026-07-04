import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  AlertTriangle,
  Baby,
  HeartHandshake,
  MapPin,
  Shield,
  ShieldCheck,
} from "lucide-react-native";

import colors from "@/constants/colors";

const SAFETY_SECTIONS = [
  {
    title: "Personal Safety",
    icon: Shield,
    color: colors.light.primary,
    background: colors.light.primaryLight,
    tips: [
      "Stay in well-lit and crowded places.",
      "Share your live location with trusted guardians.",
      "Keep your phone charged before travelling.",
      "Avoid using headphones in isolated areas.",
    ],
  },
  {
    title: "Emergency Response",
    icon: AlertTriangle,
    color: colors.light.emergency,
    background: "#FEE2E2",
    tips: [
      "Press the SOS button immediately if you're in danger.",
      "Call emergency services when required.",
      "Move to a safe location before seeking help.",
      "Stay calm and follow emergency instructions.",
    ],
  },
  {
    title: "Child Safety",
    icon: Baby,
    color: colors.light.warning,
    background: colors.light.warningLight,
    tips: [
      "Teach children about trusted adults.",
      "Explain good touch and bad touch.",
      "Never accept gifts from strangers.",
      "Memorize parents' phone numbers.",
    ],
  },
  {
    title: "Travel Safety",
    icon: MapPin,
    color: "#3B82F6",
    background: "#EFF6FF",
    tips: [
      "Verify cab and driver details.",
      "Share your trip with guardians.",
      "Sit in the back seat whenever possible.",
      "Avoid travelling alone late at night.",
    ],
  },
  {
    title: "Health & First Aid",
    icon: HeartHandshake,
    color: colors.light.success,
    background: colors.light.successLight,
    tips: [
      "Carry a basic first-aid kit.",
      "Know emergency contact numbers.",
      "Learn basic CPR if possible.",
      "Stay hydrated during long journeys.",
    ],
  },
];

export default function SafetyTipsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.light.gradientStart, colors.light.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <ShieldCheck size={28} color="#FFFFFF" strokeWidth={2.5} />
            </View>

            <View>
              <Text style={styles.headerTitle}>Safety Tips</Text>

              <Text style={styles.headerSubtitle}>
                Stay informed. Stay protected.
              </Text>
            </View>
          </View>

          <Text style={styles.description}>
            Learn practical safety tips to protect yourself, prevent
            emergencies, and respond quickly when every second matters.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {SAFETY_SECTIONS.map((section) => {
          const Icon = section.icon;

          return (
            <View key={section.title} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor: section.background,
                    },
                  ]}
                >
                  <Icon size={22} color={section.color} />
                </View>

                <Text style={styles.cardTitle}>{section.title}</Text>
              </View>

              {section.tips.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <View
                    style={[
                      styles.tipDot,
                      {
                        backgroundColor: section.color,
                      },
                    ]}
                  />

                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerContent: {
    gap: 20,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(255,255,255,0.95)",
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 12,
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.light.textSecondary,
  },
});
