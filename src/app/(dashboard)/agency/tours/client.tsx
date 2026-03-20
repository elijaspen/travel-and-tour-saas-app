"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, Plus } from "lucide-react";

import { ROUTE_PATHS } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ListPageToolbar } from "@/components/shared/list-page-toolbar";
import { PageSectionHeader } from "@/components/shared/page-section-header";
import { Pagination } from "@/components/shared/pagination";
import { ToursTable, type TourRow } from "./components/tours-table";

// TODO: Replace with actual tour data
const tourData: TourRow[] = [
  {
    id: 1,
    title: "Himalayan Adventure Trek",
    location: "Nepal",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160",
    duration: 7,
    categories: ["Adventure", "Hiking", "Mountains"],
    currency: "PHP",
    basePrice: 2499,
    isActive: true,
  },
  {
    id: 2,
    title: "Tokyo Cultural Experience",
    location: "Tokyo, Japan",
    thumbnail:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=160&h=160",
    duration: 5,
    categories: ["Cultural", "City", "Food"],
    currency: "PHP",
    basePrice: 1799,
    isActive: true,
  },
  {
    id: 3,
    title: "Bali Beach Retreat",
    location: "Bali, Indonesia",
    thumbnail:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=160&h=160",
    duration: 4,
    categories: ["Relaxation", "Beach", "Wellness"],
    currency: "PHP",
    basePrice: 1299,
    isActive: false,
  },
  {
    id: 4,
    title: "Patagonia Wildlife Expedition",
    location: "Patagonia, Argentina",
    thumbnail:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=160&h=160",
    duration: 10,
    categories: ["Adventure", "Wildlife", "Photography"],
    currency: "PHP",
    basePrice: 3299,
    isActive: true,
  },
  {
    id: 5,
    title: "Tuscany Wine & Food Tour",
    location: "Tuscany, Italy",
    thumbnail:
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=160&h=160",
    duration: 6,
    categories: ["Cultural", "Wine", "Culinary"],
    currency: "PHP",
    basePrice: 2199,
    isActive: true,
  },
  {
    id: 6,
    title: "Maldives Luxury Escape",
    location: "Maldives",
    thumbnail:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=160&h=160",
    duration: 5,
    categories: ["Relaxation", "Luxury", "Beach"],
    currency: "PHP",
    basePrice: 3899,
    isActive: true,
  },
  {
    id: 7,
    title: "Moroccan Desert Safari",
    location: "Marrakech, Morocco",
    thumbnail:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=160&h=160",
    duration: 8,
    categories: ["Adventure", "Desert", "Camping"],
    currency: "PHP",
    basePrice: 1899,
    isActive: false,
  },
  {
    id: 8,
    title: "Greek Island Hopping",
    location: "Santorini, Greece",
    thumbnail:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=160&h=160",
    duration: 7,
    categories: ["Relaxation", "Island", "Sailing"],
    currency: "PHP",
    basePrice: 2599,
    isActive: true,
  },
];

const TOTAL_PAGES = 10;

export function ToursClient() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <PageSectionHeader
        breadcrumb="Agency / Tours"
        title="Tours Inventory"
      />

      <ListPageToolbar
        primaryAction={
          <Button asChild>
            <Link href={ROUTE_PATHS.AUTHED.AGENCY.TOUR_CREATE} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Tour
            </Link>
          </Button>
        }
      >
        <SearchInput
          placeholder="Search tour titles..."
          className="w-[280px]"
        />
        <Button
          variant="outline"
          className="w-[160px] justify-between h-10 text-muted-foreground font-normal"
        >
          Status
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="w-[180px] justify-between h-10 text-muted-foreground font-normal"
        >
          Tour Type
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </ListPageToolbar>

      <ToursTable
        tours={tourData}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <Pagination
        page={page}
        totalPages={TOTAL_PAGES}
        onPageChange={setPage}
        variant="full"
      />
    </div>
  );
}
