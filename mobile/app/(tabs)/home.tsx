import { Alert, ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";
import { useCallback, useState } from "react";

import HomeHeader from "@/components/home/HomeHeader";
import HomeSOSCard from "@/components/home/HomeSOSCard";
import HomeQuickActions from "@/components/home/HomeQuickActions";
import GuardiansList from "@/components/home/HomeGuardians";

export default function HomeScreen() {
  const [contact, setContact] = useState(0);
  const [sendingAlert, setSendingAlert] = useState(false);

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
      <HomeHeader contacts={contact} />
      <HomeSOSCard onPress={handleSOSPress} disabled={sendingAlert} />
      <HomeQuickActions />
      <GuardiansList
        contacts={contacts}
        removeContact={removeContact}
        router={router}
      />
    </ScrollView>
  );
}
