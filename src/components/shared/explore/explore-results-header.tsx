"use client";

import { Select, type SelectOption } from "@/components/ui/select";

export type ExploreSortValue =
  | "recommended"
  | "price-low"
  | "price-high"
  | "top-rated"
  | "duration";

const SORT_OPTIONS: SelectOption<ExploreSortValue>[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "top-rated", label: "Top Rated" },
  { value: "duration", label: "Shortest Duration" },
];

interface ExploreResultsHeaderProps {
  totalResults: number;
  queryLabel: string;
  sortBy: ExploreSortValue;
  onSortChange: (value: ExploreSortValue) => void;
}

export function ExploreResultsHeader({
  totalResults,
  queryLabel,
  sortBy,
  onSortChange,
}: ExploreResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold text-slate-900">
          {totalResults} results found for “{queryLabel}”
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Sort by:</span>

        <div className="w-[190px]">
          <Select
            value={sortBy}
            onValueChange={onSortChange}
            options={SORT_OPTIONS}
            placeholder="Recommended"
            triggerClassName="h-10 rounded-xl border-slate-200 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
