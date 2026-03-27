"use client";

import { useMemo, useState } from "react";

import { ExploreFiltersSidebar } from "@/components/shared/explore-filters-sidebar";
import {
  ExploreResultsHeader,
  type ExploreSortValue,
} from "@/components/shared/explore-results-header";
import { ExploreSearchBar } from "@/components/shared/explore-search-bar";
import { ExplorePackagesGrid } from "@/components/shared/explore-packages-grid";
import { Pagination } from "@/components/shared/pagination";
import { ExploreBreadcrumbs } from "@/components/shared/explore-breadcrumbs";

const MOCK_PACKAGES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1604999333679-b86d54738315",
    title: "Ubud Cultural Jungle Trek & Rice Fields",
    provider: "Bali Local Guides",
    location: "Bali, Indonesia",
    duration: "8 Hours",
    price: 450,
    rating: 4.9,
    reviews: 142,
    badge: "BEST SELLER",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b",
    title: "Private Komodo Island Dragon Tour",
    provider: "Global Trek",
    location: "Komodo, Indonesia",
    duration: "3 Days",
    price: 1250,
    rating: 4.8,
    reviews: 89,
    badge: "POPULAR",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Nusa Penida Day Trip with Snorkeling",
    provider: "Island Hoppers",
    location: "Nusa Penida, Indonesia",
    duration: "1 Day",
    price: 180,
    rating: 4.7,
    reviews: 215,
    badge: "ECO FRIENDLY",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Mount Batur Sunrise Hike & Breakfast",
    provider: "Bali Sun Tours",
    location: "Kintamani, Indonesia",
    duration: "10 Hours",
    price: 85,
    rating: 4.9,
    reviews: 530,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Uluwatu Temple & Kecak Fire Dance",
    provider: "Wanderlust Inc",
    location: "Uluwatu, Indonesia",
    duration: "5 Hours",
    price: 65,
    rating: 4.6,
    reviews: 120,
    badge: "CULTURAL",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
    title: "Gili Islands 3-Day Relaxation Package",
    provider: "Ocean Blue Travel",
    location: "Gili Trawangan, Indonesia",
    duration: "3 Days",
    price: 850,
    rating: 4.8,
    reviews: 76,
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    title: "Seminyak Foodie Walking Tour",
    provider: "Bali Local Guides",
    location: "Seminyak, Indonesia",
    duration: "4 Hours",
    price: 120,
    rating: 4.9,
    reviews: 204,
    badge: "FOODIE CHOICE",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
    title: "East Bali Water Palaces & Snorkeling",
    provider: "Global Trek",
    location: "Amed, Indonesia",
    duration: "9 Hours",
    price: 210,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
    title: "Luxury Spa & Wellness Retreat",
    provider: "Zen Travels",
    location: "Ubud, Indonesia",
    duration: "2 Days",
    price: 1500,
    rating: 5.0,
    reviews: 32,
    badge: "LUXURY",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
    title: "Hidden Waterfalls of North Bali",
    provider: "Island Hoppers",
    location: "North Bali, Indonesia",
    duration: "1 Day",
    price: 140,
    rating: 4.7,
    reviews: 91,
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Bali ATV Jungle Adventure",
    provider: "Wanderlust Inc",
    location: "Ubud, Indonesia",
    duration: "6 Hours",
    price: 190,
    rating: 4.8,
    reviews: 167,
    badge: "ADVENTURE",
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    title: "Sunset Cruise Dinner Experience",
    provider: "Ocean Blue Travel",
    location: "Jimbaran, Indonesia",
    duration: "4 Hours",
    price: 260,
    rating: 4.6,
    reviews: 58,
  },
];

const ITEMS_PER_PAGE = 9;

function toggleArrayValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function getDurationBucket(duration: string) {
  const normalized = duration.toLowerCase();

  if (normalized.includes("hour")) {
    return "up-to-3-days";
  }

  const daysMatch = normalized.match(/(\d+)/);
  const days = daysMatch ? Number(daysMatch[1]) : 1;

  if (days <= 3) return "up-to-3-days";
  if (days <= 7) return "4-to-7-days";
  if (days <= 14) return "8-to-14-days";
  return "15-plus-days";
}

function matchesRatingFilter(rating: number, selectedRatings: string[]) {
  if (!selectedRatings.length) return true;

  return selectedRatings.some((filter) => {
    if (filter === "5-up") return rating >= 5;
    if (filter === "4-up") return rating >= 4;
    if (filter === "3-up") return rating >= 3;
    return true;
  });
}

export default function ExplorePageClient() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<ExploreSortValue>("recommended");
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  const queryLabel = "Bali";
  const breadcrumbItems = ["Home", "Search", "Indonesia", "Bali"];

  const filteredAndSortedPackages = useMemo(() => {
    let results = [...MOCK_PACKAGES];

    if (selectedDurations.length) {
      results = results.filter((pkg) =>
        selectedDurations.includes(getDurationBucket(pkg.duration)),
      );
    }

    if (selectedProviders.length) {
      results = results.filter((pkg) => selectedProviders.includes(pkg.provider));
    }

    results = results.filter((pkg) => matchesRatingFilter(pkg.rating, selectedRatings));

    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "top-rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "duration":
        results.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      case "recommended":
      default:
        break;
    }

    return results;
  }, [selectedDurations, selectedProviders, selectedRatings, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPackages.length / ITEMS_PER_PAGE));

  const visiblePackages = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSortedPackages.slice(start, end);
  }, [filteredAndSortedPackages, page]);

  const handleDurationToggle = (value: string) => {
    setPage(1);
    setSelectedDurations((prev) => toggleArrayValue(prev, value));
  };

  const handleProviderToggle = (value: string) => {
    setPage(1);
    setSelectedProviders((prev) => toggleArrayValue(prev, value));
  };

  const handleRatingToggle = (value: string) => {
    setPage(1);
    setSelectedRatings((prev) => toggleArrayValue(prev, value));
  };

  const handleSortChange = (value: ExploreSortValue) => {
    setPage(1);
    setSortBy(value);
  };

  const safePage = Math.min(page, totalPages);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ExploreSearchBar />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ExploreBreadcrumbs items={breadcrumbItems} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ExploreFiltersSidebar
            selectedDurations={selectedDurations}
            onDurationToggle={handleDurationToggle}
            selectedProviders={selectedProviders}
            onProviderToggle={handleProviderToggle}
            selectedRatings={selectedRatings}
            onRatingToggle={handleRatingToggle}
          />

          <section className="min-w-0">
            <ExploreResultsHeader
              totalResults={filteredAndSortedPackages.length}
              queryLabel={queryLabel}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />

            <div className="mt-6">
              <ExplorePackagesGrid packages={visiblePackages} />
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              variant="full"
              className="mt-8"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
