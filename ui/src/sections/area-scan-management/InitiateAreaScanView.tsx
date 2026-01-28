import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
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

const DEFAULT_RADIUS = 5;

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

const categoryOptions = [
  "Restaurants & Dining",
  "Plumbing & Maintenance",
  "Retail Stores",
  "Healthcare Providers",
  "Real Estate Agencies",
  "Logistics & Transportation",
  "Professional Services"
];

export function InitiateAreaScanView() {
  const navigate = useNavigate();
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [locationInput, setLocationInput] = useState("");
  const [categories, setCategories] = useState<string[]>([
    "Restaurants & Dining",
    "Retail Stores"
  ]);
  const [selectedPlace, setSelectedPlace] = useState<{ description: string; lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

  const radiusLabel = useMemo(() => `${radius} km`, [radius]);

  const handleStartDiscovery = async () => {
    if (!selectedPlace?.lat || !selectedPlace?.lng) {
      setStartError("Please select a location from the autocomplete suggestions so we capture coordinates.");
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
            onSelect={(place) => setSelectedPlace(place)}
            apiKey={googleMapsApiKey}
            placeholder="Enter a specific street address, city, or postal code to center your scan"
          />
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
              <TextField
                {...params}
                placeholder="Hold CMD/CTRL to select multiple sectors"
              />
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
