import type { ReactNode } from "react";

import { requireRole } from "@/modules/profile/profile.guard";
import { ProfileRoles } from "@/modules/profile/profile.types";
import { companyService } from "@/modules/company/company.service";
import { CompanyStatuses } from "@/modules/company/company.types";
import { AgencyStatusWall } from "@/app/(dashboard)/agency/components/agency-status-wall";

export default async function AgencyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  if (profile.role === ProfileRoles.BUSINESS_OWNER) {
    const { data: company } = await companyService.getCompanyByOwner(profile.id);

    if (company && company.status !== CompanyStatuses.APPROVED) {
      return <AgencyStatusWall status={company.status} />;
    }
  }

  return children;
}
