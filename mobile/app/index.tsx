import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

export default function Index() {
  const { isAuthenticated, isNewUser, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isNewUser || !user?.profileCompleted) {
    return <Redirect href="/(auth)/complete-profile" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
