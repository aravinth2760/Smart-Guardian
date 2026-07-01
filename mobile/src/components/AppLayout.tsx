import { Stack } from "expo-router";
import { useAuthBootstrap } from "@/features/auth";

export default function AppLayout() {
  useAuthBootstrap();

  return <Stack screenOptions={{ headerShown: false }} />;
}
