import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTE_PATHS } from "@/config/routes";

// TODO: Replace with actual travel package types when added to db
type TravelPackage = {
  id: string | number;
  image: string;
  title: string;
  agency: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
};

type TravelPackageCardProps = {
  pkg: TravelPackage;
};

export function TravelPackageCard({ pkg }: TravelPackageCardProps) {
  return (
    <Card className="group overflow-hidden border-0 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur-sm">
            {pkg.duration}
          </span>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="mb-1 text-lg font-bold text-slate-900 group-hover:text-brand">{pkg.title}</h3>
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-sm text-slate-500">{pkg.agency}</span>
          <BadgeCheck className="h-4 w-4 text-brand" />
          <Badge variant="secondary" className="ml-auto text-xs">
            Verified
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-700">{pkg.rating}</span>
          <span>({pkg.reviews} reviews)</span>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Starting from</span>
            <p className="text-xl font-bold text-brand">{pkg.price}</p>
          </div>
          <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.TOURS}>
              Book Now
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type TravelPackagesGridProps = {
  packages: TravelPackage[];
  emptyState?: React.ReactNode;
};

export function TravelPackagesGrid({ packages, emptyState }: TravelPackagesGridProps) {
  if (!packages.length) {
    return (
      emptyState ?? (
        <p className="text-center text-sm text-slate-500">No travel packages available right now. Please check back soon.</p>
      )
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <TravelPackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}

