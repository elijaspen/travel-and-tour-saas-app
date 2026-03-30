"use client";

import { useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";
import { CalendarIcon, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  UnifiedTourExploreSearch,
  UnifiedTourExploreSearchVariant,
} from "@/components/shared/unified-tour-explore-search";
import {
  ExploreSearchBarCopy,
  UnifiedSelectionKind,
} from "@/features/tours/utils/explore-search.constants";
import {
  explorePathWithQuery,
  selectionToExploreQuery,
} from "@/features/tours/utils/explore-search-params";
import { ROUTE_PATHS } from "@/config/routes";
import { cn } from "@/lib/utils";

interface ExploreSearchBarProps {
  className?: string;
  /** When false, hides the date range field. @default true */
  withDates?: boolean;
  /** When false, hides the guests field. @default true */
  withGuests?: boolean;
  /** Initial text for the destination / keyword field (e.g. from `?q=`). */
  defaultSearchValue?: string;
}

export function ExploreSearchBar({
  className,
  withDates = true,
  withGuests = true,
  defaultSearchValue = "",
}: ExploreSearchBarProps) {
  const router = useRouter();
  const searchKeywordRef = useRef("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() =>
    withDates
      ? { from: new Date(2026, 9, 12), to: new Date(2026, 9, 19) }
      : undefined,
  );

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
      className={cn("flex flex-col gap-4 lg:flex-row lg:items-center", className)}
      onSubmit={handleSubmit}
    >
      <div className="flex min-w-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
          <UnifiedTourExploreSearch
            label={ExploreSearchBarCopy.locationLabel}
            placeholder={ExploreSearchBarCopy.destinationPlaceholder}
            variant={UnifiedTourExploreSearchVariant.COMPACT}
            defaultValue={defaultSearchValue}
            onQueryChange={(q) => {
              searchKeywordRef.current = q;
            }}
          />
        </div>

        {withDates ? (
          <>
            <Divider />
            <DateRangeField
              icon={<CalendarIcon className="h-4 w-4 text-slate-400" />}
              label="Dates"
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
              icon={<Users className="h-4 w-4 text-slate-400" />}
              label="Guests"
              name="guests"
              defaultValue="2 Adults, 1 Room"
            />
          </>
        ) : null}
      </div>

      <Button
        type="submit"
        className="h-14 w-32 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-900"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}

interface SearchFieldProps {
  icon: ReactNode;
  label: string;
  name: string;
  defaultValue: string;
}

function SearchField({ icon, label, name, defaultValue }: SearchFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
      <div className="shrink-0">{icon}</div>

      <div className="flex min-w-0 flex-1 flex-col text-left">
        <label
          htmlFor={name}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500"
        >
          {label}
        </label>

        <Input
          id={name}
          name={name}
          defaultValue={defaultValue}
          className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}

interface DateRangeFieldProps {
  icon: ReactNode;
  label: string;
  placeholder: string;
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

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

    return `${dayjs(dateRange.from).format("MMM D")} - ${dayjs(dateRange.to).format("MMM D")}`;
  }, [dateRange, placeholder]);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
      <div className="shrink-0">{icon}</div>

      <div className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
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
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
    <div className="mx-4 h-px shrink-0 bg-slate-200 lg:mx-0 lg:my-3 lg:h-auto lg:w-px" />
  );
}
