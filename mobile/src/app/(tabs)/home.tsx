import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { getAuth, signOut } from "@react-native-firebase/auth";

export default function HomeScreen() {
  const logout = async () => {
    const auth = getAuth();

    if (!auth.currentUser) return;

    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Welcome to Smart Guardian 🎉
      </Text>

      <Button title="Logout" onPress={logout} />
    </View>
  );
}
