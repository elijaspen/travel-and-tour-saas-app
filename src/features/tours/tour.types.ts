import type { Database } from "@supabase/types/database";

import type {
  BlackoutDateForm,
  CreateTourFormPayload,
  ItineraryDayForm,
  PricingTierForm,
} from "./tour.validation";

type T = Database["public"]["Tables"];

export type TourRow = T["tours"]["Row"];
export type TourInsert = T["tours"]["Insert"];

export type TourPriceInsert = T["tour_prices"]["Insert"];
export type TourItineraryInsert = T["tour_itineraries"]["Insert"];
export type TourPhotoInsert = T["tour_photos"]["Insert"];
export type BlackoutDateInsert = T["blackout_dates"]["Insert"];

export type TourType = Database["public"]["Enums"]["tour_type"];

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

/** Gallery row before upload; `file_url` holds blob URL for preview. */
export type TourPhotoDraft = {
  id: string;
  sort_order: number;
  file_url: string;
  file?: File;
};

export type CreateTourWizardState = Omit<CreateTourFormPayload, "photos"> & {
  photos: TourPhotoDraft[];
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
    duration_days: 3,
    default_capacity: 15,
    max_simultaneous_bookings: 2,
    tour_type: "on_demand",
    photos: [],
    itinerary_days: [],
    pricing_tiers: [],
    blackout_dates: [],
    is_active: true,
  };
}

export type {
  BlackoutDateForm,
  CreateTourFormPayload,
  ItineraryDayForm,
  PricingTierForm,
};

/** One tour plus the related rows loaded for `/agency/tours` (matches the select in `tour.service`). */
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
