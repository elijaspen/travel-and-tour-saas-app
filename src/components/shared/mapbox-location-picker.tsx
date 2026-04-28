"use client";

import React, { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type LocationValue = {
  addressLine?: string;
  city?: string;
  provinceState?: string;
  countryCode?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
};

function MapLoadingPlaceholder() {
  return (
    <div className="w-full aspect-square bg-muted rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-sm text-muted-foreground">Loading map…</span>
    </div>
  );
}

const MapboxContent = dynamic(
  () => import("./mapbox-location-picker-map"),
  { ssr: false, loading: MapLoadingPlaceholder }
);

type GeocodingFeature = {
  id: string;
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string; short_code?: string }>;
};

type MapboxLocationPickerProps = {
  value?: LocationValue;
  onChange: (location: LocationValue) => void;
  className?: string;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function MapboxLocationPicker({
  value,
  onChange,
  className,
}: MapboxLocationPickerProps) {
  const [query, setQuery] = useState(
    [value?.addressLine, value?.city].filter(Boolean).join(", ") || ""
  );
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lat = value?.latitude ?? 14.5995;
  const lng = value?.longitude ?? 120.9842;
  const hasToken = !!MAPBOX_TOKEN;

  const search = useCallback(
    (q: string) => {
      if (!MAPBOX_TOKEN || !q.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&limit=5`
      )
        .then((res) => res.json())
        .then((data: { features?: GeocodingFeature[] }) => {
          setSuggestions(data.features ?? []);
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setIsSearching(false));
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  };

  const selectPlace = (feature: GeocodingFeature) => {
    const [lngVal, latVal] = feature.center;
    const address = feature.place_name;
    const context = feature.context ?? [];
    const country = context.find((c) => c.id.startsWith("country"));
    const region = context.find((c) => c.id.startsWith("region"));
    const postcode = context.find((c) => c.id.startsWith("postcode"));
    const place = context.find((c) => c.id.startsWith("place"));

    onChange({
      addressLine: address,
      city: place?.text,
      provinceState: region?.text,
      countryCode: country?.short_code?.toUpperCase(),
      postalCode: postcode?.text,
      latitude: latVal,
      longitude: lngVal,
      placeId: feature.id,
    });
    setQuery(address);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  if (!hasToken) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium">Location (Map)</Label>
        <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-2 p-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Add <code className="bg-muted px-1 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the map.
          </p>
          <Input
            placeholder="Enter address manually"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (query.trim()) {
                onChange({ ...value, addressLine: query });
              }
            }}
            className="max-w-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Address
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="address"
            placeholder="Search address…"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={cn("h-11 pl-10", isSearching && "opacity-70")}
            disabled={isSearching}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
              {suggestions.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent truncate"
                  onMouseDown={() => selectPlace(f)}
                >
                  {f.place_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full aspect-square min-h-[280px] rounded-lg overflow-hidden border border-border relative">
        <div className="absolute inset-0 w-full h-full">
          <MapboxContent longitude={lng} latitude={lat} />
        </div>
      </div>

      {(value?.latitude != null || value?.longitude != null) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Latitude</Label>
            <Input
              value={value?.latitude ?? ""}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Longitude</Label>
            <Input
              value={value?.longitude ?? ""}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      )}
    </div>
  );
}
