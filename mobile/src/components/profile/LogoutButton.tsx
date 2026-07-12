import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { LogOut } from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";

import colors from "@/constants/colors";

import { logout } from "@/store/slices/authSlice";

import { socket } from "@/services/socket";
import { tokenService } from "@/services/token.service";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          socket.disconnect();
          await tokenService.removeTokens();
          dispatch(logout());
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <Pressable onPress={handleLogout} style={styles.left}>
      <LogOut size={20} color={colors.light.emergencyLight} />

      <Text style={styles.logoutText}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
