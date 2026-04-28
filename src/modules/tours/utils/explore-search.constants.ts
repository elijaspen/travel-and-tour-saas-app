/**
 * Single source of truth for unified explore search: URL keys, selection kinds,
 * limits, and user-visible copy. Prefer importing from here instead of string
 * literals scattered across components.
 */

export const ExploreUrlParam = {
  TOUR: "tour",
  Q: "q",
  PLACE: "place",
  BBOX: "bbox",
} as const;

export type ExploreUrlParamKey = (typeof ExploreUrlParam)[keyof typeof ExploreUrlParam];

export const UnifiedSelectionKind = {
  DESTINATION: "destination",
  TOUR: "tour",
  KEYWORD: "keyword",
} as const;

export type UnifiedSelectionKindValue =
  (typeof UnifiedSelectionKind)[keyof typeof UnifiedSelectionKind];

export const SuggestionSectionKind = {
  DESTINATION: UnifiedSelectionKind.DESTINATION,
  TOUR: UnifiedSelectionKind.TOUR,
} as const;

export type SuggestionSectionKindValue =
  (typeof SuggestionSectionKind)[keyof typeof SuggestionSectionKind];

export const UnifiedTourExploreSearchVariant = {
  HERO: "hero",
  COMPACT: "compact",
} as const;

export type UnifiedTourExploreSearchVariantValue =
  (typeof UnifiedTourExploreSearchVariant)[keyof typeof UnifiedTourExploreSearchVariant];

export const ExploreSearchLimits = {
  debounceMs: 300,
  minQueryLengthDb: 2,
  mapboxSuggestionLimit: 5,
  tourSuggestionComboboxLimit: 4,
  tourSearchDefaultLimit: 6,
  zodQueryMaxLength: 200,
  zodLimitMin: 1,
  zodLimitMax: 10,
} as const;

export const ExploreQueryCopy = {
  selectedTour: "Selected tour",
  allDestinations: "All destinations",
} as const;

export const PackageSearchBarCopy = {
  whereToLabel: "WHERE TO?",
  destinationPlaceholder: "Search destinations",
} as const;

export const ExploreSearchBarCopy = {
  locationLabel: "Location",
  destinationPlaceholder: "Search destinations & tours",
} as const;

export const ExploreBrowseCopy = {
  home: "Home",
  search: "Search",
} as const;

export const ExploreSearchUiCopy = {
  defaultPlaceholder: "Where to?",
  clearSearchAriaLabel: "Clear search",
  seeAllResultsPrefix: "See all results for",
  sectionDestinations: "Destinations",
  sectionTours: "Tours",
  comboboxColumnDestinationsSubtitle: "Places & regions",
  comboboxColumnToursSubtitle: "Tour packages",
  comboboxNoMatchingPlaces: "No matching places",
  comboboxNoMatchingTours: "No matching tours",
  tourSubtitlePrefix: "Tours •",
  searching: "Searching…",
  noResults: "No results found.",
} as const;

export const TourExploreSearchColumn = {
  TITLE: "title",
  CITY: "city",
} as const;

export const TourExploreSuggestionSelect = "id, title, city, country_code" as const;

export function formatTourSuggestionSubLabel(
  city: string | null,
  countryCode: string | null,
): string | null {
  const sub = [city, countryCode].filter(Boolean).join(", ");
  return sub ? `${ExploreSearchUiCopy.tourSubtitlePrefix} ${sub}` : null;
}
