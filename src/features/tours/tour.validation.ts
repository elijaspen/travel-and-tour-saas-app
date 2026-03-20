import { z } from "zod";

import { isValidCountryCode } from "@/lib/geo/countries";
import { isValidCurrencyCode } from "@/lib/geo/currencies";
import {
  isContiguousPartition,
  pricingScaleMaxPax,
} from "@/features/tours/pricing-tier-partition";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const tourTypeEnum = z.enum(["on_demand", "fixed_schedule"]);

export const itineraryDayFormSchema = z.object({
  id: z.string(),
  day_number: z.coerce.number().min(1),
  title: z.string().min(1, "Title is required"),
  start_time: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
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
    reason: z.string().optional(),
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
    city: z.string().optional(),
    province_state: z.string().optional(),
    country_code: z
      .string()
      .optional()
      .refine(
        (c) => c == null || c === "" || isValidCountryCode(c),
        "Invalid country code",
      ),
    postal_code: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    place_id: z.string().optional(),
    duration_days: z.coerce.number().min(1, "Duration must be at least 1 day").optional(),
    default_capacity: z.coerce.number().min(1).optional(),
    max_simultaneous_bookings: z.coerce.number().min(1).optional(),
    tour_type: tourTypeEnum.optional(),
    photos: z.array(z.object({ id: z.string() })).optional(),
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
          "Pricing bands must cover all group sizes from 1 through your default capacity with no gaps or overlaps.",
        path: ["pricing_tiers"],
      });
    }
  });

export type CreateTourFormPayload = z.infer<typeof createTourSchema>;
export type ItineraryDayForm = z.infer<typeof itineraryDayFormSchema>;
export type PricingTierForm = z.infer<typeof pricingTierFormSchema>;
export type BlackoutDateForm = z.infer<typeof blackoutDateFormSchema>;
