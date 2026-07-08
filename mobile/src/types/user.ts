export interface CheckContactsRequest {
  phones: string[];
}

export type CheckContactsResponse = {
  id: string;
  name: string;
  phone: string;
}[];
