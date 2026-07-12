import { useState } from "react";
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
import { ScrollView } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import SettingsSection from "@/components/common/SettingsSection";

export default function SOSSettingsScreen() {
  const [liveLocation, setLiveLocation] = useState(false);
  const [autoCall, setAutoCall] = useState(false);
  const [smsBackup, setSmsBackup] = useState(false);
  const [alertSound, setAlertSound] = useState(false);
  const [flashlightBlink, setFlashlightBlink] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [silentSOS, setSilentSOS] = useState(false);

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
              onPress: () => {},
            },
            {
              icon: Clock3,
              title: "Countdown",
              value: "5 sec",
              onPress: () => {},
            },
            {
              icon: Timer,
              title: "Location Sharing Duration",
              value: "30 mins",
              onPress: () => {},
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
              toggleValue: liveLocation,
              onToggleChange: setLiveLocation,
            },
            {
              icon: Phone,
              title: "Auto Call Guardian",
              showToggle: true,
              toggleValue: autoCall,
              onToggleChange: setAutoCall,
            },
            {
              icon: Shield,
              title: "Send SMS Backup",
              showToggle: true,
              toggleValue: smsBackup,
              onToggleChange: setSmsBackup,
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
