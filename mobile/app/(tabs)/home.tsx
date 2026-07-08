import { Alert, ScrollView, StatusBar } from "react-native";
import { useSegments } from "expo-router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

import HomeHeader from "@/components/home/HomeHeader";
import GuardiansList from "@/components/home/HomeGuardians";
import HomeChat from "@/components/home/HomeChat";

export default function HomeScreen() {
  const [sendingAlert, setSendingAlert] = useState(false);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const segments = useSegments();
  const activeTab = segments[1];

  const handleSOSPress = useCallback(() => {
    Alert.alert("🚨 SOS Button", "Emergency button clicked!");
  }, []);

  const contacts = [
    {
      id: "1",
      name: "John Doe",
      phone: "+91 9876543210",
      relationship: "Parent",
    },
    {
      id: "2",
      name: "John Doe",
      phone: "+91 9876543210",
      relationship: "Parent",
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar
        barStyle={activeTab === "home" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <HomeHeader
        userName={userName as string}
        onSOSPress={handleSOSPress}
        sendingAlert={sendingAlert}
      />
      <HomeChat />
      <GuardiansList contacts={contacts} />
    </ScrollView>
  );
}
