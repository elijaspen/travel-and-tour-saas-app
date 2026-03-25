"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ROUTE_PATHS } from "@/config/routes";
import { toggleTourActiveAction } from "@/features/tours/tour.actions";
import type { TourListItem } from "@/features/tours/tour.types";
import { cn } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/geo/currencies";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=160&h=160&fit=crop";

function scheduleLabel(tourType: TourListItem["tour_type"]) {
  if (tourType === "on_demand") return "On demand";
  if (tourType === "fixed_schedule") return "Fixed schedule";
  return "—";
}

function displayPrice(row: TourListItem) {
  const rows = row.tour_prices ?? [];
  if (rows.length === 0) return null;
  const cheapest = [...rows].sort((a, b) => a.amount - b.amount)[0];
  return {
    currency: cheapest.currency,
    value: Math.round(cheapest.amount / 100),
  };
}

const columns: DataTableColumn<TourListItem>[] = [
  {
    id: "thumbnail",
    header: "Thumbnail",
    width: "100px",
    cell: (row) => {
      const photos = [...(row.tour_photos ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      const src = photos[0]?.file_url ?? FALLBACK_IMAGE;
      return (
        <Image
          src={src}
          alt={row.title}
          width={80}
          height={80}
          className="h-20 w-20 rounded-lg object-cover"
        />
      );
    },
  },
  {
    id: "details",
    header: "Tour Details",
    flex: true,
    cellClassName: "whitespace-normal",
    cell: (row) => (
      <div>
        <div className="mb-1 text-[15px] font-semibold">{row.title}</div>
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>
            {[row.city, row.province_state, row.country_code].filter(Boolean).join(", ") ||
              "—"}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    width: "120px",
    cell: (row) => (
      <span className="text-[14px] font-medium">
        {row.duration_days != null ? `${row.duration_days} Days` : "—"}
      </span>
    ),
  },
  {
    id: "categories",
    header: "Categories",
    width: "200px",
    cellClassName: "whitespace-normal",
    cell: (row) => {
      const names = (row.tour_categories ?? [])
        .map((x) => x.categories?.name)
        .filter((n): n is string => Boolean(n));
      if (names.length === 0) {
        return <span className="text-[14px] text-muted-foreground">—</span>;
      }
      return (
        <div className="flex flex-wrap gap-1.5">
          {names.map((name, i) => (
            <Badge
              key={`${row.id}-${i}`}
              variant="outline"
              className={cn(
                "h-auto max-w-full rounded-full border-primary/20 bg-primary/5 px-2.5 py-0.5 font-medium shadow-none",
                "text-foreground/90 normal-case tracking-tight",
                "dark:border-primary/35 dark:bg-primary/15 dark:text-foreground"
              )}
            >
              {name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "price",
    header: "Base Price",
    width: "140px",
    cell: (row) => {
      const price = displayPrice(row);
      if (!price) {
        return <span className="text-[15px] font-medium text-muted-foreground">—</span>;
      }
      return (
        <div>
          <div className="text-[12px] text-muted-foreground">from</div>
          <div className="text-[15px] font-semibold tabular-nums">
            {getCurrencySymbol(price.currency)}
            {price.value.toLocaleString()}
          </div>
        </div>
      );
    },
  },
  {
    id: "schedule",
    header: "Schedule",
    width: "140px",
    cell: (row) => (
      <span className="text-[14px] font-medium">{scheduleLabel(row.tour_type)}</span>
    ),
  },
  {
    id: "published",
    header: "Published",
    width: "120px",
    cell: (row) => <TourActiveToggle tourId={row.id} isActive={row.is_active} />,
  },
  {
    id: "actions",
    header: "Actions",
    width: "120px",
    cell: (row) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={ROUTE_PATHS.AUTHED.AGENCY.TOUR_EDIT(row.id)}>Manage</Link>
      </Button>
    ),
  },
];

function TourActiveToggle({ tourId, isActive }: { tourId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleTourActiveAction(tourId);
      if (!result.success) {
        toast.error(result.message ?? "Could not update tour status.");
      }
    });
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={isPending}
      aria-label={isActive ? "Deactivate tour" : "Activate tour"}
    />
  );
}

type Props = {
  tours: TourListItem[];
  selectedIds: Set<string | number>;
  onSelectionChange: (ids: Set<string | number>) => void;
};

export function ToursTable({ tours, selectedIds, onSelectionChange }: Props) {
  return (
    <DataTable<TourListItem>
      columns={columns}
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
