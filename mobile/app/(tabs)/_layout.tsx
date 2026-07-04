import { Tabs } from "expo-router";
import { House, ShieldCheck, User } from "lucide-react-native";

import colors from "@/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.light.tabIconSelected,
        tabBarInactiveTintColor: colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.light.tabBarBackground,
          borderTopColor: colors.light.tabBarBorder,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} strokeWidth={2.3} />
          ),
        }}
      />

      <Tabs.Screen
        name="safety-tips"
        options={{
          title: "Safety",
          tabBarIcon: ({ color, size }) => (
            <ShieldCheck size={size} color={color} strokeWidth={2.3} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2.3} />
          ),
        }}
      />
    </Tabs>
  );
}
