import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/layout/page-header";
import { EmptyState } from "@/components/shared/data-display/empty-state";
import { StatCard } from "@/components/shared/data-display/stat-card";
import { ROUTE_PATHS } from "@/config/routes";
import { requireRole } from "@/modules/profile/profile.guard";
import { ProfileRoles } from "@/modules/profile/profile.types";
import {
  MapPin,
  Calendar,
  Bookmark,
  Star,
  Compass,
  ClipboardList,
  PenLine,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your trips, bookings, and reviews.",
};

export default async function DashboardPage() {
  const { profile } = await requireRole([ProfileRoles.CUSTOMER]);

  // TODO: fetch real data after schema applied to supabase
  const upcomingTripsCount = 0;
  const totalBookingsCount = 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${profile.full_name}`}
        description="Here's what's happening with your trips."
      />

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.TOURS}>
              <Compass className="mr-2 h-4 w-4" />
              Explore Tours
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTE_PATHS.AUTHED.TRAVELER.TRIPS}>
              <ClipboardList className="mr-2 h-4 w-4" />
              My Bookings
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTE_PATHS.AUTHED.SHARED.SAVED}>
              <Bookmark className="mr-2 h-4 w-4" />
              Saved Tours
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTE_PATHS.AUTHED.TRAVELER.REVIEWS}>
              <PenLine className="mr-2 h-4 w-4" />
              Write a Review
            </Link>
          </Button>
        </div>
      </section>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Upcoming Trips"
          value={upcomingTripsCount}
          description="Trips scheduled in the future"
          icon={<MapPin className="h-4 w-4" />}
        />
        <StatCard
          title="Total Bookings"
          value={totalBookingsCount}
          description="All bookings across your account"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Upcoming trips</CardTitle>
            <Badge variant="secondary">{upcomingTripsCount}</Badge>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<MapPin className="h-10 w-10" />}
              title="No upcoming trips"
              description="Discover tours and book your next adventure."
              action={
                <Button asChild size="sm">
                  <Link href={ROUTE_PATHS.PUBLIC.MARKETING.TOURS}>
                    Explore tours
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent bookings</CardTitle>
            <Badge variant="secondary">{totalBookingsCount}</Badge>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Calendar className="h-10 w-10" />}
              title="No bookings yet"
              description="Your booking history will appear here."
              action={
                <Button asChild size="sm">
                  <Link href={ROUTE_PATHS.AUTHED.TRAVELER.TRIPS}>
                    View bookings
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Saved tours</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Bookmark className="h-10 w-10" />}
              title="No saved tours"
              description="Save tours you like to find them later."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href={ROUTE_PATHS.AUTHED.SHARED.SAVED}>
                    View saved
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Star className="h-10 w-10" />}
              title="No reviews yet"
              description="Reviews you write will show up here."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href={ROUTE_PATHS.AUTHED.TRAVELER.REVIEWS}>
                    View all reviews
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
