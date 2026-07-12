import { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import ScreenContainer from "@/components/common/ScreenContainer";
import { sosSettingsService } from "@/services/sos-settings.service";
import { setSOSSettings } from "@/store/slices/sosSettingsSlice";

export default function SettingsProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
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
  }, [dispatch]);

  if (loading) {
    return <ScreenContainer loading />;
  }

  return children;
}
