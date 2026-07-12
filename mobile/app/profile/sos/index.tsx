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
  PhoneCall,
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

  const handleAlertSoundToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        alertSound: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("Alert sound update failed", error);
    }
  };

  const handleSilentSOSToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        silentSOS: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("Silent SOS update failed", error);
    }
  };

  const handleFlashlightBlinkToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        flashlightBlink: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("Flashlight blink update failed", error);
    }
  };

  const handleVibrationToggle = async (value: boolean) => {
    try {
      const updatedSettings = await sosSettingsService.update({
        vibration: value,
      });

      dispatch(setSOSSettings(updatedSettings));
    } catch (error) {
      console.log("Vibration update failed", error);
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
              toggleValue: sosSettings.alertSound,
              onToggleChange: handleAlertSoundToggle,
            },
            {
              icon: EyeOff,
              title: "Silent SOS",
              showToggle: true,
              toggleValue: sosSettings.silentSOS,
              onToggleChange: handleSilentSOSToggle,
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
              toggleValue: sosSettings.flashlightBlink,
              onToggleChange: handleFlashlightBlinkToggle,
            },
            {
              icon: Smartphone,
              title: "Vibration",
              showToggle: true,
              toggleValue: sosSettings.vibration,
              onToggleChange: handleVibrationToggle,
            },
            {
              icon: TestTube2,
              title: "Test SOS",
              onPress: () => router.push("/profile/sos/test"),
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
