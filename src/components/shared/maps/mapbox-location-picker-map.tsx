"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useRef } from "react";
import Map, { AttributionControl, Marker, type MapRef } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";

import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/** Sharp teardrop needle (solid); tip at bottom of viewBox for `anchor="bottom"`. */
function NeedleLocationPin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 44"
      className={cn(
        "pointer-events-none h-10 w-[22px] text-[color:var(--map-location-pin)]",
        "drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)]",
        className,
      )}
      aria-hidden
    >
      <path
        fill="currentColor"
        stroke="white"
        strokeWidth={1.15}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M12 42.6 5.7 15.4Q12 2.2 18.3 15.4L12 42.6z"
      />
    </svg>
  );
}

type MapboxLocationPickerMapProps = {
  longitude: number;
  latitude: number;
  /** When set, the map recenters when coordinates change and clicks invoke this handler (pin drop). */
  onMapClick?: (coords: { lng: number; lat: number }) => void;
};

export default function MapboxLocationPickerMap({
  longitude,
  latitude,
  onMapClick,
}: MapboxLocationPickerMapProps) {
  const mapRef = useRef<MapRef>(null);

  const flyTo = useCallback((lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 14, duration: 600 });
  }, []);

  useEffect(() => {
    flyTo(longitude, latitude);
  }, [latitude, longitude, flyTo]);

  const handleClick = (e: MapMouseEvent) => {
    if (!onMapClick || e.lngLat == null) return;
    e.originalEvent?.stopPropagation?.();
    onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
  };

  if (!MAPBOX_TOKEN) return null;

  return (
    <div className="workwanders-mapbox-embed relative h-full min-h-[inherit] w-full [&_.mapboxgl-map]:font-sans">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        initialViewState={{
          longitude,
          latitude,
          zoom: 12,
        }}
        onClick={handleClick}
        style={{ width: "100%", height: "100%", minHeight: 200 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        cursor={onMapClick ? "crosshair" : "grab"}
      >
        <AttributionControl compact position="bottom-right" />
      <Marker
        key={`${latitude.toFixed(6)},${longitude.toFixed(6)}`}
        longitude={longitude}
        latitude={latitude}
        anchor="bottom"
      >
        <NeedleLocationPin />
      </Marker>
      </Map>
    </div>
  );
}
