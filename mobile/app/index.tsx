// Third-party
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

// Constants
import { ROUTES } from "@/constants/routes";

// Types
import type { RootState } from "@/store";

export default function Index() {
  const { isAuthenticated, isNewUser, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.AUTH.LOGIN} />;
  }

  if (isNewUser || !user?.profileCompleted) {
    return <Redirect href={ROUTES.AUTH.COMPLETE_PROFILE} />;
  }

  return <Redirect href={ROUTES.TABS.HOME} />;
}
