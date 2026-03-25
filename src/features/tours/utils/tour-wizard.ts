import { getTextFromHtml } from "@/components/shared/rich-text-editor";
import { isValidCountryCode } from "@/lib/geo/countries";
import type {
  CreateTourWizardState,
  TourListEntryDraft,
  TourWithDetails,
} from "@/features/tours/tour.types";
import {
  isContiguousPartition,
  pricingScaleMaxPax,
} from "@/features/tours/utils/pricing-tier-partition";

const toExclusionOrInclusionEntries = (list: string[] | null | undefined): TourListEntryDraft[] =>
  (list ?? []).map((text) => ({ tempId: crypto.randomUUID(), text }));

const serializeEntries = (entries: TourListEntryDraft[] | null | undefined): string[] =>
  (entries ?? []).map((entry) => entry.text);

export function tourToWizardState(tour: TourWithDetails): CreateTourWizardState {
  return {
    title: tour.title,
    description: tour.description,
    short_description: tour.short_description ?? undefined,
    address_line: tour.address_line ?? undefined,
    city: tour.city ?? undefined,
    province_state: tour.province_state ?? undefined,
    country_code: tour.country_code ?? undefined,
    postal_code: tour.postal_code ?? undefined,
    latitude: tour.latitude != null ? Number(tour.latitude) : undefined,
    longitude: tour.longitude != null ? Number(tour.longitude) : undefined,
    place_id: tour.place_id ?? undefined,
    duration_days: tour.duration_days ?? 1,
    default_capacity: tour.default_capacity ?? 5,
    max_simultaneous_bookings: tour.max_simultaneous_bookings ?? 1,
    tour_type: tour.tour_type,
    is_active: tour.is_active,
    photos: [...tour.tour_photos]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ id, sort_order, file_url }) => ({ id, sort_order, file_url })),
    pricing_tiers: tour.tour_prices.map((p) => ({ ...p, max_pax: p.max_pax ?? p.min_pax })),
    itinerary_days: [...tour.tour_itineraries].sort((a, b) => a.day_number - b.day_number),
    blackout_dates: [...tour.blackout_dates],
    inclusion_entries: toExclusionOrInclusionEntries(tour.inclusions),
    exclusion_entries: toExclusionOrInclusionEntries(tour.exclusions),
  };
}

export function wizardToJsonPayload(state: CreateTourWizardState) {
  const { inclusion_entries, exclusion_entries, photos, ...apiFields } = state;
  return {
    ...apiFields,
    photos: (photos ?? []).map(({ id, tempId }) => ({ id, tempId })),
    inclusions: serializeEntries(inclusion_entries),
    exclusions: serializeEntries(exclusion_entries),
  };
}

export function getStepValidation(
  currentStep: number,
  formData: CreateTourWizardState,
): { canProceed: boolean; errors: Record<string, string | undefined> } {
  if (currentStep === 1) {
    const titleOk = (formData.title?.trim().length ?? 0) >= 2;
    const descOk = getTextFromHtml(formData.description ?? "").trim().length >= 10;
    return {
      canProceed:
        titleOk &&
        descOk &&
        (formData.duration_days ?? 0) >= 1 &&
        (formData.default_capacity ?? 0) >= 1 &&
        (formData.max_simultaneous_bookings ?? 0) >= 1,
      errors: {
        title: !titleOk && formData.title ? "Min 2 characters" : undefined,
        description: !descOk && formData.description ? "Min 10 characters" : undefined,
      },
    };
  }
  if (currentStep === 2) {
    return {
      canProceed:
        (formData.city?.trim().length ?? 0) >= 1 &&
        Boolean(formData.country_code) &&
        isValidCountryCode(formData.country_code),
      errors: {},
    };
  }
  if (currentStep === 4) {
    return {
      canProceed: isContiguousPartition(
        formData.pricing_tiers ?? [],
        pricingScaleMaxPax(formData.default_capacity),
      ),
      errors: {},
    };
  }
  return { canProceed: true, errors: {} };
}
