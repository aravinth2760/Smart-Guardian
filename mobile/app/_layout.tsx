import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "@/store/index";
import AuthProvider from "@/provider/AuthProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </AuthProvider>
    </Provider>
  );
}
