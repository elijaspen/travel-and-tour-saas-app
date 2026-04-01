"use client";

import Image from "next/image";
import { Heart, MapPin, Clock, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface ExplorePackage {
  id: string | number;
  image: string;
  title: string;
  provider: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
}

interface ExplorePackageCardProps {
  pkg: ExplorePackage;
}

export function ExplorePackageCard({ pkg }: ExplorePackageCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {pkg.badge && (
          <div className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
            {pkg.badge}
          </div>
        )}

        <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur">
          <Heart className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-slate-500">By {pkg.provider}</p>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{pkg.title}</h3>

        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {pkg.location}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {pkg.duration}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-900">{pkg.rating}</span>
          <span className="text-slate-500">({pkg.reviews})</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase text-slate-400">From</p>
            <p className="text-lg font-bold text-slate-900">${pkg.price}</p>
          </div>

          <Button size="sm" variant="outline" className="rounded-xl border-slate-200 text-xs">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
