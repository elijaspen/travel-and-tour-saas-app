"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SelectOption<T = string> = {
  value: T;
  label: string;
};

type SelectProps<T = string> = {
  value?: T;
  onValueChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  /** Filter options with a search field (popover list). */
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function Select<T extends string>({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled,
  className,
  triggerClassName,
  searchable = false,
  searchPlaceholder = "Search...",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q),
    );
  }, [options, query, searchable]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-11 w-full min-w-0 justify-between gap-2 font-normal",
            !value && "text-muted-foreground",
            triggerClassName
          )}
        >
          <span className="truncate text-left" title={selected?.label}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0",
          searchable
            ? "w-[var(--radix-popover-trigger-width)] min-w-[min(100%,280px)] max-w-[min(100vw-2rem,24rem)]"
            : "w-[var(--radix-popover-trigger-width)]",
          className,
        )}
        align="start"
      >
        {searchable && (
          <div className="border-b border-border p-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9"
              autoComplete="off"
              aria-label="Search options"
            />
          </div>
        )}
        <div className="max-h-60 overflow-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No matches
            </p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={cn(
                  "relative flex w-full min-w-0 cursor-default select-none items-center rounded-sm px-2 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === opt.value && "bg-accent"
                )}
                title={opt.label}
                onClick={() => {
                  onValueChange?.(opt.value);
                  setOpen(false);
                }}
              >
                <span className="line-clamp-2 break-words">{opt.label}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
