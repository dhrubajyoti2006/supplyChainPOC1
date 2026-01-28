/// <reference types="google.maps" />

import * as React from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

declare global {
  interface Window {
    google?: typeof google;
    __googlePlacesLoader?: Promise<void>;
  }
}

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (picked: { description: string; lat: number; lng: number }) => void;
  apiKey?: string;
  required?: boolean;
};

async function loadGooglePlaces(apiKey: string) {
  if (window.google && window.google.maps && window.google.maps.places) return;
  if (!window.__googlePlacesLoader) {
    window.__googlePlacesLoader = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }
  await window.__googlePlacesLoader;
}

export function GooglePlaceInput({
  label = "Location",
  placeholder,
  value,
  onChange,
  onSelect,
  apiKey,
  required
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const acRef = React.useRef<google.maps.places.Autocomplete>();
  const callbacksRef = React.useRef({ onChange, onSelect });

  React.useEffect(() => {
    callbacksRef.current = { onChange, onSelect };
  }, [onChange, onSelect]);

  React.useEffect(() => {
    const key = apiKey || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      return () => {
        /* no-op */
      };
    }

    let cancelled = false;
    let listener: google.maps.MapsEventListener | null = null;

    loadGooglePlaces(key)
      .then(() => {
        if (cancelled || !inputRef.current) return;
        const { google } = window;
        if (!google?.maps?.places) return;
        const ac = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "geometry", "name"]
        });

        listener = ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          const desc = place.formatted_address || place.name || "";
          const loc = place.geometry?.location;
          const lat = typeof loc?.lat === "function" ? Number(loc.lat()) : undefined;
          const lng = typeof loc?.lng === "function" ? Number(loc.lng()) : undefined;
          const { onChange: handleChange, onSelect: handleSelect } = callbacksRef.current;
          if (desc) handleChange(desc);
          if (typeof lat === "number" && typeof lng === "number") {
            handleSelect({ description: desc, lat, lng });
          }
        });

        acRef.current = ac;
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      cancelled = true;
      listener?.remove();
      acRef.current = undefined;
    };
  }, [apiKey]);

  return (
    <TextField
      inputRef={inputRef}
      label={label}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnOutlinedIcon fontSize="small" />
          </InputAdornment>
        )
      }}
    />
  );
}
