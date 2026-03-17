import { MapPin, Calendar, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PackageSearchBarProps = {
  destinationPlaceholder?: string;
  datePlaceholder?: string;
  searchLabel?: string;
  className?: string;
};

export function PackageSearchBar({
  destinationPlaceholder = "Where do you want to go?",
  datePlaceholder = "When are you traveling?",
  searchLabel = "Search Packages",
  className,
}: PackageSearchBarProps) {
  return (
    <form
      className={["mx-auto max-w-3xl rounded-2xl bg-white p-3 shadow-2xl sm:p-4", className].filter(Boolean).join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-brand" />
          <Input
            name="destination"
            placeholder={destinationPlaceholder}
            className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-brand" />
          <Input
            name="travelDate"
            placeholder={datePlaceholder}
            className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          type="submit"
          className="shrink-0 gap-2 bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
          size="lg"
        >
          <Search className="h-4 w-4" />
          {searchLabel}
        </Button>
      </div>
    </form>
  );
}
