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
import {
  agencyToursPath,
  type AgencyToursListQuery,
  type AgencyToursPublication,
  type AgencyToursSort,
  type AgencyToursTourTypeFilter,
} from "@/features/tours/agency-tours-url";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/utils";
import { ToursTable } from "./components/tours-table";

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
  search: string;
  publication: AgencyToursPublication;
  tourType: AgencyToursTourTypeFilter;
  sort: AgencyToursSort;
};

export function ToursClient({
  tours,
  page,
  totalPages,
  search,
  publication,
  tourType,
  sort,
}: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [searchDraft, setSearchDraft] = useState(search);

  const listQuery = useCallback(
    (overrides: Partial<AgencyToursListQuery>): AgencyToursListQuery => ({
      search: searchDraft.trim(),
      page,
      publication,
      tourType,
      sort,
      ...overrides,
    }),
    [searchDraft, page, publication, tourType, sort]
  );

  const scheduleUrlSearchUpdate = useDebouncedCallback(
    useCallback(
      (draft: string) => {
        const next = draft.trim();
        if (next === search.trim()) return;
        router.push(
          agencyToursPath({
            search: next,
            page: 1,
            publication,
            tourType,
            sort,
          })
        );
      },
      [router, search, publication, tourType, sort]
    ),
    300
  );

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
          onChange={(e) => {
            const v = e.target.value;
            setSearchDraft(v);
            scheduleUrlSearchUpdate(v);
          }}
        />
        <select
          className={cn(selectClass, "w-[200px]")}
          aria-label="Filter by publication"
          value={publication}
          onChange={(e) => {
            const v = e.target.value as AgencyToursPublication;
            router.push(agencyToursPath(listQuery({ publication: v, page: 1 })));
          }}
        >
          <option value="all">All tours</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <select
          className={cn(selectClass, "w-[200px]")}
          aria-label="Filter by schedule type"
          value={tourType}
          onChange={(e) => {
            const v = e.target.value as AgencyToursTourTypeFilter;
            router.push(agencyToursPath(listQuery({ tourType: v, page: 1 })));
          }}
        >
          <option value="all">All schedule types</option>
          <option value="on_demand">On demand</option>
          <option value="fixed_schedule">Fixed schedule</option>
        </select>
        <select
          className={cn(selectClass, "min-w-[220px] max-w-[260px]")}
          aria-label="Sort tours"
          value={sort}
          onChange={(e) => {
            const v = e.target.value as AgencyToursSort;
            router.push(agencyToursPath(listQuery({ sort: v, page: 1 })));
          }}
        >
          <option value="created_desc">Newest first</option>
          <option value="created_asc">Oldest first</option>
          <option value="title_asc">Title A–Z</option>
          <option value="title_desc">Title Z–A</option>
          <option value="duration_asc">Duration (short to long)</option>
          <option value="duration_desc">Duration (long to short)</option>
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
        onPageChange={(nextPage) =>
          router.push(agencyToursPath(listQuery({ page: nextPage })))
        }
        variant="full"
      />
    </div>
  );
}
