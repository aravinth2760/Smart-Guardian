import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";

import colors from "@/constants/colors";
import { logout } from "@/store/slices/authSlice";
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
          await tokenService.removeTokens();
          dispatch(logout());
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleLogout}
      android_ripple={{ color: "#FEE2E2" }}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <LogOut size={22} color={colors.light.emergency} strokeWidth={2.3} />

      <Text style={styles.title}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  pressed: {
    opacity: 0.8,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.emergency,
  },
});
