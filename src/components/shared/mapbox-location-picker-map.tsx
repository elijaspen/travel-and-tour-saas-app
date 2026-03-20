"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MapboxLocationPickerMapProps = {
  longitude: number;
  latitude: number;
};

export default function MapboxLocationPickerMap({
  longitude,
  latitude,
}: MapboxLocationPickerMapProps) {
  if (!MAPBOX_TOKEN) return null;

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude,
        latitude,
        zoom: 12,
      }}
      style={{ width: "100%", height: "100%", minHeight: 200 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <Marker longitude={longitude} latitude={latitude} anchor="bottom">
        <MapPin className="w-8 h-8 text-primary" />
      </Marker>
    </Map>
  );
}
