import type { Database, Enums } from "@supabase/types/database";

import type {
  BlackoutDateForm,
  CreateTourCommand,
  CreateTourFormInput,
  CreateTourFormPayload,
  ItineraryDayForm,
  PricingTierForm,
  UpdateTourCommand,
} from "@/modules/tours/tour.validation";

type T = Database["public"]["Tables"];
type TourPhotoRow = T["tour_photos"]["Row"];

export type TourRow = T["tours"]["Row"];
export type TourInsert = T["tours"]["Insert"];

export type TourPriceInsert = T["tour_prices"]["Insert"];
export type TourItineraryInsert = T["tour_itineraries"]["Insert"];
export type TourPhotoInsert = T["tour_photos"]["Insert"];
export type BlackoutDateInsert = T["blackout_dates"]["Insert"];

export type TourType = Enums<"tour_type">;

export const TourTypes = {
  ON_DEMAND: "on_demand",
  FIXED_SCHEDULE: "fixed_schedule",
} as const satisfies Record<string, TourType>;

/** Geo + address fields on `tours` (Mapbox + manual edits). */
export type TourLocationValue = Partial<
  Pick<
    TourRow,
    | "address_line"
    | "city"
    | "province_state"
    | "country_code"
    | "postal_code"
    | "latitude"
    | "longitude"
    | "place_id"
  >
>;

export type TourPhotoDraft = Omit<TourPhotoRow, "id" | "tour_id"> & {
  id?: string;
  tempId?: string;
  file?: File;
};

export type TourListEntryDraft = {
  tempId: string;
  text: string;
};

export type CreateTourWizardState = Omit<
  CreateTourFormPayload,
  "photos" | "city" | "country_code" | "inclusions" | "exclusions"
> & {
  photos: TourPhotoDraft[];
  /** Empty in the wizard until filled; required by `createTourSchema` on submit. */
  city?: string;
  country_code?: string;
  inclusion_entries: TourListEntryDraft[];
  exclusion_entries: TourListEntryDraft[];
};

export function defaultCreateTourWizardState(): CreateTourWizardState {
  return {
    title: "",
    description: "",
    short_description: undefined,
    address_line: undefined,
    city: undefined,
    province_state: undefined,
    country_code: undefined,
    postal_code: undefined,
    latitude: undefined,
    longitude: undefined,
    place_id: undefined,
    duration_days: 1,
    default_capacity: 5,
    max_simultaneous_bookings: 1,
    tour_type: TourTypes.ON_DEMAND,
    photos: [],
    inclusion_entries: [],
    exclusion_entries: [],
    itinerary_days: [],
    pricing_tiers: [],
    blackout_dates: [],
    is_active: true,
  };
}

export type {
  BlackoutDateForm,
  CreateTourCommand,
  CreateTourFormInput,
  CreateTourFormPayload,
  ItineraryDayForm,
  PricingTierForm,
  UpdateTourCommand,
};

export type TourListItem = Pick<
  T["tours"]["Row"],
  | "id"
  | "title"
  | "city"
  | "province_state"
  | "country_code"
  | "duration_days"
  | "is_active"
  | "tour_type"
> & {
  tour_photos: Pick<T["tour_photos"]["Row"], "file_url" | "sort_order">[] | null;
  tour_categories: { categories: Pick<T["categories"]["Row"], "name"> | null }[] | null;
  tour_prices: Pick<T["tour_prices"]["Row"], "currency" | "amount" | "min_pax">[] | null;
};

export type TourWithDetails = TourRow & {
  tour_prices: T["tour_prices"]["Row"][];
  tour_itineraries: T["tour_itineraries"]["Row"][];
  tour_photos: T["tour_photos"]["Row"][];
  blackout_dates: T["blackout_dates"]["Row"][];
};

export type TourSuggestion = {
  id: string;
  title: string;
  city: string | null;
  country_code: string | null;
};
