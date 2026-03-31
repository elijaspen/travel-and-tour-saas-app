import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ROUTE_PATHS } from "@/config/routes";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
import { HeartButton } from "@/components/shared/heart-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, ChevronDown, Home, Heart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

/**
 * TODO: Integration - Future Update
 * Replace this MOCK_SAVED_TOURS with real data fetching using savedToursService.
 * Example: const { data: savedTours } = await savedToursService.getSavedTours(profile.id);
 */
const MOCK_SAVED_TOURS = [
  {
    id: "1",
    tour: {
        id: "1",
        title: "Tropical Paradise Beach Escape",
        photos: [{ file_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" }],
        prices: [{ amount: 2499 }]
    },
    location: "Maldives",
    duration: "7 days",
    groupSize: "2-8 people",
    category: "Beach"
  },
  {
    id: "2",
    tour: {
        id: "2",
        title: "Alpine Mountain Hiking Adventure",
        photos: [{ file_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800" }],
        prices: [{ amount: 1899 }]
    },
    location: "Swiss Alps, Switzerland",
    duration: "5 days",
    groupSize: "4-12 people",
    category: "Mountain"
  },
  {
    id: "3",
    tour: {
        id: "3",
        title: "Ancient Temples Cultural Journey",
        photos: [{ file_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800" }],
        prices: [{ amount: 2199 }]
    },
    location: "Kyoto, Japan",
    duration: "6 days",
    groupSize: "2-10 people",
    category: "Cultural"
  }
];

export const metadata: Metadata = {
  title: "Saved Tours",
  description: "Your bookmarked travel experiences.",
};

export default function SavedToursPage() {
  // Use mock data for now
  const savedTours = MOCK_SAVED_TOURS;

  return (
<div className="flex flex-col gap-8 pb-12">
      
      {/* 1. BREADCRUMB */}
      <div className="px-6 md:px-8 lg:px-12 pt-6 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  href={ROUTE_PATHS.AUTHED.SHARED.DASHBOARD} 
                  className="flex items-center"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator />
            
            <BreadcrumbItem>
              <BreadcrumbPage>Saved Tours</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 md:px-8 lg:px-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Tours</h1>
          <p className="text-muted-foreground mt-1">
            Your bookmarked travel experiences
          </p>
        </div>
        
        {savedTours && savedTours.length > 0 && (
            <Button variant="outline" className="w-fit">
                Sort by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        )}
      </div>

      <Separator />

      {/* Content Area */}
      <div className="px-6 md:px-8 lg:px-12">
        {!savedTours || savedTours.length === 0 ? (
            <EmptyState
                icon={<Heart className="h-10 w-10" />}
                title="No saved tours yet"
                description="Start exploring and save your favorite travel experiences to find them easily here."
                action={
                    <Button asChild>
                        <Link href="/explore">Explore Tours</Link>
                    </Button>
                }
                className="py-20"
            />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                {savedTours.map(({ tour, id: savedId, location, duration, groupSize, category }) => (
                    <div 
                        key={savedId} 
                        className="flex flex-col bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden"
                    >
                        {/* Image & Badges */}
                        <div className="relative aspect-[4/3] w-full">
                        {tour.photos?.[0] ? (
                            <Image
                                src={tour.photos[0].file_url}
                                alt={tour.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                        
                        {/* Category Badge */}
                        <Badge 
                            variant="secondary" 
                            className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white"
                        >
                            {category}
                        </Badge>
                        
                        {/* Heart Button */}
                        <HeartButton 
                            tourId={tour.id} 
                            initialIsSaved={true} 
                        />
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-col p-5 gap-4 flex-1">
                        <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                            {tour.title}
                        </h3>

                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
                            <span className="truncate">{location}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Clock className="mr-1.5 h-4 w-4 shrink-0" />
                                {duration}
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-1.5 h-4 w-4 shrink-0" />
                                {groupSize}
                            </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-2xl font-bold">
                            {tour.prices?.[0] ? `From $${tour.prices[0].amount}` : "Price on request"}
                            </p>
                        </div>

                        <Button asChild className="w-full mt-2 bg-zinc-900 text-white hover:bg-zinc-800">
                            <Link href={`/tours/${tour.id}`}>View Details</Link>
                        </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
