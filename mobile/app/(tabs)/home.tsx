import { Alert, ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";

import { logout } from "@/store/slices/authSlice";
import { useCallback, useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import HomeSOSCard from "@/components/home/HomeSOSCard";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [contact, setContact] = useState(0);
  const [sendingAlert, setSendingAlert] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  const handleSOSPress = useCallback(() => {
    Alert.alert("🚨 SOS Button", "Emergency button clicked!");
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="default" />
      <HomeHeader contacts={contact} />
      <HomeSOSCard onPress={handleSOSPress} disabled={sendingAlert} />
    </ScrollView>
  );
}
