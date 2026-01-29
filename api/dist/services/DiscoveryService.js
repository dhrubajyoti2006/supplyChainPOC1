"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const ApiResponse_1 = require("../models/ApiResponse");
const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchNearby";
const GOOGLE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const GOOGLE_FIELD_MASK = [
    "places.name",
    "places.displayName",
    "places.id",
    "places.formattedAddress",
    "places.types",
    "places.primaryType",
    "places.primaryTypeDisplayName",
    "places.location",
    "places.businessStatus",
    "places.websiteUri"
].join(",");
const MAX_RESULT_COUNT = 18;
const CATEGORY_TYPE_MAP = {
    "Restaurants & Dining": ["restaurant", "cafe", "bar"],
    "Plumbing & Maintenance": ["plumber", "hardware_store", "home_repair"],
    "Retail Stores": ["department_store", "shopping_mall", "store"],
    "Healthcare Providers": ["hospital", "doctor", "pharmacy"],
    "Real Estate Agencies": ["real_estate_agency"],
    "Logistics & Transportation": ["transit_station", "taxi_stand", "bus_station"],
    "Professional Services": ["consultant"],
    "Energy Consultants": [""]
};
const scanStore = new Map();
const defaultResults = [
    {
        id: "res-001",
        name: "Capital Grill & Bar",
        address: "120 Congress Ave, Austin, TX",
        primaryType: "restaurant",
        types: ["restaurant", "bar"],
        businessStatus: "OPERATIONAL",
        website: "https://capitalgrill.com",
        lat: 30.273,
        lng: -97.7426
    },
    {
        id: "res-002",
        name: "Austin Vintage Boutique",
        address: "405 W 6th St, Austin, TX",
        primaryType: "store",
        types: ["shopping_mall", "store"],
        businessStatus: "OPERATIONAL",
        website: "",
        lat: 30.265,
        lng: -97.7429
    },
    {
        id: "res-003",
        name: "Southside Coffee Hub",
        address: "1201 S Congress Ave, Austin, TX",
        primaryType: "cafe",
        types: ["cafe"],
        businessStatus: "OPERATIONAL",
        website: "",
        lat: 30.2467,
        lng: -97.7464
    }
];
class DiscoveryService {
    static async start(request) {
        const results = await this.fetchGooglePlaces(request);
        const scanId = `scan-${Date.now()}`;
        const scan = {
            id: scanId,
            status: "processing",
            etaMinutes: 3,
            resultsCount: results.length,
            startedAt: new Date().toISOString(),
            location: request.location,
            radius: request.radius,
            categories: request.categories
        };
        scanStore.set(scanId, { scan, results });
        const response = new ApiResponse_1.ApiResponse(scan);
        response.addSuccess();
        return response;
    }
    static async getResults(scanId) {
        const stored = scanStore.get(scanId);
        if (stored) {
            const response = new ApiResponse_1.ApiResponse(stored.results);
            response.addSuccess();
            return response;
        }
        const response = new ApiResponse_1.ApiResponse(defaultResults);
        response.addSuccess();
        return response;
    }
    static async getPlaceDetails(placeId) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            throw new Error("Missing server-side Google Maps API key (GOOGLE_MAPS_API_KEY).");
        }
        if (!placeId) {
            throw new Error("placeId is required.");
        }
        const params = new URLSearchParams({
            place_id: placeId,
            fields: "place_id,name,formatted_address,international_phone_number,formatted_phone_number,opening_hours,website,rating,user_ratings_total,types,business_status,geometry",
            key: apiKey
        });
        const response = await fetch(`${GOOGLE_DETAILS_URL}?${params.toString()}`);
        const data = await response.json();
        const status = data.status;
        if (response.status !== 200 || status !== "OK") {
            const errorMessage = data.error_message || status || "Failed to fetch place details.";
            throw new Error(`Google Place Details error: ${errorMessage}`);
        }
        const result = data.result ?? {};
        const location = result.geometry?.location;
        const details = {
            placeId: result.place_id,
            name: result.name,
            website: result.website,
            phoneNumber: result.formatted_phone_number,
            internationalPhoneNumber: result.international_phone_number,
            address: result.formatted_address,
            rating: typeof result.rating === "number" ? result.rating : undefined,
            userRatingsTotal: typeof result.user_ratings_total === "number" ? result.user_ratings_total : undefined,
            openingHours: result.opening_hours?.weekday_text,
            types: Array.isArray(result.types) ? result.types : undefined,
            businessStatus: result.business_status,
            lat: typeof location?.lat === "number" ? location.lat : undefined,
            lng: typeof location?.lng === "number" ? location.lng : undefined
        };
        return details;
    }
    static resolveTypes(categories) {
        const resolved = new Set();
        categories.forEach((category) => {
            (CATEGORY_TYPE_MAP[category] ?? []).forEach((type) => resolved.add(type));
        });
        if (!resolved.size) {
            resolved.add("establishment");
        }
        return Array.from(resolved);
    }
    static async fetchGooglePlaces(request) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            throw new Error("Missing server-side Google Maps API key (GOOGLE_MAPS_API_KEY).");
        }
        const location = request.location;
        if (typeof location.lat !== "number" || typeof location.lng !== "number") {
            throw new Error("Location must include valid latitude and longitude coordinates.");
        }
        const payload = {
            includedTypes: this.resolveTypes(request.categories),
            maxResultCount: MAX_RESULT_COUNT,
            locationRestriction: {
                circle: {
                    center: {
                        latitude: location.lat,
                        longitude: location.lng
                    },
                    radius: Math.max(500, Math.floor(request.radius * 1000))
                }
            },
            rankPreference: "DISTANCE"
        };
        const response = await fetch(GOOGLE_PLACES_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": GOOGLE_FIELD_MASK
            },
            body: JSON.stringify(payload)
        });
        const data = (await response.json());
        if (!response.ok || data.error) {
            const message = data.error?.message ?? response.statusText ?? "Unknown Places error";
            throw new Error(`Google Places error: ${message}`);
        }
        const places = data.places ?? [];
        return places
            .map((place, index) => this.normalizePlace(place, index))
            .filter((result) => !!result.name);
    }
    static normalizePlace(place, index) {
        const formattedAddress = this.extractAddress(place);
        const displayName = place.displayName?.text?.trim();
        const fallbackName = place.name?.split("/").pop();
        const name = displayName ?? fallbackName ?? formattedAddress ?? `Place ${index + 1}`;
        const address = formattedAddress;
        const primaryType = place.primaryType?.type ?? place.primaryTypeDisplayName?.text;
        const types = (place.types ?? [])
            .map((item) => item.displayName ?? item.type)
            .filter(Boolean);
        const lat = place.geometry?.location?.latitude;
        const lng = place.geometry?.location?.longitude;
        return {
            id: place.name ?? `${Date.now()}-${index}`,
            name,
            address,
            primaryType,
            types,
            businessStatus: place.businessStatus,
            website: place.websiteUri,
            lat,
            lng,
            placeId: place.placeId ?? place.id ?? place.name
        };
    }
    static extractAddress(place) {
        const formatted = typeof place.formattedAddress === "string"
            ? place.formattedAddress
            : place.formattedAddress?.text;
        const alternative = place.address?.formattedAddress;
        return (formatted ?? alternative ?? "").trim();
    }
}
exports.DiscoveryService = DiscoveryService;
