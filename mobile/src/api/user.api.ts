import api from "./client";
import { CheckContactsRequest, CheckContactsResponse } from "@/types/user";
import { SOSSettings } from "@/services/sos-settings.service";

export const checkContacts = async (
  data: CheckContactsRequest,
): Promise<CheckContactsResponse> => {
  const response = await api.post("/users/check-contacts", data);
  return response.data;
};

export const getSOSSettingsApi = async (): Promise<SOSSettings> => {
  const response = await api.get("/users/sos-settings");
  return response.data;
};

export const updateSOSSettingsApi = async (data: Partial<SOSSettings>): Promise<SOSSettings> => {
  const response = await api.put("/users/sos-settings", data);
  return response.data;
};

