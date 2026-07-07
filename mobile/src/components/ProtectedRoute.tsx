import { PropsWithChildren } from "react";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return children;
}
