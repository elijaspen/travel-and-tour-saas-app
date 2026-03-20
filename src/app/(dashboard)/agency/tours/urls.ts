import { ROUTE_PATHS } from "@/config/routes";

/** `/agency/tours` with optional `?search=` and `?page=` (page omitted when 1). */
export function agencyToursPath(search: string, page: number) {
  const p = new URLSearchParams();
  if (search.trim()) p.set("search", search.trim());
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return qs
    ? `${ROUTE_PATHS.AUTHED.AGENCY.TOURS}?${qs}`
    : ROUTE_PATHS.AUTHED.AGENCY.TOURS;
}
