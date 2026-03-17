import { getNavConfig } from "@/config/navigation";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { companyService } from "@/features/company/company.service";
import { BusinessOnboardingModal } from "@/components/shared/business-onboarding-modal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole([
    ProfileRoles.CUSTOMER,
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  const navConfig = getNavConfig(profile.role);

  let requiresOnboarding = false;
  if (profile.role === ProfileRoles.BUSINESS_OWNER) {
    const { data: company } = await companyService.getCompanyByOwner(profile.id);
    requiresOnboarding = !company;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar profile={profile} navConfig={navConfig} />
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
      {requiresOnboarding && <BusinessOnboardingModal />}
    </div>
  );
}
