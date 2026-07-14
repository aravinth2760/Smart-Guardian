import { secureStorage } from "@/storage/secureStorage";
import { getSOSSettingsApi, updateSOSSettingsApi } from "@/api/user.api";

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
    await secureStorage.setItem(SOS_SETTINGS_KEY, JSON.stringify(settings));
  }

  async get(): Promise<SOSSettings> {
    try {
      // Sync from backend if possible
      const backendSettings = await getSOSSettingsApi();
      if (backendSettings) {
        await this.save(backendSettings);
        return backendSettings;
      }
    } catch (error) {
      console.log(
        "Failed to fetch SOS settings from API, falling back to local:",
        error,
      );
    }

    const data = await secureStorage.getItem(SOS_SETTINGS_KEY);

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

    // Update locally first
    await this.save(updatedSettings);

    // Sync to backend asynchronously
    try {
      await updateSOSSettingsApi(partialSettings);
    } catch (error) {
      console.log("Failed to sync updated SOS settings to backend:", error);
    }

    return updatedSettings;
  }

  async reset(): Promise<SOSSettings> {
    await this.save(defaultSOSSettings);

    try {
      await updateSOSSettingsApi(defaultSOSSettings);
    } catch (error) {
      console.log("Failed to sync reset SOS settings to backend:", error);
    }

    return defaultSOSSettings;
  }

  async clear(): Promise<void> {
    await secureStorage.deleteItem(SOS_SETTINGS_KEY);
  }
}

export const sosSettingsService = new SOSSettingsService();
