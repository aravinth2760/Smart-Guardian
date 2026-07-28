import { StyleSheet, Text, View, Switch, ScrollView } from "react-native";

import {
  Bell,
  ShieldAlert,
  MapPin,
  Users,
  MessageCircle,
  UserCheck,
  VolumeX,
} from "lucide-react-native";

import { useState } from "react";

import colors from "@/constants/colors";
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";

const notificationSettings = [
  {
    id: "sos",
    title: "Emergency SOS Alerts",
    description: "Get instant alerts when someone sends SOS.",
    icon: ShieldAlert,
    type: "emergency",
  },
  {
    id: "location",
    title: "Location Based Notifications",
    description: "Get alerts about family member locations.",
    icon: MapPin,
  },
  {
    id: "guardian",
    title: "Guardian Activity Updates",
    description: "Know when guardians join or leave.",
    icon: UserCheck,
  },
  {
    id: "message",
    title: "Message Notifications",
    description: "Receive new chat message alerts.",
    icon: MessageCircle,
  },
  {
    id: "circle",
    title: "Safety Circle Updates",
    description: "Updates about your family circle.",
    icon: Users,
  },
];

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState({
    sos: true,
    location: true,
    guardian: true,
    message: true,
    circle: true,
    mute: false,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Notifications" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <Text style={styles.subtitle}>
          Customize which notifications you want to receive.
        </Text>

        {notificationSettings.map((item) => {
          const Icon = item.icon;

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Icon
                    size={22}
                    color={
                      item.type === "emergency"
                        ? colors.light.emergency
                        : colors.light.primary
                    }
                  />
                </View>

                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>

                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>

              <Switch
                value={settings[item.id as keyof typeof settings]}
                onValueChange={() => toggleSetting(item.id)}
                trackColor={{
                  false: "#ddd",
                  true: colors.light.primary,
                }}
                thumbColor="#fff"
              />
            </View>
          );
        })}

        <View style={styles.divider} />

        <View style={styles.card}>
          <View style={styles.left}>
            <View style={styles.iconBox}>
              <VolumeX size={22} color={colors.light.textSecondary} />
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>Do not receive any notifications</Text>

              <Text style={styles.description}>
                Turn off all alerts temporarily.
              </Text>
            </View>
          </View>

          <Switch
            value={settings.mute}
            onValueChange={() => toggleSetting("mute")}
            trackColor={{
              false: "#ddd",
              true: colors.light.primary,
            }}
            thumbColor="#fff"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginHorizontal: 18,
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: colors.light.card,

    marginHorizontal: 16,
    marginVertical: 6,

    padding: 15,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: colors.light.cardBorder,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: colors.light.primaryLight,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.light.text,
  },

  description: {
    fontSize: 12,

    color: colors.light.textSecondary,

    marginTop: 4,

    lineHeight: 17,
  },

  divider: {
    height: 1,

    backgroundColor: colors.light.cardBorder,

    marginVertical: 15,

    marginHorizontal: 16,
  },
});
