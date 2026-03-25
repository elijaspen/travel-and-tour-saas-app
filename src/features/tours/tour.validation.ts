import { z } from "zod";

import { isValidCountryCode } from "@/lib/geo/countries";
import { isValidCurrencyCode } from "@/lib/geo/currencies";
import {
  isContiguousPartition,
  pricingScaleMaxPax,
} from "@/features/tours/utils/pricing-tier-partition";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const tourTypeEnum = z.enum(["on_demand", "fixed_schedule"]);
const photoRefSchema = z.object({
  id: z.string().optional(),
  tempId: z.string().optional(),
});

function toNullableText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const itineraryDayFormSchema = z.object({
  id: z.string(),
  day_number: z.coerce.number().min(1),
  title: z.string().min(1, "Title is required"),
  start_time: z.string().nullish(),
  description: z.string().nullish(),
  image_url: z.string().nullish(),
});

export const pricingTierFormSchema = z.object({
  id: z.string(),
  min_pax: z.coerce.number().min(1),
  max_pax: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
  currency: z
    .string()
    .default("USD")
    .refine(isValidCurrencyCode, "Invalid currency code"),
});

export const blackoutDateFormSchema = z
  .object({
    id: z.string(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    reason: z.string().nullish(),
  })
  .refine((d) => d.start_date <= d.end_date, {
    message: "End date must be on or after start date",
    path: ["end_date"],
  });

export const createTourSchema = z
  .object({
    title: z.string().min(2, "Tour title must be at least 2 characters"),
    short_description: z.string().max(160).optional(),
    description: z
      .string()
      .refine(
        (val) => stripHtml(val || "").trim().length >= 10,
        "Description must be at least 10 characters",
      ),
    address_line: z.string().optional(),
    city: z.string().min(1, "City is required"),
    province_state: z.string().optional(),
    country_code: z
      .string()
      .min(1, "Country is required")
      .refine(isValidCountryCode, "Invalid country code"),
    postal_code: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    place_id: z.string().optional(),
    duration_days: z.coerce.number().min(1, "Duration must be at least 1 day"),
    default_capacity: z.coerce.number().min(1, "Default capacity is required"),
    max_simultaneous_bookings: z.coerce
      .number()
      .min(1, "Max simultaneous bookings is required"),
    tour_type: tourTypeEnum.optional(),
    inclusions: z
      .array(z.string().max(500, "Each inclusion must be 500 characters or less"))
      .optional()
      .transform((rows) =>
        (rows ?? []).map((s) => s.trim()).filter((s) => s.length > 0),
      ),
    exclusions: z
      .array(z.string().max(500, "Each exclusion must be 500 characters or less"))
      .optional()
      .transform((rows) =>
        (rows ?? []).map((s) => s.trim()).filter((s) => s.length > 0),
      ),
    photos: z.array(photoRefSchema).optional(),
    itinerary_days: z.array(itineraryDayFormSchema).optional(),
    pricing_tiers: z.array(pricingTierFormSchema).min(1, "Add at least one pricing tier"),
    blackout_dates: z.array(blackoutDateFormSchema).optional(),
    is_active: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const maxPax = pricingScaleMaxPax(data.default_capacity);
    const tiers = data.pricing_tiers ?? [];
    if (!isContiguousPartition(tiers, maxPax)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Pricing tiers must cover all group sizes from 1 through your default capacity with no gaps or overlaps.",
        path: ["pricing_tiers"],
      });
    }
  });

export type CreateTourFormPayload = z.infer<typeof createTourSchema>;
export type CreateTourFormInput = z.input<typeof createTourSchema>;
export type ItineraryDayForm = z.infer<typeof itineraryDayFormSchema>;
export type PricingTierForm = z.infer<typeof pricingTierFormSchema>;
export type BlackoutDateForm = z.infer<typeof blackoutDateFormSchema>;

const createTourCommandShapeSchema = createTourSchema.transform((payload) => {
  const photos = payload.photos ?? [];

  return {
    tour: {
      title: payload.title,
      short_description: toNullableText(payload.short_description),
      description: payload.description,
      duration_days: payload.duration_days,
      default_capacity: payload.default_capacity,
      max_simultaneous_bookings: payload.max_simultaneous_bookings,
      tour_type: payload.tour_type ?? tourTypeEnum.enum.on_demand,
      address_line: toNullableText(payload.address_line),
      city: payload.city,
      province_state: toNullableText(payload.province_state),
      country_code: payload.country_code,
      postal_code: toNullableText(payload.postal_code),
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      place_id: toNullableText(payload.place_id),
      inclusions: payload.inclusions ?? [],
      exclusions: payload.exclusions ?? [],
      is_active: payload.is_active,
    },
    pricing_tiers: payload.pricing_tiers.map((tier) => ({
      currency: tier.currency,
      min_pax: tier.min_pax,
      max_pax: tier.max_pax,
      amount: tier.amount,
    })),
    itinerary_days: (payload.itinerary_days ?? []).map((day) => ({
      day_number: day.day_number,
      title: day.title,
      description: toNullableText(day.description),
      start_time: toNullableText(day.start_time),
      image_url: toNullableText(day.image_url),
    })),
    blackout_dates: (payload.blackout_dates ?? []).map((blackoutDate) => ({
      start_date: blackoutDate.start_date,
      end_date: blackoutDate.end_date,
      reason: toNullableText(blackoutDate.reason),
    })),
    photos,
  };
});

export const createTourCommandSchema = createTourCommandShapeSchema.transform(
  (normalizedPayload) => ({
    ...normalizedPayload,
    new_photo_slots: normalizedPayload.photos.filter((photo) => !photo.id).length,
  }),
);

export const updateTourCommandSchema = createTourCommandShapeSchema.transform(
  (normalizedPayload) => ({
    ...normalizedPayload,
    new_photo_slots: normalizedPayload.photos.filter((photo) => !photo.id).length,
    kept_photo_db_ids: normalizedPayload.photos
      .map((photo) => photo.id)
      .filter((id): id is string => Boolean(id)),
  }),
);

export type CreateTourCommand = z.infer<typeof createTourCommandSchema>;
export type UpdateTourCommand = z.infer<typeof updateTourCommandSchema>;
