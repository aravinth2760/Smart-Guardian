import { ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";

import { logout } from "@/store/slices/authSlice";
import { useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [contact, setContact] = useState(0);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="default" />
      <HomeHeader contacts={contact} />
    </ScrollView>
  );
}
