import { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ScreenContainer from "@/components/common/ScreenContainer";
import { sosSettingsService } from "@/services/sos-settings.service";
import { setSOSSettings } from "@/store/slices/sosSettingsSlice";
import { RootState } from "@/store";

export default function SettingsProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await sosSettingsService.get();
        dispatch(setSOSSettings(settings));
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [dispatch, userId]);


  if (loading) {
    return <ScreenContainer loading />;
  }

  return children;
}
