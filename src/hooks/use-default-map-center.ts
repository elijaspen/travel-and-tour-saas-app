"use client";

import { useEffect, useState } from "react";

import { DEFAULT_TOUR_MAP_PIN } from "@/features/tours/tour.constants";

type MapCenter = {
  latitude: number;
  longitude: number;
  /** `true` when coordinates came from the browser geolocation API. */
  fromUserLocation: boolean;
};

/**
 * Resolves once to the user's approximate position for map UI defaults, or falls back to
 * {@link DEFAULT_TOUR_MAP_PIN} if permission is denied, unsupported, or timed out.
 */
export function useDefaultMapCenter(): MapCenter {
  const [center, setCenter] = useState<MapCenter>(() => ({
    latitude: DEFAULT_TOUR_MAP_PIN.latitude,
    longitude: DEFAULT_TOUR_MAP_PIN.longitude,
    fromUserLocation: false,
  }));

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          Math.abs(latitude) <= 90 &&
          Math.abs(longitude) <= 180
        ) {
          setCenter({ latitude, longitude, fromUserLocation: true });
        }
      },
      () => {
        /* keep static fallback */
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 10_000 },
    );
  }, []);

  return center;
}
