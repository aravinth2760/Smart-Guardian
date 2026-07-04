import { Pressable, StyleSheet, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { ChevronRight, Heart, MapPin, UserPlus } from "lucide-react-native";

import colors from "@/constants/colors";

type QuickAction = {
  id: string;
  title: string;
  action: string;
  icon: any;
  iconColor: string;
  cardColor: string;
  route?: Href;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "guardian",
    title: "Add\nGuardian",
    action: "Add",
    icon: UserPlus,
    iconColor: colors.light.primary,
    cardColor: "#fff0f3",
    route: "/home",
  },
  {
    id: "tracking",
    title: "Live\nTracking",
    action: "View",
    icon: MapPin,
    iconColor: "#3b82f6",
    cardColor: "#f0f9ff",
    route: "/home",
  },
  {
    id: "tips",
    title: "Safety\nTips",
    action: "Read",
    icon: Heart,
    iconColor: colors.light.success,
    cardColor: "#f0fdf4",
    route: "/(tabs)/safety-tips",
  },
];

export default function HomeQuickActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.actionsRow}>
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;

          return (
            <Pressable
              key={item.id}
              style={[styles.actionCard, { backgroundColor: item.cardColor }]}
              onPress={() => item.route && router.push(item.route as Href)}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: item.iconColor }]}
              >
                <Icon size={22} color="#FFFFFF" />
              </View>

              <Text style={styles.actionTitle}>{item.title}</Text>

              <View style={styles.footer}>
                <Text style={[styles.actionLink, { color: item.iconColor }]}>
                  {item.action}
                </Text>

                <ChevronRight size={14} color={item.iconColor} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 28,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 16,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },

  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.light.text,
    lineHeight: 20,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionLink: {
    fontSize: 13,
    fontWeight: "600",
  },
});
