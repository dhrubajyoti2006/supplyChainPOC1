export type DiscoveryLocation = {
  description: string;
  lat?: number;
  lng?: number;
};

export type DiscoveryResult = {
  id: string;
  name: string;
  address: string;
  primaryType?: string;
  types: string[];
  businessStatus?: string;
  website?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

export type DiscoveryScan = DiscoveryLocation & {
  id: string;
  radius: number;
  categories: string[];
  status: "scheduled" | "processing" | "completed";
  etaMinutes: number;
  resultsCount: number;
  startedAt: string;
};

export type DiscoveryPlaceDetails = {
  name?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  openingHours?: string[];
};
