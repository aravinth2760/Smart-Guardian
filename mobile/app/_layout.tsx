import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "@/store/index";
import AuthProvider from "@/provider/AuthProvider";
import { ContactsProvider } from "@/provider/ContactsProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ContactsProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </ContactsProvider>
      </AuthProvider>
    </Provider>
  );
}
