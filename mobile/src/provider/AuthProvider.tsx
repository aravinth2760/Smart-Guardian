import { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { login } from "@/store/slices/authSlice";
import { tokenService } from "@/services/token.service";

export default function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = await tokenService.getAccessToken();
        const refreshToken = await tokenService.getRefreshToken();
        const user = await tokenService.getUser();

        if (accessToken && refreshToken && user) {
          dispatch(
            login({
              user,
              accessToken,
              refreshToken,
              isNewUser: false,
            }),
          );
        }
      } catch (err) {
        console.error("Restore Session Error:", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (loading) {
    return null;
    // Future:
    // return <SplashScreen />;
  }

  return children;
}
