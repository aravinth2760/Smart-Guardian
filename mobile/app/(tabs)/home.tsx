import { Alert, ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

import HomeHeader from "@/components/home/HomeHeader";
import GuardiansList from "@/components/home/HomeGuardians";

export default function HomeScreen() {
  const [sendingAlert, setSendingAlert] = useState(false);
  const userName = useSelector((state: RootState) => state.auth.user?.name);

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

  const removeContact = (id: string) => {
    console.log("Remove contact:", id);
    // later: setState / API delete
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="default" />
      <HomeHeader
        userName={userName as string}
        onSOSPress={handleSOSPress}
        sendingAlert={sendingAlert}
      />
      <GuardiansList
        contacts={contacts}
        removeContact={removeContact}
        router={router}
      />
    </ScrollView>
  );
}
