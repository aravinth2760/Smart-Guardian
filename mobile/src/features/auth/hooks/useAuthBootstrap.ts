import { useEffect } from "react";
import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";

import { checkUser, clearUser, setUser } from "@/features/auth";

export function useAuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          dispatch(clearUser());

          router.replace("/(auth)/login");
          return;
        }

        const response = await checkUser(firebaseUser.phoneNumber!);

        if (response.exists) {
          dispatch(
            setUser({
              firebaseUid: response.user.firebase_uid,
              phoneNumber: response.user.phone,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role,
            }),
          );

          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/complete-profile");
        }
      } catch (error) {
        console.log("Auth Restore Error:", error);

        dispatch(clearUser());

        router.replace("/(auth)/login");
      }
    });

    return unsubscribe;
  }, [dispatch]);
}
