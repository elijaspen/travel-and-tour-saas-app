"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/geo/currencies";


// TODO: Replace with actual tour data
export type TourRow = {
  id: number;
  title: string;
  location: string;
  thumbnail: string;
  duration: number;
  categories: string[];
  currency: string;
  basePrice: number;
  isActive: boolean;
};

// TODO: Replace with actual tour columns
const TOURS_COLUMNS: DataTableColumn<TourRow>[] = [
  {
    id: "thumbnail",
    header: "Thumbnail",
    width: "100px",
    cell: (tour) => (
      <Image
        src={tour.thumbnail}
        alt={tour.title}
        width={80}
        height={80}
        className="h-20 w-20 rounded-lg object-cover"
      />
    ),
  },
  {
    id: "details",
    header: "Tour Details",
    flex: true,
    cellClassName: "whitespace-normal",
    cell: (tour) => (
      <div>
        <div className="text-[15px] font-semibold mb-1">{tour.title}</div>
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{tour.location}</span>
        </div>
      </div>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    width: "120px",
    cell: (tour) => (
      <span className="text-[14px] font-medium">{tour.duration} Days</span>
    ),
  },
  {
    id: "categories",
    header: "Categories",
    width: "200px",
    cellClassName: "whitespace-normal",
    cell: (tour) => (
      <div className="flex flex-wrap gap-1.5">
        {tour.categories.map((label, index) => (
          <Badge
            key={`${tour.id}-${index}`}
            variant="outline"
            className={cn(
              "h-auto max-w-full rounded-full border-primary/20 bg-primary/5 px-2.5 py-0.5 font-medium shadow-none",
              "text-foreground/90 normal-case tracking-tight",
              "dark:border-primary/35 dark:bg-primary/15 dark:text-foreground"
            )}
          >
            {label}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "price",
    header: "Base Price",
    width: "140px",
    cell: (tour) => {
      const symbol = getCurrencySymbol(tour.currency);
      return (
        <div>
          <div className="text-[12px] text-muted-foreground">from</div>
          <div className="text-[15px] font-semibold tabular-nums">
            {symbol}
            {tour.basePrice.toLocaleString()}
          </div>
        </div>
      );
    },
  },
  {
    id: "published",
    header: "Published",
    width: "120px",
    cell: (tour) => (
      <div
        className={cn(
          "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          tour.isActive ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            tour.isActive ? "translate-x-6" : "translate-x-0.5"
          )}
        />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    width: "120px",
    cell: () => (
      <Button variant="outline" size="sm" asChild>
        <Link href="#">Manage</Link>
      </Button>
    ),
  },
];

type ToursTableProps = {
  tours: TourRow[];
  selectedIds: Set<string | number>;
  onSelectionChange: (selectedIds: Set<string | number>) => void;
};

export function ToursTable({
  tours,
  selectedIds,
  onSelectionChange,
}: ToursTableProps) {
  return (
    <DataTable<TourRow>
      columns={TOURS_COLUMNS}
      data={tours}
      getRowId={(row) => row.id}
      density="relaxed"
      layout="flex"
      selectable="all"
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
    />
  );
}
