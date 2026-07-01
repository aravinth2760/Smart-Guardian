import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/features/auth";

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const auth = getAuth();

      await signOut(auth);

      dispatch(clearUser());

      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
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
      <Text>{user?.name}</Text>
      <Text>{user?.phoneNumber}</Text>
      <Text>{user?.role}</Text>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Welcome to Smart Guardian 🎉
      </Text>

      <Button title="Logout" onPress={logout} />
    </View>
  );
}
