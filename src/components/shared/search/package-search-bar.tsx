"use client";

import { useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";

import { CalendarIcon, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  UnifiedTourExploreSearch,
  UnifiedTourExploreSearchVariant,
} from "@/components/shared/search/unified-tour-explore-search";
import {
  PackageSearchBarCopy,
  UnifiedSelectionKind,
} from "@/features/tours/utils/explore-search.constants";
import {
  explorePathWithQuery,
  selectionToExploreQuery,
} from "@/features/tours/utils/explore-search-params";
import { ROUTE_PATHS } from "@/config/routes";
import { cn } from "@/lib/utils";

type PackageSearchBarProps = {
  className?: string;
  /** When false, hides the date range field. @default true */
  withDates?: boolean;
  /** When false, hides the guests field. @default true */
  withGuests?: boolean;
};

export function PackageSearchBar({
  className,
  withDates = true,
  withGuests = true,
}: PackageSearchBarProps) {
  const router = useRouter();
  const searchKeywordRef = useRef("");
  const [dateRange, setDateRange] =
    useState<DateRange | undefined>();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const path = explorePathWithQuery(
      ROUTE_PATHS.PUBLIC.MARKETING.EXPLORE,
      selectionToExploreQuery({
        kind: UnifiedSelectionKind.KEYWORD,
        q: searchKeywordRef.current,
      }),
    );
    router.push(path);
  }

  return (
    <form
      className={cn(
        "mx-auto w-full max-w-6xl rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 w-full flex-1 flex-col overflow-hidden rounded-xl bg-white lg:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-4 px-5 py-4">
            <UnifiedTourExploreSearch
              label={PackageSearchBarCopy.whereToLabel}
              placeholder={PackageSearchBarCopy.destinationPlaceholder}
              variant={UnifiedTourExploreSearchVariant.HERO}
              onQueryChange={(q) => {
                searchKeywordRef.current = q;
              }}
            />
          </div>

          {withDates ? (
            <>
              <Divider />
              <DateRangeField
                icon={<CalendarIcon className="h-5 w-5 text-slate-400" />}
                label="DATE"
                placeholder="Add dates"
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </>
          ) : null}

          {withGuests ? (
            <>
              <Divider />
              <SearchField
                icon={<Users className="h-5 w-5 text-slate-400" />}
                label="GUESTS"
                name="guests"
                placeholder="Add guests"
              />
            </>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-16 min-w-[170px] rounded-xl bg-slate-950 px-8 text-base font-semibold text-white hover:bg-slate-900"
        >
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  );
}

type SearchFieldProps = {
  icon: ReactNode;
  label: string;
  name: string;
  placeholder: string;
};

function SearchField({
  icon,
  label,
  name,
  placeholder,
}: SearchFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4 px-5 py-4">
      <div className="shrink-0">{icon}</div>

      <div className="flex min-w-0 flex-1 flex-col text-left">
        <label
          htmlFor={name}
          className="text-xs font-bold uppercase tracking-[0.08em] text-slate-900"
        >
          {label}
        </label>

        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          className="h-auto border-0 bg-transparent p-0 text-lg font-medium text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}

type DateRangeFieldProps = {
  icon: ReactNode;
  label: string;
  placeholder: string;
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
};

function DateRangeField({
  icon,
  label,
  placeholder,
  dateRange,
  onDateRangeChange,
}: DateRangeFieldProps) {

  const displayValue = useMemo(() => {
    if (!dateRange?.from) return placeholder;

    if (dateRange.from && !dateRange.to) {
      return dayjs(dateRange.from).format("MMM D, YYYY");
    }

    return `${dayjs(dateRange.from).format("MMM D")} - ${dayjs(
      dateRange.to,
    ).format("MMM D, YYYY")}`;
  }, [dateRange, placeholder]);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-4 px-5 py-4">
      <div className="shrink-0">{icon}</div>

      <div className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-900">
          {label}
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "h-auto justify-start p-0 text-left text-sm font-medium text-slate-900 hover:bg-transparent",
                !dateRange?.from && "text-slate-400",
              )}
            >
              {displayValue}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-2 h-px shrink-0 bg-slate-200 lg:mx-0 lg:my-4 lg:h-auto lg:w-px" />
  );
}