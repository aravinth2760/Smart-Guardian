import { useEffect } from "react";

import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthProvider from "@/provider/AuthProvider";
import { ContactsProvider } from "@/provider/ContactsProvider";
import SettingsProvider from "@/provider/SettingsProvider";
import { SocketProvider } from "@/provider/SocketProvider";
import { socket } from "@/services/socket";
import { store } from "@/store";

export default function RootLayout() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          <ContactsProvider>
            <SettingsProvider>
              <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </SafeAreaProvider>
            </SettingsProvider>
          </ContactsProvider>
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
}
