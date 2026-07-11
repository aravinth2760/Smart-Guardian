import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "@/store/index";
import AuthProvider from "@/provider/AuthProvider";
import { ContactsProvider } from "@/provider/ContactsProvider";
import { SocketProvider } from "@/provider/SocketProvider";
import { useEffect } from "react";
import { socket } from "@/services/socket";

export default function RootLayout() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          <ContactsProvider>
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
          </ContactsProvider>
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
}
