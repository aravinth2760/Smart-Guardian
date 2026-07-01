import { Stack } from "expo-router";
import ReduxProvider from "@/redux/provider";

export default function RootLayout() {
  return (
    <ReduxProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ReduxProvider>
  );
}
