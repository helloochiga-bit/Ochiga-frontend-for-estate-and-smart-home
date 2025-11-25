// ochiga-frontend/src/lib/GoogleMapLoader.ts

let googleMapsLoading: Promise<void> | null = null;

// ✅ Declare window.google properly with @types/google.maps
declare global {
  interface Window {
    google?: typeof google;
  }
}

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (googleMapsLoading) return googleMapsLoading;

  googleMapsLoading = new Promise((resolve, reject) => {
    // If script already exists, just wait
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Extra safety check: google.maps must exist
      const checker = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checker);
          resolve();
        }
      }, 50);
    };

    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleMapsLoading;
}
