import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTE_PATHS } from "@/config/routes";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { companyService } from "@/features/company/company.service";
import {
  FileCheck,
  ShieldCheck,
  Users,
  Building2,
  CalendarCheck,
  DollarSign,
  Activity,
  UsersRound,
  Settings,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Platform administration and moderation.",
};

export default async function AdminPage() {
  await requireRole([ProfileRoles.ADMIN]);

  // TODO: fetch real metrics for users, bookings, and revenue
  const moderationCount = 0;
  const totalUsers = 0;
  const totalBookings = 0;
  const platformRevenue = "$0";
  const recentActivity: never[] = [];

  const { data: counts } = await companyService.getStatusCounts();
  const pendingCount = counts?.pending ?? 0;
  const totalBusinesses = counts?.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin dashboard"
        description="Review businesses, moderate content, and keep the platform healthy."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          description="Registered accounts"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Total Businesses"
          value={totalBusinesses}
          description="Onboarded companies"
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          description="Across all tours"
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Platform Revenue"
          value={platformRevenue}
          description="All-time gross revenue"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Flags &amp; alerts
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                Pending businesses
              </CardTitle>
              <Badge variant={pendingCount > 0 ? "destructive" : "secondary"}>
                {pendingCount}
              </Badge>
            </CardHeader>
            <CardContent>
              {pendingCount > 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {pendingCount} business{pendingCount === 1 ? "" : "es"} waiting for review.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-fit">
                    <Link href={`${ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES}?status=pending`}>
                      Review pending
                    </Link>
                  </Button>
                </div>
              ) : (
                <EmptyState
                  icon={<FileCheck className="h-10 w-10" />}
                  title="No pending businesses"
                  description="Businesses awaiting approval will appear here."
                  action={
                    <Button asChild variant="outline" size="sm">
                      <Link href={ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES}>
                        View all businesses
                      </Link>
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Moderation queue</CardTitle>
              <Badge variant={moderationCount > 0 ? "destructive" : "secondary"}>
                {moderationCount}
              </Badge>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<ShieldCheck className="h-10 w-10" />}
                title="No items in queue"
                description="Reported tours and reviews will show up here for action."
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTE_PATHS.AUTHED.ADMIN.ROOT}>
                      View moderation
                    </Link>
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Quick access
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
              <UsersRound className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">User Management</p>
                <p className="text-sm text-muted-foreground">
                  View, edit, and manage all users
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTE_PATHS.AUTHED.ADMIN.ROOT}>
                  Open
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
              <Settings className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Global Settings</p>
                <p className="text-sm text-muted-foreground">
                  Configure platform-wide options
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTE_PATHS.AUTHED.ADMIN.ROOT}>
                  Open
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Financial Overview</p>
                <p className="text-sm text-muted-foreground">
                  Revenue, payouts, and reports
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTE_PATHS.AUTHED.ADMIN.ROOT}>
                  Open
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <EmptyState
              icon={<Activity className="h-10 w-10" />}
              title="No recent activity"
              description="Platform events such as sign-ups, bookings, and flags will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* TODO: render real activity rows from supabase */}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
