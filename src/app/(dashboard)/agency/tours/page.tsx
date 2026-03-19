import type { Metadata } from "next";

import { ToursClient } from "./client";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";

export const metadata: Metadata = {
  title: "Tours Inventory",
  description: "Manage your agency tours and packages.",
};

export default async function ToursInventoryPage() {
  await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  return <ToursClient />;
}
