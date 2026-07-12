import { router } from "expo-router";
import {
  Bell,
  Camera,
  Clock3,
  EyeOff,
  Flashlight,
  History,
  MapPin,
  Mic,
  Phone,
  PhoneCall,
  Shield,
  Siren,
  Smartphone,
  TestTube2,
  Timer,
  Video,
} from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import SettingsSection from "@/components/common/SettingsSection";
import { sosSettingsService } from "@/services/sos-settings.service";
import { RootState } from "@/store";
import { setSOSSettings } from "@/store/slices/sosSettingsSlice";
import { useState } from "react";

export default function SOSSettingsScreen() {
  const dispatch = useDispatch();

  const sosSettings = useSelector((state: RootState) => state.sosSettings);

  const [alertSound, setAlertSound] = useState(false);
  const [flashlightBlink, setFlashlightBlink] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [silentSOS, setSilentSOS] = useState(false);

  const handleLiveLocationToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        liveLocation: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("Live location update failed", error);
    }
  };

  const handleAutoCallToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        autoCall: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("Auto call update failed", error);
    }
  };

  const handleSmsBackupToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        smsBackup: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("SMS backup update failed", error);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="SOS Settings" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsSection
          title="EMERGENCY"
          items={[
            {
              icon: Bell,
              title: "SOS Message",
              onPress: () => router.push("/profile/sos/message"),
            },
            {
              icon: Clock3,
              title: "Countdown",
              value: "5 sec",
              onPress: () => router.push("/profile/sos/countdown"),
            },
            {
              icon: Timer,
              title: "Location Sharing Duration",
              value: "30 mins",
              onPress: () => router.push("/profile/sos/live-location-duration"),
            },
          ]}
        />

        <SettingsSection
          title="SAFETY"
          items={[
            {
              icon: MapPin,
              title: "Live Location",
              showToggle: true,
              toggleValue: sosSettings.liveLocation,
              onToggleChange: handleLiveLocationToggle,
            },
            {
              icon: PhoneCall,
              title: "Auto Call",
              showToggle: true,
              toggleValue: sosSettings.autoCall,
              onToggleChange: handleAutoCallToggle,
            },
            {
              icon: Smartphone,
              title: "SMS Backup",
              showToggle: true,
              toggleValue: sosSettings.smsBackup,
              onToggleChange: handleSmsBackupToggle,
            },
            {
              icon: Siren,
              title: "Alert Sound",
              showToggle: true,
              toggleValue: alertSound,
              onToggleChange: setAlertSound,
            },
            {
              icon: EyeOff,
              title: "Silent SOS",
              showToggle: true,
              toggleValue: silentSOS,
              onToggleChange: setSilentSOS,
            },
          ]}
        />

        <SettingsSection
          title="ADVANCED"
          items={[
            {
              icon: Flashlight,
              title: "Flashlight Blink",
              showToggle: true,
              toggleValue: flashlightBlink,
              onToggleChange: setFlashlightBlink,
            },
            {
              icon: Smartphone,
              title: "Vibration",
              showToggle: true,
              toggleValue: vibration,
              onToggleChange: setVibration,
            },
            {
              icon: TestTube2,
              title: "Test SOS",
              onPress: () => {},
            },
            {
              icon: History,
              title: "SOS History",
              onPress: () => {},
            },
          ]}
        />

        <SettingsSection
          title="COMING SOON"
          items={[
            {
              icon: Mic,
              title: "Auto Audio Recording",
              onPress: () => {},
            },
            {
              icon: Video,
              title: "Auto Video Recording",
              onPress: () => {},
            },
            {
              icon: Camera,
              title: "Front Camera Snapshot",
              onPress: () => {},
            },
            {
              icon: PhoneCall,
              title: "Emergency Number",
              value: "112",
              onPress: () => {},
            },
          ]}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
