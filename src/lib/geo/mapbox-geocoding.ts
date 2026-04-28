export const MapboxGeocodingV5 = {
  apiOrigin: "https://api.mapbox.com",
  pathPrefix: "/geocoding/v5",
  placesDatasetId: "mapbox.places",
} as const;

export const MapboxGeocodingQueryParam = {
  ACCESS_TOKEN: "access_token",
  LIMIT: "limit",
  PROXIMITY: "proximity",
  TYPES: "types",
} as const;

function placesBasePath(): string {
  return `${MapboxGeocodingV5.apiOrigin}${MapboxGeocodingV5.pathPrefix}/${MapboxGeocodingV5.placesDatasetId}`;
}

export function mapboxPlacesForwardUrl(searchText: string, query: URLSearchParams): string {
  const segment = encodeURIComponent(searchText);
  return `${placesBasePath()}/${segment}.json?${query}`;
}

export function mapboxPlacesReverseUrl(
  longitude: number,
  latitude: number,
  query: URLSearchParams,
): string {
  const segment = `${longitude},${latitude}`;
  return `${placesBasePath()}/${segment}.json?${query}`;
}

export type MapboxGeocodingContext = {
  id: string;
  text: string;
  short_code?: string;
};

export type MapboxGeocodingFeature = {
  id: string;
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  context?: MapboxGeocodingContext[];
};

export type ForwardGeocodeOptions = {
  limit?: number;
  proximity?: { longitude: number; latitude: number };
  /** Overrides {@link MAPBOX_DEFAULT_PLACE_TYPES} (Mapbox `types` query param). */
  types?: string;
  accessToken: string;
};

/** Place categories forwarded to the Mapbox Geocoding API. */
export const MapboxGeocodePlaceType = {
  COUNTRY: "country",
  REGION: "region",
  PLACE: "place",
  LOCALITY: "locality",
} as const;

export const MAPBOX_DEFAULT_PLACE_TYPES = [
  MapboxGeocodePlaceType.COUNTRY,
  MapboxGeocodePlaceType.REGION,
  MapboxGeocodePlaceType.PLACE,
  MapboxGeocodePlaceType.LOCALITY,
].join(",");

const DEFAULT_RADIUS_KM = 25;

function radiusKmToBbox(
  lng: number,
  lat: number,
  radiusKm: number,
): [number, number, number, number] {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180) || 1e-6);
  return [lng - lngDelta, lat - latDelta, lng + lngDelta, lat + latDelta];
}

/** Use feature.bbox when present; fall back to center + fixed radius. */
export function featureToExploreBbox(
  feature: MapboxGeocodingFeature,
): [number, number, number, number] {
  if (feature.bbox?.length === 4) {
    const [minLng, minLat, maxLng, maxLat] = feature.bbox;
    if (
      Number.isFinite(minLng) &&
      Number.isFinite(minLat) &&
      Number.isFinite(maxLng) &&
      Number.isFinite(maxLat) &&
      minLng <= maxLng &&
      minLat <= maxLat
    ) {
      return [minLng, minLat, maxLng, maxLat];
    }
  }
  const [lng, lat] = feature.center;
  return radiusKmToBbox(lng, lat, DEFAULT_RADIUS_KM);
}

export async function forwardGeocodePlaces(
  query: string,
  options: ForwardGeocodeOptions,
): Promise<MapboxGeocodingFeature[]> {
  const q = query.trim();
  if (!q || !options.accessToken) return [];

  const usp = new URLSearchParams({
    [MapboxGeocodingQueryParam.ACCESS_TOKEN]: options.accessToken,
    [MapboxGeocodingQueryParam.LIMIT]: String(options.limit ?? 6),
    [MapboxGeocodingQueryParam.TYPES]: options.types ?? MAPBOX_DEFAULT_PLACE_TYPES,
  });

  if (options.proximity) {
    usp.set(
      MapboxGeocodingQueryParam.PROXIMITY,
      `${options.proximity.longitude},${options.proximity.latitude}`,
    );
  }

  const res = await fetch(mapboxPlacesForwardUrl(q, usp));
  if (!res.ok) return [];
  const data = (await res.json()) as { features?: MapboxGeocodingFeature[] };
  return data.features ?? [];
}

/** Returns the most descriptive context label (country > region). */
export function featureCountryOrRegion(feature: MapboxGeocodingFeature): string | undefined {
  const ctx = feature.context ?? [];
  return (
    ctx.find((c) => c.id.startsWith(MapboxGeocodePlaceType.COUNTRY))?.text ??
    ctx.find((c) => c.id.startsWith(MapboxGeocodePlaceType.REGION))?.text
  );
}
