/**
 * Shared SOS settings type and default values.
 * Kept in a standalone file to avoid circular dependencies between
 * api/user.api.ts, store/sosSettingsSlice.ts, and services/sos-settings.service.ts.
 */
export interface SOSSettings {
  message: string;
  countdown: number;
  liveLocation: boolean;
  liveLocationDuration: number;
  autoCall: boolean;
  smsBackup: boolean;
  alertSound: boolean;
  silentSOS: boolean;
  flashlightBlink: boolean;
  vibration: boolean;
}

export const defaultSOSSettings: SOSSettings = {
  message:
    "🚨 I need help! This is an emergency. My live location is being shared. Please contact me immediately.",
  countdown: 5,
  liveLocation: true,
  liveLocationDuration: 30,
  autoCall: true,
  smsBackup: true,
  alertSound: false,
  silentSOS: false,
  flashlightBlink: false,
  vibration: true,
};
