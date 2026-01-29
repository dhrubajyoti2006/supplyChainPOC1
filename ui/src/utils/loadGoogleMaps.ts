declare global {
  interface Window {
    google?: typeof google;
    __googleMapsLoader?: Promise<void>;
  }
}

export function loadGoogleMaps(apiKey: string) {
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is missing."));
  }
  if (!window.__googleMapsLoader) {
    window.__googleMapsLoader = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (event) => {
        reject(new Error("Failed to load Google Maps API"));
      };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        apiKey
      )}&libraries=places`;
      document.head.appendChild(script);
    });
  }
  return window.__googleMapsLoader;
}
