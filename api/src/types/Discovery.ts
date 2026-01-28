export type DiscoveryLocation = {
  description: string;
  lat?: number;
  lng?: number;
};

export type DiscoveryRequest = {
  location: DiscoveryLocation;
  radius: number;
  categories: string[];
};

export type DiscoveryStatus = "scheduled" | "processing" | "completed";

export type DiscoveryScan = DiscoveryRequest & {
  id: string;
  status: DiscoveryStatus;
  etaMinutes: number;
  resultsCount: number;
  startedAt: string;
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

export type DiscoveryPlaceDetails = {
  placeId?: string;
  name?: string;
  website?: string;
  phoneNumber?: string;
  internationalPhoneNumber?: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: string[];
  types?: string[];
  businessStatus?: string;
  lat?: number;
  lng?: number;
};
