"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";
import { CalendarIcon, MapPin, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ExploreSearchBarProps {
  className?: string;
}

export function ExploreSearchBar({ className }: ExploreSearchBarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 9, 19),
  });

  return (
    <form className={cn("flex flex-col gap-4 lg:flex-row lg:items-center", className)}>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:flex-row">
        <SearchField
          icon={<MapPin className="h-4 w-4 text-slate-400" />}
          label="Location"
          name="destination"
          defaultValue="Bali, Indonesia"
        />

        <Divider />

        <DateRangeField
          icon={<CalendarIcon className="h-4 w-4 text-slate-400" />}
          label="Dates"
          placeholder="Add dates"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <Divider />

        <SearchField
          icon={<Users className="h-4 w-4 text-slate-400" />}
          label="Guests"
          name="guests"
          defaultValue="2 Adults, 1 Room"
        />
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
    <div className="flex flex-1 items-center gap-3 px-4 py-3">
      <div className="shrink-0">{icon}</div>

      <div className="flex flex-1 flex-col text-left">
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
    <div className="flex flex-1 items-center gap-3 px-4 py-3">
      <div className="shrink-0">{icon}</div>

      <div className="flex flex-1 flex-col text-left">
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
  return <div className="mx-4 h-px bg-slate-200 lg:mx-0 lg:my-3 lg:h-auto lg:w-px" />;
}
