"use server";

import { z } from "zod";
import { ExploreSearchLimits } from "@/modules/tours/utils/explore-search.constants";
import { tourService } from "@/modules/tours/tour.service";
import type { TourSuggestion } from "@/modules/tours/tour.types";

const searchSchema = z.object({
  q: z.string().min(1).max(ExploreSearchLimits.zodQueryMaxLength),
  limit: z
    .number()
    .int()
    .min(ExploreSearchLimits.zodLimitMin)
    .max(ExploreSearchLimits.zodLimitMax)
    .optional(),
});

export async function searchPublicTourSuggestionsAction(
  q: string,
  limit?: number,
): Promise<TourSuggestion[]> {
  const parsed = searchSchema.safeParse({ q, limit });
  if (!parsed.success) return [];
  return tourService.searchPublicTourSuggestions(parsed.data);
}
