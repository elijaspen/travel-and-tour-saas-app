import type { Database } from "@supabase/types/database";

type T = Database["public"]["Tables"];

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
