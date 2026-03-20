import type { Metadata } from "next";
import { Suspense } from "react";

import { ToursClient } from "./client";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { tourService } from "@/features/tours/tour.service";

export const metadata: Metadata = {
  title: "Tours Inventory",
  description: "Manage your agency tours and packages.",
};

const PER_PAGE = 20;

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; q?: string; page?: string }>;
}) {
  const { profile } = await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  const raw = await searchParams;
  const search = (raw.search ?? raw.q ?? "").trim();
  const page = Math.max(1, parseInt(raw.page ?? "1", 10) || 1);

  const { data: tours, total } = await tourService.listForAgencyPage({
    profile,
    page,
    pageSize: PER_PAGE,
    search,
  });

  const totalPages = Math.ceil((total ?? 0) / PER_PAGE);

  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <ToursClient
        tours={tours ?? []}
        page={page}
        totalPages={totalPages}
        search={search}
      />
    </Suspense>
  );
}
