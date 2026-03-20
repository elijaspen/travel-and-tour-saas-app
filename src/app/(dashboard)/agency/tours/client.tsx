"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ChevronDown, Plus } from "lucide-react";

import { ROUTE_PATHS } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { PageSectionHeader } from "@/components/shared/page-section-header";
import { ListPageToolbar } from "@/components/shared/list-page-toolbar";
import { Pagination } from "@/components/shared/pagination";
import type { TourListItem } from "@/features/tours/tour.types";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { ToursTable } from "./components/tours-table";
import { agencyToursPath } from "./urls";

type Props = {
  tours: TourListItem[];
  page: number;
  totalPages: number;
  search: string;
};

export function ToursClient({ tours, page, totalPages, search }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [searchDraft, setSearchDraft] = useState(search);

  const scheduleUrlSearchUpdate = useDebouncedCallback(
    useCallback(
      (draft: string) => {
        const next = draft.trim();
        if (next === search.trim()) return;
        router.push(agencyToursPath(next, 1));
      },
      [router, search]
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
        <Button
          variant="outline"
          className="h-10 w-[160px] justify-between font-normal text-muted-foreground"
        >
          Status
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-10 w-[180px] justify-between font-normal text-muted-foreground"
        >
          Tour Type
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
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
          router.push(agencyToursPath(searchDraft.trim(), nextPage))
        }
        variant="full"
      />
    </div>
  );
}
