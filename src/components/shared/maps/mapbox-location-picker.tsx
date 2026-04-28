"use client";

import { useState, useCallback, useRef, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search } from "lucide-react";

import { useDefaultMapCenter } from "@/hooks/use-default-map-center";
import type { TourLocationValue } from "@/modules/tours/tour.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MapboxGeocodingQueryParam,
  mapboxPlacesForwardUrl,
  mapboxPlacesReverseUrl,
} from "@/lib/geo/mapbox-geocoding";

function MapLoadingPlaceholder() {
  return (
    <div className="w-full aspect-square bg-muted rounded-lg animate-pulse flex items-center justify-center min-h-[240px]">
      <span className="text-sm text-muted-foreground">Loading map…</span>
    </div>
  );
}

const MapboxContent = dynamic(() => import("./mapbox-location-picker-map"), {
  ssr: false,
  loading: MapLoadingPlaceholder,
});

type GeocodingFeature = {
  id: string;
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string; short_code?: string }>;
};

function geocodingFeatureToLocation(feature: GeocodingFeature): TourLocationValue {
  const [lngVal, latVal] = feature.center;
  const address = feature.place_name;
  const context = feature.context ?? [];
  const country = context.find((c) => c.id.startsWith("country"));
  const region = context.find((c) => c.id.startsWith("region"));
  const postcode = context.find((c) => c.id.startsWith("postcode"));
  const place = context.find((c) => c.id.startsWith("place"));

  return {
    address_line: address,
    city: place?.text,
    province_state: region?.text,
    country_code: country?.short_code?.toUpperCase(),
    postal_code: postcode?.text,
    latitude: latVal,
    longitude: lngVal,
    place_id: feature.id,
  };
}

async function reverseGeocode(
  lng: number,
  lat: number,
  token: string,
): Promise<TourLocationValue> {
  const usp = new URLSearchParams({
    [MapboxGeocodingQueryParam.ACCESS_TOKEN]: token,
    [MapboxGeocodingQueryParam.LIMIT]: "1",
  });
  const res = await fetch(mapboxPlacesReverseUrl(lng, lat, usp));
  const data: { features?: GeocodingFeature[] } = await res.json();
  const feature = data.features?.[0];
  if (!feature) {
    return { latitude: lat, longitude: lng, place_id: undefined, address_line: undefined };
  }
  return geocodingFeatureToLocation(feature);
}

type MapboxLocationPickerProps = {
  value?: TourLocationValue;
  onChange: (location: TourLocationValue) => void;
  className?: string;
  /** Inline map vs. summary + dialog with search and pin. */
  mapLayout?: "inline" | "modal";
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function MapboxLocationPicker({
  value,
  onChange,
  className,
  mapLayout = "inline",
}: MapboxLocationPickerProps) {
  const [query, setQuery] = useState(
    () => [value?.address_line, value?.city].filter(Boolean).join(", ") || "",
  );
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mapOpen, setMapOpen] = useState(false);
  const [mapDialogKey, setMapDialogKey] = useState(0);
  const [draft, setDraft] = useState<TourLocationValue>({});
  const [mapQuery, setMapQuery] = useState("");
  const [mapSuggestions, setMapSuggestions] = useState<GeocodingFeature[]>([]);
  const [showMapSuggestions, setShowMapSuggestions] = useState(false);
  const [isMapSearching, setIsMapSearching] = useState(false);
  const mapDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPinning, setIsPinning] = useState(false);

  const defaultCenter = useDefaultMapCenter();

  const hasToken = !!MAPBOX_TOKEN;

  const openMapDialog = () => {
    const next = { ...value };
    setDraft(next);
    setMapQuery([value?.address_line, value?.city].filter(Boolean).join(", ") || "");
    setMapSuggestions([]);
    setShowMapSuggestions(false);
    setMapDialogKey((k) => k + 1);
    setMapOpen(true);
  };

  const search = useCallback((q: string) => {
    if (!MAPBOX_TOKEN || !q.trim()) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    const usp = new URLSearchParams({
      [MapboxGeocodingQueryParam.ACCESS_TOKEN]: MAPBOX_TOKEN,
      [MapboxGeocodingQueryParam.LIMIT]: "5",
    });
    fetch(mapboxPlacesForwardUrl(q, usp))
      .then((res) => res.json())
      .then((data: { features?: GeocodingFeature[] }) => {
        setSuggestions(data.features ?? []);
        setShowSuggestions(true);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setIsSearching(false));
  }, []);

  const searchInMap = useCallback((q: string) => {
    if (!MAPBOX_TOKEN || !q.trim()) {
      setMapSuggestions([]);
      return;
    }
    setIsMapSearching(true);
    const usp = new URLSearchParams({
      [MapboxGeocodingQueryParam.ACCESS_TOKEN]: MAPBOX_TOKEN,
      [MapboxGeocodingQueryParam.LIMIT]: "5",
    });
    fetch(mapboxPlacesForwardUrl(q, usp))
      .then((res) => res.json())
      .then((data: { features?: GeocodingFeature[] }) => {
        setMapSuggestions(data.features ?? []);
        setShowMapSuggestions(true);
      })
      .catch(() => setMapSuggestions([]))
      .finally(() => setIsMapSearching(false));
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  };

  const handleMapSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setMapQuery(v);
    if (mapDebounceRef.current) clearTimeout(mapDebounceRef.current);
    mapDebounceRef.current = setTimeout(() => searchInMap(v), 300);
  };

  const selectPlace = useCallback(
    (feature: GeocodingFeature) => {
      const loc = geocodingFeatureToLocation(feature);
      onChange(loc);
      setQuery(feature.place_name);
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [onChange],
  );

  const selectPlaceInModal = (feature: GeocodingFeature) => {
    const loc = geocodingFeatureToLocation(feature);
    setDraft(loc);
    setMapQuery(feature.place_name);
    setMapSuggestions([]);
    setShowMapSuggestions(false);
  };

  const canApplyMap =
    draft.latitude != null &&
    draft.longitude != null &&
    !Number.isNaN(Number(draft.latitude)) &&
    !Number.isNaN(Number(draft.longitude));

  const handleApplyMap = () => {
    if (!canApplyMap) return;
    onChange(draft);
    setQuery([draft.address_line, draft.city].filter(Boolean).join(", ") || mapQuery);
    setMapOpen(false);
  };

  const handleMapClickPin = async ({ lng, lat }: { lng: number; lat: number }) => {
    if (!MAPBOX_TOKEN) return;
    // Move the pin immediately; reverse geocode only enriches address fields.
    setDraft((d) => ({ ...d, latitude: lat, longitude: lng }));
    setIsPinning(true);
    try {
      const loc = await reverseGeocode(lng, lat, MAPBOX_TOKEN);
      setDraft((d) => ({
        ...d,
        ...loc,
        latitude: lat,
        longitude: lng,
      }));
      if (loc.address_line) {
        setMapQuery(loc.address_line);
      }
    } finally {
      setIsPinning(false);
    }
  };

  const lat = value?.latitude ?? defaultCenter.latitude;
  const lng = value?.longitude ?? defaultCenter.longitude;

  const draftLat = draft.latitude ?? lat;
  const draftLng = draft.longitude ?? lng;

  if (!hasToken) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium">Location (Map)</Label>
        <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-2 p-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Add <code className="bg-muted px-1 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to
            enable the map.
          </p>
          <Input
            placeholder="Enter address manually"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (query.trim()) {
                onChange({ ...value, address_line: query });
              }
            }}
            className="max-w-sm"
          />
        </div>
      </div>
    );
  }

  if (mapLayout === "modal") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold leading-none text-foreground">
                Primary location
              </p>
              {value?.address_line ? (
                <p className="text-sm leading-relaxed text-foreground break-words sm:text-[15px]">
                  {value.address_line}
                </p>
              ) : value?.latitude != null && value?.longitude != null ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Location pinned — open the map to add or refine the address.
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Choose where this tour starts. Search for a place or drop a pin on the map.
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full shrink-0 gap-2 border-border sm:w-auto"
              onClick={openMapDialog}
            >
              <MapPin className="size-4 shrink-0" aria-hidden />
              Search &amp; pin on map
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="min-h-[200px] h-[220px] max-h-[40vh] rounded-lg border border-border overflow-hidden bg-muted relative">
            <div className="absolute inset-0 w-full h-full">
              <MapboxContent
                longitude={
                  value?.longitude != null &&
                  !Number.isNaN(Number(value.longitude))
                    ? value.longitude
                    : defaultCenter.longitude
                }
                latitude={
                  value?.latitude != null && !Number.isNaN(Number(value.latitude))
                    ? value.latitude
                    : defaultCenter.latitude
                }
              />
            </div>
          </div>
          {!(
            value?.latitude != null &&
            value?.longitude != null &&
            !Number.isNaN(Number(value.latitude)) &&
            !Number.isNaN(Number(value.longitude))
          ) && (
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              {defaultCenter.fromUserLocation
                ? "Preview centered on your approximate location. Pin your tour location above to replace this."
                : "Preview map — open Search & pin above to set your tour location."}
            </p>
          )}
        </div>

        <Dialog open={mapOpen} onOpenChange={setMapOpen}>
          <DialogContent
            showCloseButton
            className="max-w-[calc(100%-1.5rem)] sm:max-w-2xl gap-0 p-0 overflow-hidden"
          >
            <div className="p-6 pb-4 border-b border-border">
              <DialogHeader>
                <DialogTitle>Set location</DialogTitle>
                <DialogDescription>
                  Search for a place or click the map to drop a pin. Apply to save this step’s
                  address and coordinates.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4 max-h-[min(85vh,720px)] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="map-modal-address" className="text-sm font-medium">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="map-modal-address"
                    placeholder="Search address…"
                    value={mapQuery}
                    onChange={handleMapSearchChange}
                    onFocus={() => mapSuggestions.length > 0 && setShowMapSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowMapSuggestions(false), 200)}
                    className={cn("h-11 pl-10", isMapSearching && "opacity-70")}
                    aria-busy={isMapSearching}
                  />
                  {showMapSuggestions && mapSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
                      {mapSuggestions.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-accent truncate"
                          onMouseDown={() => selectPlaceInModal(f)}
                        >
                          {f.place_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full min-h-[280px] h-[min(42vh,360px)] rounded-lg overflow-hidden border border-border relative bg-muted">
                <div className="absolute inset-0 w-full h-full">
                  <MapboxContent
                    key={mapDialogKey}
                    longitude={draftLng}
                    latitude={draftLat}
                    onMapClick={handleMapClickPin}
                  />
                </div>
                {isPinning && (
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-background/90 border-t border-border px-3 py-2 text-center text-xs text-muted-foreground">
                    Resolving address…
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Click anywhere on the map to move the pin; we fill the address from Mapbox when
                possible.
              </p>
            </div>

            <DialogFooter className="p-6 pt-0 gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => setMapOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleApplyMap} disabled={!canApplyMap}>
                Apply location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            aria-busy={isSearching}
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
    </div>
  );
}
