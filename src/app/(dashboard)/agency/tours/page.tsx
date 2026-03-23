import type { Metadata } from "next";

import {
  parsePublicationFilter,
  parseSort,
  parseTourTypeFilter,
} from "@/features/tours/agency-tours-url";
import { ToursClient } from "./client";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { tourService } from "@/features/tours/tour.service";

export const metadata: Metadata = {
  title: "Tours Inventory",
  description: "Manage your agency tours and packages.",
};

const PER_PAGE = 5;

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    q?: string;
    page?: string;
    status?: string;
    tourType?: string;
    sort?: string;
  }>;
}) {
  const { profile } = await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  const raw = await searchParams;
  const search = (raw.search ?? raw.q ?? "").trim();
  const page = Math.max(1, parseInt(raw.page ?? "1", 10) || 1);
  const publication = parsePublicationFilter(raw.status);
  const tourType = parseTourTypeFilter(raw.tourType);
  const sort = parseSort(raw.sort);

  const { data: tours, total } = await tourService.listForAgencyPage({
    profile,
    page,
    pageSize: PER_PAGE,
    search,
    publication,
    tourType,
    sort,
  });

  const totalPages = Math.ceil((total ?? 0) / PER_PAGE);

  return (
    <ToursClient
      tours={tours ?? []}
      page={page}
      totalPages={totalPages}
      search={search}
      publication={publication}
      tourType={tourType}
      sort={sort}
    />
  );
}
