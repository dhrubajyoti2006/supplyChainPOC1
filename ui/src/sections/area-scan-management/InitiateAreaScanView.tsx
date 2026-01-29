import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { ContentLayout } from "../../layouts/main";
import { GooglePlaceInput } from "../../components/maps/GooglePlaceInput";
import { loadGoogleMaps } from "../../utils/loadGoogleMaps";

const DEFAULT_RADIUS = 5;
const AREA_SCAN_LOCATION_KEY = "areaScanLocation";
const DEFAULT_CENTER = { lat: 51.509865, lng: -0.118092 };

type ApiMessage = {
  code: number;
  text: string;
};

type DiscoveryScan = {
  id: string;
  status: string;
  etaMinutes: number;
  resultsCount: number;
  startedAt: string;
  location: {
    description: string;
    lat?: number;
    lng?: number;
  };
  radius: number;
  categories: string[];
};

type ApiResponse<T> = {
  data: T;
  messages: ApiMessage[];
};

type StoredLocation = {
  description: string;
  lat: number;
  lng: number;
};

const FALLBACK_MAP_LOCATION: StoredLocation = {
  description: "Map center",
  lat: DEFAULT_CENTER.lat,
  lng: DEFAULT_CENTER.lng
};

const categoryOptions = [
  "Restaurants & Dining",
  "Ingenieur",
  "Plumbing & Maintenance",
  "Retail Stores",
  "Healthcare Providers",
  "Real Estate Agencies",
  "Logistics & Transportation",
  "Professional Services",
  "Energy Consultants"
];

export function InitiateAreaScanView() {
  const navigate = useNavigate();
  const storedLocation = useMemo<StoredLocation | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(AREA_SCAN_LOCATION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.description === "string" &&
        typeof parsed.lat === "number" &&
        typeof parsed.lng === "number"
      ) {
        return parsed;
      }
    } catch {
      // ignore invalid store
    }
    return null;
  }, []);

  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [locationInput, setLocationInput] = useState(storedLocation?.description ?? "");
  const [categories, setCategories] = useState<string[]>([
    "Restaurants & Dining",
    "Retail Stores"
  ]);
  const [selectedPlace, setSelectedPlace] = useState<StoredLocation | null>(
    storedLocation ?? null
  );
  const initialCoords = storedLocation ?? FALLBACK_MAP_LOCATION;
  const [currentCoords, setCurrentCoords] = useState<StoredLocation>(initialCoords);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
  const mapInitialCenter = storedLocation ?? DEFAULT_CENTER;

  const radiusLabel = useMemo(() => `${radius} km`, [radius]);

  const handleStartDiscovery = async () => {
    if (!selectedPlace?.lat || !selectedPlace?.lng) {
      setStartError(
        "Please select a location from the autocomplete suggestions or pin a point on the map so we capture coordinates."
      );
      return;
    }

    setStartError(null);
    const requestBody = {
      location: {
        description: selectedPlace.description,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng
      },
      radius,
      categories
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/scans/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      const payload = (await response.json()) as ApiResponse<DiscoveryScan>;
      const hasError = !response.ok || payload.messages[0]?.code !== 1;
      if (hasError) {
        throw new Error(payload.messages[0]?.text || "Unable to start discovery");
      }
      navigate("/area-scan/results", { state: { scanId: payload.data.id } });
    } catch (error) {
      console.error("Failed to start discovery", error);
      setStartError("Unable to start the discovery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const persistLocation = useCallback((payload: StoredLocation) => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(AREA_SCAN_LOCATION_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, []);

  const updateLocationSelection = useCallback(
    (coords: { lat: number; lng: number }, description?: string) => {
      const payload = {
        description: description ?? `Pinned location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
        lat: coords.lat,
        lng: coords.lng
      };
      setLocationInput(payload.description);
      setSelectedPlace(payload);
      setCurrentCoords(payload);
      persistLocation(payload);
    },
    [persistLocation]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not available in your browser.");
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocationSelection(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          "Current device location"
        );
      },
      (error) => {
        setGeoError(error.message || "Unable to access your current location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [updateLocationSelection]);

  useEffect(() => {
    if (!googleMapsApiKey || !mapContainerRef.current) {
      if (!googleMapsApiKey) {
        setMapError("Missing Google Maps API key – map preview cannot load.");
      }
      return;
    }

    let cancelled = false;
    const initMap = async () => {
      try {
        await loadGoogleMaps(googleMapsApiKey);
        if (cancelled) {
          return;
        }
        if (!window.google?.maps) {
          throw new Error("Google Maps API failed to initialize.");
        }
        const initialCenter = mapInitialCenter;
        const map = new window.google.maps.Map(mapContainerRef.current!, {
          center: initialCenter,
          zoom: 13,
          streetViewControl: false,
          mapTypeControl: false
        });
        setMapInstance(map);
        setMapError(null);
      } catch (error) {
        if (!cancelled) {
          setMapError(error instanceof Error ? error.message : "Unable to render map preview.");
        }
      }
    };
    initMap();

    return () => {
      cancelled = true;
    };
  }, [googleMapsApiKey, mapInitialCenter.lat, mapInitialCenter.lng]);

  useEffect(() => {
    if (!mapInstance) {
      return;
    }
    const listener = mapInstance.addListener("click", (event) => {
      if (event.latLng) {
        updateLocationSelection(
          { lat: event.latLng.lat(), lng: event.latLng.lng() },
          "Map pin location"
        );
      }
    });
    return () => {
      listener.remove();
    };
  }, [mapInstance, updateLocationSelection]);

  useEffect(() => {
    if (!mapInstance || !currentCoords || !window.google?.maps) {
      return;
    }
    const center = new window.google.maps.LatLng(currentCoords.lat, currentCoords.lng);
    mapInstance.panTo(center);

    let marker = markerRef.current;
    if (!marker) {
      marker = new window.google.maps.Marker({
        map: mapInstance,
        position: center,
        draggable: true
      });
      marker.addListener("dragend", (event) => {
        if (event.latLng) {
          updateLocationSelection(
            { lat: event.latLng.lat(), lng: event.latLng.lng() },
            "Dragged map marker"
          );
        }
      });
      markerRef.current = marker;
    } else {
      marker.setPosition(center);
    }

    let circle = circleRef.current;
    if (!circle) {
      circle = new window.google.maps.Circle({
        strokeColor: "#1d4ed8",
        strokeOpacity: 0.65,
        strokeWeight: 2,
        fillColor: "#1d4ed8",
        fillOpacity: 0.15,
        map: mapInstance,
        center,
        radius: radius * 1000
      });
      circleRef.current = circle;
    } else {
      circle.setCenter(center);
      circle.setRadius(radius * 1000);
    }
  }, [mapInstance, currentCoords, radius, updateLocationSelection]);

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }
    persistLocation(selectedPlace);
  }, [selectedPlace, persistLocation]);

  return (
    <ContentLayout title="Initiate New Area Scan">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            Location Details
          </Typography>
          <GooglePlaceInput
            value={locationInput}
            onChange={(value) => {
              setLocationInput(value);
              setSelectedPlace(null);
            }}
            onSelect={({ description, lat, lng }) =>
              updateLocationSelection({ lat, lng }, description)
            }
            apiKey={googleMapsApiKey}
            placeholder="Enter a specific street address, city, or postal code to center your scan"
          />
          {mapError && <Alert severity="warning">{mapError}</Alert>}
          <Stack direction="row" spacing={2} alignItems="center" mt={1}>
            <Button size="small" variant="outlined" onClick={handleUseCurrentLocation}>
              Use current location
            </Button>
            <Typography variant="caption" color="text.secondary">
              Tap to share your device position and pin the scan center.
            </Typography>
          </Stack>
          {geoError && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {geoError}
            </Alert>
          )}
          <Box
            ref={mapContainerRef}
            sx={{
              height: 320,
              borderRadius: 2,
              border: "1px solid rgba(15, 23, 42, 0.12)",
              mt: 1,
              overflow: "hidden"
            }}
          />
          <FormHelperText color="text.secondary">
            Drag the marker or click anywhere on the map to pin the scan center. The circle reflects the
            selected radius.
          </FormHelperText>
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
              Define Search Radius (km)
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {radiusLabel}
            </Typography>
          </Stack>
          <Slider
            min={1}
            max={50}
            value={radius}
            onChange={(_event, value) => setRadius(value as number)}
            valueLabelDisplay="off"
            marks={[
              { value: 1, label: "1 km" },
              { value: 10, label: "10 km" },
              { value: 20, label: "20 km" },
              { value: 30, label: "30 km" },
              { value: 40, label: "40 km" },
              { value: 50, label: "50 km" }
            ]}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            Target Business Categories
          </Typography>
          <Autocomplete
            multiple
            options={categoryOptions}
            value={categories}
            onChange={(_event, newValue) => setCategories(newValue)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Hold CMD/CTRL to select multiple sectors" />
            )}
          />
          <FormHelperText color="text.secondary">
            Selecting more categories increases total processing time.
          </FormHelperText>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            onClick={handleStartDiscovery}
          >
            {isSubmitting ? "Starting..." : "Start Business Discovery"}
          </Button>
          {startError && <Alert severity="error">{startError}</Alert>}
          <Typography variant="caption" color="text.secondary">
            Estimated scan time: ~2-5 minutes depending on geographic density.
          </Typography>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
