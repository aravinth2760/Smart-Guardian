import { Tabs } from "expo-router";
import { House, MessageCircle, ShieldCheck, User } from "lucide-react-native";

import colors from "@/constants/colors";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.light.tabIconSelected,
          tabBarInactiveTintColor: colors.light.tabIconDefault,
          tabBarStyle: {
            backgroundColor: colors.light.tabBarBackground,
            borderTopColor: colors.light.tabBarBorder,
            borderTopWidth: 1,
            height: 68,
            paddingTop: 6,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <House size={size} color={color} strokeWidth={2.3} />
            ),
          }}
        />

        {/* Family Chat */}
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} strokeWidth={2.3} />
            ),
          }}
        />

        {/* Safety */}
        <Tabs.Screen
          name="safety"
          options={{
            title: "Safety",
            tabBarIcon: ({ color, size }) => (
              <ShieldCheck size={size} color={color} strokeWidth={2.3} />
            ),
          }}
        />

        {/* Profile */}
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
    </ProtectedRoute>
  );
}
