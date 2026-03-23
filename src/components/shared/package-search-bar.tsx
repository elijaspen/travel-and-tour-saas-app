"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";

import { MapPin, CalendarIcon, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

type PackageSearchBarProps = {
  className?: string;
};

export function PackageSearchBar({ className }: PackageSearchBarProps) {
  const [dateRange, setDateRange] =
    useState<DateRange | undefined>();

  return (
    <form
      className={cn(
        "mx-auto w-full max-w-6xl rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white lg:flex-row">

          <SearchField
            icon={<MapPin className="h-5 w-5 text-slate-400" />}
            label="WHERE TO?"
            name="destination"
            placeholder="Search destinations"
          />

          <Divider />

          <DateRangeField
            icon={<CalendarIcon className="h-5 w-5 text-slate-400" />}
            label="DATE"
            placeholder="Add dates"
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <Divider />

          <SearchField
            icon={<Users className="h-5 w-5 text-slate-400" />}
            label="GUESTS"
            name="guests"
            placeholder="Add guests"
          />
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
    <div className="flex flex-1 items-center gap-4 px-5 py-4">
      <div className="shrink-0">{icon}</div>

      <div className="flex flex-1 flex-col text-left">
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
    <div className="flex flex-1 items-center gap-4 px-5 py-4">
      <div className="shrink-0">{icon}</div>

      <div className="flex flex-1 flex-col text-left">
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
    <div className="mx-2 h-px bg-slate-200 lg:mx-0 lg:my-4 lg:h-auto lg:w-px" />
  );
}