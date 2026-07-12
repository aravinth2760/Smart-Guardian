import * as SecureStore from "expo-secure-store";

const SOS_SETTINGS_KEY = "sos_settings";

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

class SOSSettingsService {
  async save(settings: SOSSettings): Promise<void> {
    await SecureStore.setItemAsync(SOS_SETTINGS_KEY, JSON.stringify(settings));
  }

  async get(): Promise<SOSSettings> {
    const data = await SecureStore.getItemAsync(SOS_SETTINGS_KEY);

    if (!data) {
      await this.save(defaultSOSSettings);

      return defaultSOSSettings;
    }

    try {
      return JSON.parse(data);
    } catch {
      return defaultSOSSettings;
    }
  }

  async update(partialSettings: Partial<SOSSettings>): Promise<SOSSettings> {
    const currentSettings = await this.get();

    const updatedSettings = {
      ...currentSettings,
      ...partialSettings,
    };

    await this.save(updatedSettings);

    return updatedSettings;
  }

  async reset(): Promise<SOSSettings> {
    await this.save(defaultSOSSettings);

    return defaultSOSSettings;
  }

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(SOS_SETTINGS_KEY);
  }
}

export const sosSettingsService = new SOSSettingsService();
