export type GeolocationResult =
  | { granted: true; coords: GeolocationCoords }
  | { granted: false; reason: 'denied' | 'unavailable' | 'timeout' };

export interface GeolocationCoords {
  lat: number;
  lng: number;
}

export const requestGeolocation = (): Promise<GeolocationResult> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ granted: false, reason: 'unavailable' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          granted: true,
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }),
      (err) => {
        const reason =
          err.code === err.PERMISSION_DENIED
            ? 'denied'
            : err.code === err.TIMEOUT
              ? 'timeout'
              : 'unavailable';
        resolve({ granted: false, reason });
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  });