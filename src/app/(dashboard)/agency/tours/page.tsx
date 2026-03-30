import type { Metadata } from "next";

import { parseListParams } from "@/modules/shared/list-params";
import { agencyToursConfig } from "@/modules/tours/utils/agency-tours-config";
import { tourService } from "@/modules/tours/tour.service";
import { requireRole } from "@/modules/profile/profile.guard";
import { ProfileRoles } from "@/modules/profile/profile.types";
import { ToursClient } from "@/app/(dashboard)/agency/tours/client";

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
