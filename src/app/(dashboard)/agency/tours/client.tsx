"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { ROUTE_PATHS } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { PageSectionHeader } from "@/components/shared/page-section-header";
import { ListPageToolbar } from "@/components/shared/list-page-toolbar";
import { Pagination } from "@/components/shared/pagination";
import type { TourListItem } from "@/features/tours/tour.types";
import { agencyToursConfig } from "@/features/tours/agency-tours-config";
import { buildListUrl, type ListParams } from "@/features/shared/list-params";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/utils";
import { ToursTable } from "./components/tours-table";

const BASE_PATH = ROUTE_PATHS.AUTHED.AGENCY.TOURS;

const selectClass = cn(
  "border-input bg-background h-10 rounded-md border px-3 text-sm",
  "text-foreground shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

type Props = {
  tours: TourListItem[];
  page: number;
  totalPages: number;
  listParams: ListParams;
};

export function ToursClient({ tours, page, totalPages, listParams }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [searchDraft, setSearchDraft] = useState(listParams.search);

  const navigate = useCallback(
    (overrides: Partial<ListParams>) => {
      router.push(
        buildListUrl(BASE_PATH, agencyToursConfig, { ...listParams, ...overrides }),
      );
    },
    [router, listParams],
  );

  const scheduleUrlSearchUpdate = useDebouncedCallback(
    useCallback(
      (draft: string) => {
        const next = draft.trim();
        if (next === listParams.search) return;
        navigate({ search: next, page: 1 });
      },
      [listParams.search, navigate],
    ),
    300,
  );

  const [publicationFilter, tourTypeFilter] = agencyToursConfig.filters;

  return (
    <div className="flex flex-col gap-4">
      <PageSectionHeader
        back={{ href: ROUTE_PATHS.AUTHED.AGENCY.ROOT, label: "Agency" }}
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
          placeholder="Search title or city…"
          className="w-[280px]"
          value={searchDraft}
          onChange={(event) => {
            const value = event.target.value;
            setSearchDraft(value);
            scheduleUrlSearchUpdate(value);
          }}
        />
        <select
          className={cn(selectClass, "w-[200px]")}
          aria-label={publicationFilter.label}
          value={listParams.filters[publicationFilter.paramKey]}
          onChange={(e) =>
            navigate({
              filters: { ...listParams.filters, [publicationFilter.paramKey]: e.target.value },
              page: 1,
            })
          }
        >
          {publicationFilter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className={cn(selectClass, "w-[200px]")}
          aria-label={tourTypeFilter.label}
          value={listParams.filters[tourTypeFilter.paramKey]}
          onChange={(e) =>
            navigate({
              filters: { ...listParams.filters, [tourTypeFilter.paramKey]: e.target.value },
              page: 1,
            })
          }
        >
          {tourTypeFilter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className={cn(selectClass, "min-w-[220px] max-w-[260px]")}
          aria-label="Sort tours"
          value={listParams.sort}
          onChange={(e) => navigate({ sort: e.target.value, page: 1 })}
        >
          {agencyToursConfig.sorts.map((sortOption) => (
            <option key={sortOption.value} value={sortOption.value}>
              {sortOption.label}
            </option>
          ))}
        </select>
      </ListPageToolbar>

      <ToursTable
        tours={tours}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => navigate({ page: nextPage })}
        variant="full"
      />
    </div>
  );
}
