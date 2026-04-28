"use client";

import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface ExploreFiltersSidebarProps {
  selectedDurations: string[];
  onDurationToggle: (value: string) => void;
  selectedProviders: string[];
  onProviderToggle: (value: string) => void;
  selectedRatings: string[];
  onRatingToggle: (value: string) => void;
}

const DURATION_OPTIONS = [
  { label: "Up to 3 Days", value: "up-to-3-days", count: "42" },
  { label: "4 - 7 Days", value: "4-to-7-days", count: "68" },
  { label: "8 - 14 Days", value: "8-to-14-days", count: "24" },
  { label: "15+ Days", value: "15-plus-days", count: "8" },
];

const PROVIDER_OPTIONS = [
  { label: "Bali Local Guides", value: "Bali Local Guides" },
  { label: "Global Trek", value: "Global Trek" },
  { label: "Wanderlust Inc", value: "Wanderlust Inc" },
  { label: "Bali Sun Tours", value: "Bali Sun Tours" },
  { label: "Ocean Blue Travel", value: "Ocean Blue Travel" },
  { label: "Zen Travels", value: "Zen Travels" },
  { label: "Island Hoppers", value: "Island Hoppers" },
];

const RATING_OPTIONS = [
  { label: "★★★★★ & up", value: "5-up" },
  { label: "★★★★☆ & up", value: "4-up" },
  { label: "★★★☆☆ & up", value: "3-up" },
];

export function ExploreFiltersSidebar({
  selectedDurations,
  onDurationToggle,
  selectedProviders,
  onProviderToggle,
  selectedRatings,
  onRatingToggle,
}: ExploreFiltersSidebarProps) {
  return (
    <aside className="space-y-8">
      <FilterSection title="Price Range">
        <div className="space-y-4">
          <div className="h-2 rounded-full bg-slate-200" />
          <div className="grid grid-cols-2 gap-3">
            <Input defaultValue="$ 50" />
            <Input defaultValue="$ 5000" />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Duration">
        {DURATION_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            count={option.count}
            checked={selectedDurations.includes(option.value)}
            onCheckedChange={() => onDurationToggle(option.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Tour Type">
        <FilterOption label="Adventure" count="85" />
        <FilterOption label="Cultural" count="54" />
        <FilterOption label="Relaxation" count="32" />
        <FilterOption label="Family Friendly" count="47" />
        <FilterOption label="Wildlife" count="18" />
        <FilterOption label="Food & Culinary" count="29" />
      </FilterSection>

      <FilterSection title="Rating">
        {RATING_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            checked={selectedRatings.includes(option.value)}
            onCheckedChange={() => onRatingToggle(option.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Provider">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search agency..." />
        </div>

        {PROVIDER_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            checked={selectedProviders.includes(option.value)}
            onCheckedChange={() => onProviderToggle(option.value)}
          />
        ))}
      </FilterSection>
    </aside>
  );
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

interface FilterOptionProps {
  label: string;
  count?: string;
  checked?: boolean;
  onCheckedChange?: () => void;
}

function FilterOption({ label, count, checked, onCheckedChange }: FilterOptionProps) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-700">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <span className="flex-1">{label}</span>
      {count ? <span className="text-xs text-slate-400">({count})</span> : null}
    </label>
  );
}
