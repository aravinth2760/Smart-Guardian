import { useEffect, useState, useCallback } from "react";
import { AppState, Alert, Linking } from "react-native";
import * as Location from "expo-location";

export default function useLocationCheck() {
  const [locationEnabled, setLocationEnabled] = useState(false);

  const checkLocation = useCallback(async () => {
    const servicesEnabled = await Location.hasServicesEnabledAsync();

    // GPS OFF
    if (!servicesEnabled) {
      try {
        // Android only popup
        await Location.enableNetworkProviderAsync();

        const recheck = await Location.hasServicesEnabledAsync();
        setLocationEnabled(recheck);
      } catch (e) {
        // iOS or user cancelled
        Alert.alert("Location Off", "Please enable location services", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]);

        setLocationEnabled(false);
      }

      return;
    }

    // Permission check
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const req = await Location.requestForegroundPermissionsAsync();

      if (req.status !== "granted") {
        setLocationEnabled(false);
        return;
      }
    }

    setLocationEnabled(true);
  }, []);

  useEffect(() => {
    checkLocation();

    // App foreground வந்ததும் refresh
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkLocation();
      }
    });

    return () => sub.remove();
  }, [checkLocation]);

  return { locationEnabled, checkLocation };
}
