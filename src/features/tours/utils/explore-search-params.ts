/**
 * Explore URL query contract for unified destination + tour search.
 *
 * Precedence for listing:
 *   1. `ExploreUrlParam.TOUR` (UUID) → single-tour focus; ignore geo fields.
 *   2. `PLACE` + `BBOX` → destination-scoped listing.
 *   3. `Q` alone → raw keyword until geocoded server-side.
 *
 * String keys and selection kinds live in `explore-search.constants.ts`.
 */

import { ExploreQueryCopy, ExploreUrlParam, UnifiedSelectionKind } from "./explore-search.constants";

export type Bbox = readonly [minLng: number, minLat: number, maxLng: number, maxLat: number];

export type ExploreSearchQuery = {
  place?: string;
  bbox?: Bbox;
  q?: string;
  tour?: string;
};

export type UnifiedSearchSelection =
  | { kind: typeof UnifiedSelectionKind.DESTINATION; placeName: string; bbox: Bbox }
  | { kind: typeof UnifiedSelectionKind.TOUR; tourId: string; title: string }
  | { kind: typeof UnifiedSelectionKind.KEYWORD; q: string };

export type { UnifiedSelectionKindValue } from "./explore-search.constants";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseBbox(raw: string | undefined): Bbox | undefined {
  if (!raw?.trim()) return undefined;
  const parts = raw.split(",").map((s) => Number.parseFloat(s.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return undefined;
  const [minLng, minLat, maxLng, maxLat] = parts as [number, number, number, number];
  if (minLng > maxLng || minLat > maxLat) return undefined;
  return [minLng, minLat, maxLng, maxLat] as const;
}

function bboxToString(b: Bbox): string {
  return `${b[0]},${b[1]},${b[2]},${b[3]}`;
}

export function parseExploreSearchQuery(
  raw: Record<string, string | string[] | undefined>,
): ExploreSearchQuery {
  const pick = (key: (typeof ExploreUrlParam)[keyof typeof ExploreUrlParam]): string | undefined => {
    const v = raw[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const out: ExploreSearchQuery = {};

  const tour = pick(ExploreUrlParam.TOUR);
  if (tour && UUID_RE.test(tour)) out.tour = tour;

  const q = pick(ExploreUrlParam.Q);
  if (q?.trim()) out.q = q.trim();

  const place = pick(ExploreUrlParam.PLACE);
  if (place?.trim()) out.place = place.trim();

  const bbox = parseBbox(pick(ExploreUrlParam.BBOX));
  if (bbox) out.bbox = bbox;

  return out;
}

export function buildExploreSearchQuery(params: ExploreSearchQuery): Record<string, string> {
  const row: Record<string, string> = {};
  if (params.tour) row[ExploreUrlParam.TOUR] = params.tour;
  if (params.q?.trim()) row[ExploreUrlParam.Q] = params.q.trim();
  if (params.place?.trim()) row[ExploreUrlParam.PLACE] = params.place.trim();
  if (params.bbox?.length === 4) row[ExploreUrlParam.BBOX] = bboxToString(params.bbox);
  return row;
}

export function explorePathWithQuery(path: string, params: ExploreSearchQuery): string {
  const built = buildExploreSearchQuery(params);
  const usp = new URLSearchParams(built);
  const s = usp.toString();
  return s ? `${path}?${s}` : path;
}

export function selectionToExploreQuery(selection: UnifiedSearchSelection): ExploreSearchQuery {
  if (selection.kind === UnifiedSelectionKind.TOUR) return { tour: selection.tourId };
  if (selection.kind === UnifiedSelectionKind.KEYWORD) {
    const q = selection.q.trim();
    return q ? { q } : {};
  }
  return { place: selection.placeName, bbox: selection.bbox };
}

export function exploreQueryLabel(query: ExploreSearchQuery): string {
  if (query.tour) return ExploreQueryCopy.selectedTour;
  if (query.place) return query.place;
  if (query.q) return query.q;
  return ExploreQueryCopy.allDestinations;
}
