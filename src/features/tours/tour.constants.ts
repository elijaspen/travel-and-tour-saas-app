import { type TourType, TourTypes } from "./tour.types";

export const TOUR_PHOTOS_BUCKET = "tour-photos";

/** UI labels for each {@link TourTypes} value. */
const TOUR_TYPE_LABELS = {
  [TourTypes.ON_DEMAND]: "On Demand",
  [TourTypes.FIXED_SCHEDULE]: "Fixed Schedule",
} as const satisfies Record<TourType, string>;

export const TOUR_TYPE_SELECT_OPTIONS: { value: TourType; label: string }[] = (
  Object.values(TourTypes) as TourType[]
).map((value) => ({
  value,
  label: TOUR_TYPE_LABELS[value],
}));

export const TOUR_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

export const TOUR_PHOTO_MIME_TYPES = ["image/png", "image/jpeg"] as const;
