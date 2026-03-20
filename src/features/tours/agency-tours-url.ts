import { ROUTE_PATHS } from "@/config/routes";

/** Maps to `tours.is_active`: Published vs Unpublished in the UI. */
export type AgencyToursPublication = "all" | "published" | "unpublished";

export type AgencyToursTourTypeFilter = "all" | "on_demand" | "fixed_schedule";

export type AgencyToursSort =
  | "created_desc"
  | "created_asc"
  | "title_asc"
  | "title_desc"
  | "duration_asc"
  | "duration_desc";

export const DEFAULT_AGENCY_TOURS_SORT: AgencyToursSort = "created_desc";

export type AgencyToursListQuery = {
  search: string;
  page: number;
  publication: AgencyToursPublication;
  tourType: AgencyToursTourTypeFilter;
  sort: AgencyToursSort;
};

const SORT_VALUES: AgencyToursSort[] = [
  "created_desc",
  "created_asc",
  "title_asc",
  "title_desc",
  "duration_asc",
  "duration_desc",
];

export function parsePublicationFilter(
  raw: string | undefined
): AgencyToursPublication {
  if (raw === "published" || raw === "unpublished") return raw;
  return "all";
}

export function parseTourTypeFilter(
  raw: string | undefined
): AgencyToursTourTypeFilter {
  if (raw === "on_demand" || raw === "fixed_schedule") return raw;
  return "all";
}

export function parseSort(raw: string | undefined): AgencyToursSort {
  if (raw && SORT_VALUES.includes(raw as AgencyToursSort)) {
    return raw as AgencyToursSort;
  }
  return DEFAULT_AGENCY_TOURS_SORT;
}

export function agencyToursPath(q: AgencyToursListQuery): string {
  const p = new URLSearchParams();
  if (q.search.trim()) p.set("search", q.search.trim());
  if (q.page > 1) p.set("page", String(q.page));
  if (q.publication !== "all") p.set("status", q.publication);
  if (q.tourType !== "all") p.set("tourType", q.tourType);
  if (q.sort !== DEFAULT_AGENCY_TOURS_SORT) p.set("sort", q.sort);
  const qs = p.toString();
  return qs
    ? `${ROUTE_PATHS.AUTHED.AGENCY.TOURS}?${qs}`
    : ROUTE_PATHS.AUTHED.AGENCY.TOURS;
}
