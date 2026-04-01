import type { Metadata } from "next";

import { requireRole } from "@/modules/profile/profile.guard";
import { ProfileRoles } from "@/modules/profile/profile.types";
import { CreateTourWizardClient } from "@/app/(dashboard)/agency/tours/new/client";

export const metadata: Metadata = {
  title: "Create Tour",
  description: "Create a new tour package for your agency.",
};


export default async function CreateTourPage() {
  await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  return <CreateTourWizardClient />;
}
