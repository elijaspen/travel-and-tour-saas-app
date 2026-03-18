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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTE_PATHS } from "@/config/routes";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Calendar,
  Package,
  Plus,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Business Dashboard",
  description: "Manage your agency operations.",
};

// TODO: replace with real data after schema applied to supabase
const RECENT_BOOKINGS = [
  {
    id: "1",
    customerInitials: "AF",
    customerName: "Alice Freeman",
    package: "Bali Jungle Trek",
    dates: "Oct 12-19",
    status: "confirmed" as const,
    amount: "$450",
  },
  {
    id: "2",
    customerInitials: "MT",
    customerName: "Mark Taylor",
    package: "Komodo Island",
    dates: "Nov 02-05",
    status: "pending" as const,
    amount: "$1,250",
  },
  {
    id: "3",
    customerInitials: "SW",
    customerName: "Sophie Wu",
    package: "Tokyo City Tour",
    dates: "Dec 10-15",
    status: "confirmed" as const,
    amount: "$850",
  },
  {
    id: "4",
    customerInitials: "JM",
    customerName: "James Miller",
    package: "Iceland Northern Lights",
    dates: "Jan 05-10",
    status: "cancelled" as const,
    amount: "$1,899",
  },
  {
    id: "5",
    customerInitials: "EW",
    customerName: "Emma Wilson",
    package: "Paris Romantic Gateway",
    dates: "Feb 14-18",
    status: "confirmed" as const,
    amount: "$2,100",
  },
];

const ACTIVE_PROMOTIONS = [
  { id: "1", code: "SUMMER2024", discount: "20% Off", active: true },
  { id: "2", code: "BALIBLISS", discount: "$50 Off", active: true },
  { id: "3", code: "EARLYBIRD", discount: "15% Off", active: false },
  { id: "4", code: "FAMILYFUN", discount: "10% Off", active: false },
];

const TOP_PACKAGES = [
  {
    id: "1",
    name: "Ubud Cultural Trek",
    sales: 42,
    trend: "+12%",
    positive: true,
    color: "bg-amber-200",
  },
  {
    id: "2",
    name: "Kyoto Tea Ceremony",
    sales: 28,
    trend: "+6%",
    positive: true,
    color: "bg-emerald-200",
  },
  {
    id: "3",
    name: "Northern Lights",
    sales: 15,
    trend: "-2%",
    positive: false,
    color: "bg-sky-200",
  },
  {
    id: "4",
    name: "Safari Adventure",
    sales: 12,
    trend: "+8%",
    positive: true,
    color: "bg-orange-200",
  },
];

const BAR_CHART_DATA = [
  { month: "Jan", height: 40 },
  { month: "Feb", height: 55 },
  { month: "Mar", height: 70 },
  { month: "Apr", height: 60 },
  { month: "May", height: 85 },
  { month: "Jun", height: 95 },
  { month: "Jul", height: 75 },
];

const STATUS_STYLES: Record<
  "confirmed" | "pending" | "cancelled",
  { label: string; className: string }
> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-foreground text-background hover:bg-foreground/90",
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border border-border",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border border-border",
  },
};

export default async function BusinessDashboardPage() {
  await requireRole([
    ProfileRoles.BUSINESS_OWNER,
    ProfileRoles.AGENT,
    ProfileRoles.ADMIN,
  ]);

  // TODO: replace with real data from Supabase
  const totalRevenue = "$124,500";
  const activeBookings = 84;
  const packagesSold = 312;
  const avgRating = "4.9";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Overview"
          description="High-level view of your tours, bookings, and revenue."
        />
        <Button asChild>
          <Link href={ROUTE_PATHS.AUTHED.AGENCY.TOURS}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          description="vs last month"
          icon={<BarChart2 className="h-4 w-4" />}
          trend={{ label: "+12%", positive: true }}
        />
        <StatCard
          title="Active Bookings"
          value={activeBookings}
          description="Current travelers"
          icon={<Calendar className="h-4 w-4" />}
          trend={{ label: "+5%", positive: true }}
        />
        <StatCard
          title="Packages Sold"
          value={packagesSold}
          description="This month"
          icon={<Package className="h-4 w-4" />}
          trend={{ label: "+18%", positive: true }}
        />
        <StatCard
          title="Avg. Rating"
          value={avgRating}
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <CardTitle className="text-base">Revenue Overview</CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Monthly performance comparison
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Last 6 months
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-3 px-2">
              {BAR_CHART_DATA.map((bar) => (
                <div
                  key={bar.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-sm bg-foreground/90"
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Active Promotions</CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <span className="sr-only">More options</span>
              <span aria-hidden className="text-muted-foreground">
                ···
              </span>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {ACTIVE_PROMOTIONS.map((promo) => (
              <div
                key={promo.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{promo.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {promo.discount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {promo.active ? (
                    <span className="text-xs font-medium text-emerald-600">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Inactive
                    </span>
                  )}
                  <Switch
                    defaultChecked={promo.active}
                    aria-label={`Toggle ${promo.code}`}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-1 w-full text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
              Create Promo Code
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base">Recent Bookings</CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Latest customer reservations
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href={ROUTE_PATHS.AUTHED.AGENCY.BOOKINGS}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_BOOKINGS.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {booking.customerInitials}
                        </div>
                        <span className="text-sm font-medium">
                          {booking.customerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.package}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.dates}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={STATUS_STYLES[booking.status].className}
                      >
                        {STATUS_STYLES[booking.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right text-sm font-medium">
                      {booking.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Top Packages</CardTitle>
            <p className="text-sm text-muted-foreground">
              Best selling tours this month
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {TOP_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3">
                <div className={cn("h-12 w-16 shrink-0 rounded-md", pkg.color)} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{pkg.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {pkg.sales} sales
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 font-medium",
                        pkg.positive ? "text-emerald-600" : "text-destructive"
                      )}
                    >
                      {pkg.positive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {pkg.trend}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-1 w-full text-xs"
            >
              <Link href={ROUTE_PATHS.AUTHED.AGENCY.TOURS}>
                View All Packages
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
