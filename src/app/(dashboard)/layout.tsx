import { getNavConfig } from "@/config/navigation";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

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

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar profile={profile} navConfig={navConfig} />
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
