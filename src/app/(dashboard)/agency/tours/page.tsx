import type { Metadata } from "next";

import { parseListParams } from "@/features/shared/list-params";
import { agencyToursConfig } from "@/features/tours/utils/agency-tours-config";
import { tourService } from "@/features/tours/tour.service";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { ToursClient } from "./client";

export const metadata: Metadata = {
  title: "Tours Inventory",
  description: "Manage your agency tours and packages.",
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { profile } = await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  const rawSearchParams = await searchParams;
  const listParams = parseListParams(agencyToursConfig, rawSearchParams);

  const { data: tours, total } = await tourService.listForAgencyPage({
    ...listParams,
    profile,
  });

  const totalPages = Math.ceil((total ?? 0) / listParams.pageSize);

  return (
    <ToursClient
      tours={tours ?? []}
      page={listParams.page}
      totalPages={totalPages}
      listParams={listParams}
    />
  );
}
