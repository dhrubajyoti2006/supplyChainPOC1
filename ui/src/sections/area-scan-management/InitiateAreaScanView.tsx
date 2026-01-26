import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { ContentLayout } from "../../layouts/main";

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
  const [radius, setRadius] = useState(25);
  const [locations, setLocations] = useState("");
  const [categories, setCategories] = useState<string[]>([
    "Restaurants & Dining",
    "Retail Stores"
  ]);

  const radiusLabel = useMemo(() => `${radius} km`, [radius]);

  return (
    <ContentLayout title="Initiate New Area Scan">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            Location Details
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter a specific street address, city, or postal code to center your scan"
            value={locations}
            onChange={(event) => setLocations(event.target.value)}
            InputProps={{
              startAdornment: (
                <Box
                  component="span"
                  sx={{ color: "text.secondary", mr: 1 }}
                >
                  📍
                </Box>
              )
            }}
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
            onChange={(event, value) => setRadius(value as number)}
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
            onChange={(event, newValue) => setCategories(newValue)}
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
          <Button variant="contained" color="primary" size="large">
            Start Business Discovery
          </Button>
          <Typography variant="caption" color="text.secondary">
            Estimated scan time: ~2-5 minutes depending on geographic density.
          </Typography>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
