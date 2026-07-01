import { Stack } from "expo-router";
import ReduxProvider from "@/redux/provider";

import { store } from "../redux/store";

export default function RootLayout() {
  return (
    <ReduxProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ReduxProvider>
  );
}
