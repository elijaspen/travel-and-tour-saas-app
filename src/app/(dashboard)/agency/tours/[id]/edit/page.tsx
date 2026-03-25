import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { companyService } from "@/features/company/company.service";
import { tourService } from "@/features/tours/tour.service";
import { EditTourWizardClient } from "@/app/(dashboard)/agency/tours/[id]/edit/client";

export const metadata: Metadata = {
  title: "Edit Tour",
  description: "Edit an existing tour package.",
};

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  const { id: tourId } = await params;

  const { data: tour } = await tourService.getTourWithDetails(tourId);
  if (!tour) notFound();

  if (profile.role === ProfileRoles.BUSINESS_OWNER) {
    const { data: company } = await companyService.getCompanyByOwner(profile.id);
    if (!company || company.id !== tour.company_id) notFound();
  }

  return <EditTourWizardClient tourId={tourId} tour={tour} />;
}
