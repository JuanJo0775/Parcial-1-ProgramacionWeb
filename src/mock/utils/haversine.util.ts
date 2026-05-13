import type { Coords } from '../../shared/types';

const TO_RADIANS = (degrees: number) => degrees * (Math.PI / 180);

export const haversineDistance = (from: Coords, to: Coords): number => {
  const R = 6371;
  const dLat = TO_RADIANS(to.lat - from.lat);
  const dLng = TO_RADIANS(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(TO_RADIANS(from.lat)) *
      Math.cos(TO_RADIANS(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};