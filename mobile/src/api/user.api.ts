import api from "./client";
import { CheckContactsRequest, CheckContactsResponse } from "@/types/user";

export const checkContacts = async (
  data: CheckContactsRequest,
): Promise<CheckContactsResponse> => {
  const response = await api.post("/users/check-contacts", data);
  return response.data;
};
