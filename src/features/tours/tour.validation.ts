import { z } from "zod";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export const locationSchema = z.object({
  addressLine: z.string().optional(),
  city: z.string().optional(),
  provinceState: z.string().optional(),
  countryCode: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeId: z.string().optional(),
});

export const itineraryDaySchema = z.object({
  id: z.string(),
  dayNumber: z.coerce.number().min(1),
  title: z.string().min(1, "Title is required"),
  startTime: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const pricingTierSchema = z.object({
  id: z.string(),
  minPax: z.coerce.number().min(1),
  maxPax: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
  currency: z.string().default("USD"),
});

export const blackoutDateSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
});

export const createTourSchema = z.object({
  title: z.string().min(2, "Tour title must be at least 2 characters"),
  shortDescription: z.string().max(160).optional(),
  description: z
    .string()
    .refine(
      (val) => stripHtml(val || "").trim().length >= 10,
      "Description must be at least 10 characters"
    ),
  location: locationSchema.optional(),
  durationDays: z.coerce.number().min(1, "Duration must be at least 1 day").optional(),
  defaultCapacity: z.coerce.number().min(1).optional(),
  maxSimultaneousBookings: z.coerce.number().min(1).optional(),
  tourType: z.enum(["on_demand", "fixed_schedule"]).optional(),
  photos: z.array(z.object({ id: z.string(), previewUrl: z.string() })).optional(),
  itineraryDays: z.array(itineraryDaySchema).optional(),
  pricingTiers: z.array(pricingTierSchema).optional(),
  blackoutDates: z.array(blackoutDateSchema).optional(),
  isActive: z.boolean().default(true),
});

export type CreateTourPayload = z.infer<typeof createTourSchema>;
export type LocationPayload = z.infer<typeof locationSchema>;
export type ItineraryDayPayload = z.infer<typeof itineraryDaySchema>;
export type PricingTierPayload = z.infer<typeof pricingTierSchema>;
export type BlackoutDatePayload = z.infer<typeof blackoutDateSchema>;
