"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { MapPin, Ticket, Search, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  forwardGeocodePlaces,
  featureToExploreBbox,
  featureCountryOrRegion,
  type MapboxGeocodingFeature,
} from "@/lib/geo/mapbox-geocoding";
import {
  selectionToExploreQuery,
  explorePathWithQuery,
  type UnifiedSearchSelection,
} from "@/modules/tours/utils/explore-search-params";
import {
  ExploreSearchLimits,
  ExploreSearchUiCopy,
  formatTourSuggestionSubLabel,
  SuggestionSectionKind,
  UnifiedSelectionKind,
  UnifiedTourExploreSearchVariant,
  type UnifiedTourExploreSearchVariantValue,
} from "@/modules/tours/utils/explore-search.constants";
import { searchPublicTourSuggestionsAction } from "@/modules/tours/tour.public-actions";
import type { TourSuggestion } from "@/modules/tours/tour.types";
import { ROUTE_PATHS } from "@/config/routes";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

const CMD_ITEM = {
  seeAll: "unified-search-see-all",
  geo: (id: string) => `geo:${id}`,
  tour: (id: string) => `tour:${id}`,
} as const;

export {
  UnifiedTourExploreSearchVariant,
  type UnifiedTourExploreSearchVariantValue,
};

type Props = {
  className?: string;
  label?: string;
  placeholder?: string;
  variant?: UnifiedTourExploreSearchVariantValue;
  defaultValue?: string;
  /** Sync input text to the parent (e.g. submit the marketing search bar). */
  onQueryChange?: (query: string) => void;
};

type DestinationGroup = {
  kind: typeof SuggestionSectionKind.DESTINATION;
  items: MapboxGeocodingFeature[];
};
type TourGroup = { kind: typeof SuggestionSectionKind.TOUR; items: TourSuggestion[] };
type SuggestionGroup = DestinationGroup | TourGroup;

function ComboboxColumnHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/70">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-xs font-semibold tracking-wide text-foreground uppercase">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

export function UnifiedTourExploreSearch({
  className,
  label,
  placeholder = ExploreSearchUiCopy.defaultPlaceholder,
  variant = UnifiedTourExploreSearchVariant.HERO,
  defaultValue = "",
  onQueryChange,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [groups, setGroups] = useState<SuggestionGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onQueryChangeRef = useRef(onQueryChange);

  useLayoutEffect(() => {
    onQueryChangeRef.current = onQueryChange;
  });

  const isCompact = variant === UnifiedTourExploreSearchVariant.COMPACT;

  function updateQuery(next: string) {
    setQuery(next);
    onQueryChangeRef.current?.(next);
  }

  useLayoutEffect(() => {
    onQueryChangeRef.current?.(defaultValue);
  }, [defaultValue]);

  function navigate(selection: UnifiedSearchSelection) {
    const q = selectionToExploreQuery(selection);
    router.push(explorePathWithQuery(ROUTE_PATHS.PUBLIC.MARKETING.EXPLORE, q));
    setOpen(false);
  }

  function handleSelectDestination(feature: MapboxGeocodingFeature) {
    updateQuery(feature.place_name);
    navigate({
      kind: UnifiedSelectionKind.DESTINATION,
      placeName: feature.place_name,
      bbox: featureToExploreBbox(feature),
    });
  }

  function handleSelectTour(tour: TourSuggestion) {
    updateQuery(tour.title);
    navigate({
      kind: UnifiedSelectionKind.TOUR,
      tourId: tour.id,
      title: tour.title,
    });
  }

  function handleKeywordSubmit() {
    const q = query.trim();
    if (!q) return;
    navigate({ kind: UnifiedSelectionKind.KEYWORD, q });
  }

  function clearQuery() {
    updateQuery("");
    setGroups([]);
    setOpen(false);
  }

  function runSearch(value: string) {
    const q = value.trim();
    if (!q) {
      setGroups([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    setGroups([]);

    Promise.all([
      forwardGeocodePlaces(q, {
        accessToken: MAPBOX_TOKEN,
        limit: ExploreSearchLimits.mapboxSuggestionLimit,
      }),
      searchPublicTourSuggestionsAction(q, ExploreSearchLimits.tourSuggestionComboboxLimit),
    ])
      .then(([places, tours]) => {
        const next: SuggestionGroup[] = [];
        if (places.length)
          next.push({ kind: SuggestionSectionKind.DESTINATION, items: places });
        if (tours.length) next.push({ kind: SuggestionSectionKind.TOUR, items: tours });
        setGroups(next);
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }

  function scheduleSearch(value: string) {
    updateQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), ExploreSearchLimits.debounceMs);
  }

  const hasListContent = groups.length > 0 || loading;
  const showSeeAll = Boolean(query.trim());

  const destItems =
    groups.find((g): g is DestinationGroup => g.kind === SuggestionSectionKind.DESTINATION)?.items ??
    [];
  const tourItems =
    groups.find((g): g is TourGroup => g.kind === SuggestionSectionKind.TOUR)?.items ?? [];
  const comboboxRowCount = Math.max(
    destItems.length,
    tourItems.length,
    destItems.length === 0 && tourItems.length === 0 ? 1 : 0,
  );
  const showResultsPanel = !loading && showSeeAll;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Command
        shouldFilter={false}
        className="h-auto min-w-0 w-full flex-1 overflow-visible bg-transparent"
      >
        <PopoverAnchor asChild>
          <div
            className={cn(
              "relative flex min-w-0 w-full flex-1 flex-col text-left",
              className,
            )}
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button[type='button']")) return;
              inputRef.current?.focus();
            }}
          >
            {label ? (
              <span
                className={cn(
                  "font-bold uppercase tracking-[0.08em]",
                  isCompact ? "text-[11px] text-muted-foreground" : "text-xs text-foreground",
                )}
              >
                {label}
              </span>
            ) : null}

            <div className="relative flex min-w-0 w-full flex-1 items-center pr-6">
              <CommandInput
                ref={inputRef}
                value={query}
                onValueChange={scheduleSearch}
                onFocus={() => {
                  if (hasListContent) setOpen(true);
                }}
                placeholder={placeholder}
                autoComplete="off"
                showSearchIcon={false}
                containerClassName="min-w-0 w-full flex-1 border-0 px-0"
                className={cn(
                  isCompact
                    ? "text-sm font-medium placeholder:text-muted-foreground"
                    : "text-lg font-medium placeholder:text-muted-foreground",
                )}
              />
              {loading ? (
                <Loader2 className="absolute right-0 size-4 shrink-0 animate-spin text-muted-foreground" />
              ) : null}
              {!loading && query ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearQuery();
                  }}
                  className="absolute right-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label={ExploreSearchUiCopy.clearSearchAriaLabel}
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className={cn(
            "border-border bg-popover text-popover-foreground flex h-[400px] max-h-[min(400px,85vh)] w-[560px] max-w-[min(560px,calc(100vw-1.5rem))] flex-col overflow-hidden p-0 shadow-xl",
          )}
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <CommandList className="flex max-h-none min-h-0 flex-1 flex-col overflow-hidden p-0">
            {showResultsPanel ? (
              <>
                <div className="flex min-h-0 flex-1 flex-col" data-slot="combobox-columns">
                  <div className="grid shrink-0 grid-cols-2 divide-x divide-border border-b border-border bg-muted/40">
                    <ComboboxColumnHeader
                      icon={MapPin}
                      title={ExploreSearchUiCopy.sectionDestinations}
                      subtitle={ExploreSearchUiCopy.comboboxColumnDestinationsSubtitle}
                    />
                    <ComboboxColumnHeader
                      icon={Ticket}
                      title={ExploreSearchUiCopy.sectionTours}
                      subtitle={ExploreSearchUiCopy.comboboxColumnToursSubtitle}
                    />
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <CommandGroup className="p-1.5">
                      {Array.from({ length: comboboxRowCount }, (_, row) => {
                        const feature = destItems[row];
                        const tour = tourItems[row];
                        const context = feature ? featureCountryOrRegion(feature) : null;
                        const sub = tour
                          ? formatTourSuggestionSubLabel(tour.city, tour.country_code)
                          : null;

                        return (
                          <div
                            key={`combobox-row-${row}`}
                            className="mb-1.5 grid grid-cols-2 gap-0 divide-x divide-border/70 last:mb-0"
                          >
                            <div className="min-w-0 pr-1.5">
                              {feature ? (
                                <CommandItem
                                  value={CMD_ITEM.geo(feature.id)}
                                  onSelect={() => handleSelectDestination(feature)}
                                  className="cursor-pointer gap-2.5 rounded-md px-2 py-2 data-[selected=true]:bg-accent"
                                >
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/80 text-muted-foreground">
                                    <MapPin className="size-3.5" />
                                  </span>
                                  <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className="text-sm leading-snug font-medium text-foreground">
                                      {feature.place_name.split(",")[0]}
                                    </span>
                                    {context ? (
                                      <span className="text-xs leading-snug text-muted-foreground">
                                        {context}
                                      </span>
                                    ) : null}
                                  </span>
                                </CommandItem>
                              ) : (
                                <div
                                  className={cn(
                                    "flex min-h-[2.75rem] items-center rounded-md px-2 py-1.5 text-center text-xs text-muted-foreground",
                                    row === 0 && destItems.length === 0
                                      ? "justify-center"
                                      : "opacity-0",
                                  )}
                                >
                                  {row === 0 && destItems.length === 0
                                    ? ExploreSearchUiCopy.comboboxNoMatchingPlaces
                                    : null}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 pl-1.5">
                              {tour ? (
                                <CommandItem
                                  value={CMD_ITEM.tour(tour.id)}
                                  onSelect={() => handleSelectTour(tour)}
                                  className="cursor-pointer gap-2.5 rounded-md px-2 py-2 data-[selected=true]:bg-accent"
                                >
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/80 text-muted-foreground">
                                    <Ticket className="size-3.5" />
                                  </span>
                                  <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className="text-sm leading-snug font-medium text-foreground">
                                      {tour.title}
                                    </span>
                                    {sub ? (
                                      <span className="text-xs leading-snug text-muted-foreground">
                                        {sub}
                                      </span>
                                    ) : null}
                                  </span>
                                </CommandItem>
                              ) : (
                                <div
                                  className={cn(
                                    "flex min-h-[2.75rem] items-center rounded-md px-2 py-1.5 text-center text-xs text-muted-foreground",
                                    row === 0 && tourItems.length === 0
                                      ? "justify-center"
                                      : "opacity-0",
                                  )}
                                >
                                  {row === 0 && tourItems.length === 0
                                    ? ExploreSearchUiCopy.comboboxNoMatchingTours
                                    : null}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CommandGroup>
                  </div>
                </div>

                {showSeeAll ? (
                  <div className="shrink-0 border-t border-border bg-muted/25">
                    <CommandGroup className="p-1.5">
                      <CommandItem
                        value={CMD_ITEM.seeAll}
                        onSelect={() => handleKeywordSubmit()}
                        className="cursor-pointer gap-2.5 rounded-md px-2.5 py-2.5 data-[selected=true]:bg-accent"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/60">
                          <Search className="size-3.5" />
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {ExploreSearchUiCopy.seeAllResultsPrefix}{" "}
                          <span className="font-semibold text-foreground">{`"${query.trim()}"`}</span>
                        </span>
                      </CommandItem>
                    </CommandGroup>
                  </div>
                ) : null}
              </>
            ) : null}

            <CommandEmpty className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center text-sm">
              {loading ? (
                <>
                  <Loader2
                    className="size-8 shrink-0 animate-spin text-muted-foreground"
                    aria-hidden
                  />
                  <span className="text-muted-foreground">{ExploreSearchUiCopy.searching}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{ExploreSearchUiCopy.noResults}</span>
              )}
            </CommandEmpty>
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
}
