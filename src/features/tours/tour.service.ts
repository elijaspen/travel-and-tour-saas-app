import { createClient as createServerClient } from "@supabase/utils/server";

import { companyService } from "@/features/company/company.service";
import type { Profile } from "@/features/profile/profile.types";
import { ProfileRoles } from "@/features/profile/profile.types";
import {
  supabaseService,
  type OffsetResult,
  type ServiceResult,
  type TableRow,
} from "@/features/shared/supabase-service";
import { buildStoragePath, uploadFile } from "@/features/shared/storage-service";
import {
  toQueryParams,
  type ListParams,
} from "@/features/shared/list-params";
import { agencyToursConfig } from "./utils/agency-tours-config";
import {
  ExploreSearchLimits,
  TourExploreSearchColumn,
  TourExploreSuggestionSelect,
} from "./utils/explore-search.constants";
import { TOUR_PHOTOS_BUCKET } from "./tour.constants";
import type { CreateTourCommand, UpdateTourCommand } from "./tour.validation";
import type { TourListItem, TourSuggestion, TourWithDetails } from "./tour.types";

type TourRow = TableRow<"tours">;

const toursBase = supabaseService("tours");

const AGENCY_TOURS_SELECT = `
  id,
  title,
  city,
  province_state,
  country_code,
  duration_days,
  is_active,
  tour_type,
  tour_photos(file_url, sort_order),
  tour_categories(categories(name)),
  tour_prices(currency, amount, min_pax)
`.trim();

function slugFromTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const slugBase = base.length > 0 ? base : "tour";
  return `${slugBase}-${globalThis.crypto.randomUUID().slice(0, 8)}`;
}

export const tourService = {
  async listForAgencyPage(
    params: ListParams & { profile: Profile },
  ): Promise<OffsetResult<TourListItem>> {
    const { profile } = params;

    if (profile.role === ProfileRoles.AGENT) {
      return { data: [], total: 0, error: null };
    }

    const queryParams = toQueryParams<TourRow>(agencyToursConfig, params);

    if (profile.role === ProfileRoles.BUSINESS_OWNER) {
      const { data: company } = await companyService.getCompanyByOwner(profile.id);
      if (!company) return { data: [], total: 0, error: null };
      queryParams.filters.push({
        column: "company_id",
        operator: "eq",
        value: company.id,
      });
    }

    const { data, total, error } = await toursBase.listOffset({
      ...queryParams,
      select: AGENCY_TOURS_SELECT,
    });

    if (error) return { data: [], total: null, error };

    return {
      data: (data ?? []) as unknown as TourListItem[],
      total: total ?? 0,
      error: null,
    };
  },

  async createWithChildren(params: {
    companyId: string;
    command: CreateTourCommand;
    photoFiles: File[];
  }): Promise<ServiceResult<{ id: string }>> {
    const db = await createServerClient();
    const { companyId, command, photoFiles } = params;
    if (command.new_photo_slots !== photoFiles.length) {
      return { data: null, error: new Error("Photos and files must match.") };
    }

    const tourInsert = {
      company_id: companyId,
      slug: slugFromTitle(command.tour.title),
      ...command.tour,
    };

    const { data: tour, error: tourErr } = await db
      .from("tours")
      .insert(tourInsert)
      .select("id")
      .single();

    if (tourErr || !tour) {
      return { data: null, error: tourErr ?? new Error("Could not create tour.") };
    }

    const tourId = tour.id;

    try {
      const prices = command.pricing_tiers.map((tier) => ({
        tour_id: tourId,
        ...tier,
      }));
      const { error: pErr } = await db.from("tour_prices").insert(prices);
      if (pErr) throw pErr;

      const days = command.itinerary_days;
      if (days?.length) {
        const rows = days.map((itineraryDay) => ({
          tour_id: tourId,
          ...itineraryDay,
        }));
        const { error: iErr } = await db.from("tour_itineraries").insert(rows);
        if (iErr) throw iErr;
      }

      const blacks = command.blackout_dates;
      if (blacks?.length) {
        const rows = blacks.map((blackoutDate) => ({
          tour_id: tourId,
          ...blackoutDate,
        }));
        const { error: bErr } = await db.from("blackout_dates").insert(rows);
        if (bErr) throw bErr;
      }

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const path = buildStoragePath(`${companyId}/${tourId}`, file);
        const { data: up, error: upErr } = await uploadFile(file, TOUR_PHOTOS_BUCKET, path);
        if (upErr || !up) throw upErr;
        const { error: phErr } = await db.from("tour_photos").insert({
          tour_id: tourId,
          file_url: up.publicUrl,
          sort_order: i,
        });
        if (phErr) throw phErr;
      }

      return { data: { id: tourId }, error: null };
    } catch (error) {
      await db.from("tours").delete().eq("id", tourId);
      return { data: null, error };
    }
  },

  async getTourWithDetails(tourId: string): Promise<ServiceResult<TourWithDetails>> {
    const db = await createServerClient();
    const { data, error } = await db
      .from("tours")
      .select("*, tour_prices(*), tour_itineraries(*), tour_photos(*), blackout_dates(*)")
      .eq("id", tourId)
      .single();

    if (error || !data) {
      return { data: null, error: error ?? new Error("Tour not found.") };
    }
    return { data: data as unknown as TourWithDetails, error: null };
  },

  async updateWithChildren(params: {
    tourId: string;
    companyId: string;
    command: UpdateTourCommand;
    newPhotoFiles: File[];
  }): Promise<ServiceResult<{ id: string }>> {
    const db = await createServerClient();
    const { tourId, companyId, command, newPhotoFiles } = params;
    if (command.new_photo_slots !== newPhotoFiles.length) {
      return { data: null, error: new Error("Photos and files must match.") };
    }

    const { error: tourErr } = await db
      .from("tours")
      .update(command.tour)
      .eq("id", tourId);

    if (tourErr) return { data: null, error: tourErr };

    try {
      // Replace pricing tiers
      await db.from("tour_prices").delete().eq("tour_id", tourId);
      const prices = command.pricing_tiers.map((tier) => ({
        tour_id: tourId,
        ...tier,
      }));
      const { error: pErr } = await db.from("tour_prices").insert(prices);
      if (pErr) throw pErr;

      await db.from("tour_itineraries").delete().eq("tour_id", tourId);
      const days = command.itinerary_days;
      if (days?.length) {
        const rows = days.map((itineraryDay) => ({
          tour_id: tourId,
          ...itineraryDay,
        }));
        const { error: iErr } = await db.from("tour_itineraries").insert(rows);
        if (iErr) throw iErr;
      }

      await db.from("blackout_dates").delete().eq("tour_id", tourId);
      const blacks = command.blackout_dates;
      if (blacks?.length) {
        const rows = blacks.map((blackoutDate) => ({
          tour_id: tourId,
          ...blackoutDate,
        }));
        const { error: bErr } = await db.from("blackout_dates").insert(rows);
        if (bErr) throw bErr;
      }

      // Manage photos: delete removed, keep existing with updated sort, upload new
      const { data: existingPhotos } = await db
        .from("tour_photos")
        .select("id, file_url")
        .eq("tour_id", tourId);

      const keptSet = new Set(command.kept_photo_db_ids);
      const toDelete = (existingPhotos ?? []).filter((p) => !keptSet.has(p.id));

      for (const photo of toDelete) {
        const storagePath = extractStoragePath(photo.file_url, TOUR_PHOTOS_BUCKET);
        if (storagePath) {
          await db.storage.from(TOUR_PHOTOS_BUCKET).remove([storagePath]);
        }
        await db.from("tour_photos").delete().eq("id", photo.id);
      }

      // Update sort_order for kept photos and upload new ones
      const photoMeta = command.photos;
      let newFileIndex = 0;
      for (let i = 0; i < photoMeta.length; i++) {
        const meta = photoMeta[i];
        if (meta.id) {
          await db
            .from("tour_photos")
            .update({ sort_order: i })
            .eq("id", meta.id);
        } else {
          const file = newPhotoFiles[newFileIndex++];
          if (!file) continue;
          const path = buildStoragePath(`${companyId}/${tourId}`, file);
          const { data: up, error: upErr } = await uploadFile(file, TOUR_PHOTOS_BUCKET, path);
          if (upErr || !up) throw upErr;
          const { error: phErr } = await db.from("tour_photos").insert({
            tour_id: tourId,
            file_url: up.publicUrl,
            sort_order: i,
          });
          if (phErr) throw phErr;
        }
      }

      return { data: { id: tourId }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async toggleActive(tourId: string, isActive: boolean): Promise<ServiceResult<{ id: string }>> {
    const db = await createServerClient();
    const { error } = await db
      .from("tours")
      .update({ is_active: isActive })
      .eq("id", tourId);

    if (error) return { data: null, error };
    return { data: { id: tourId }, error: null };
  },

  async searchPublicTourSuggestions(params: {
    q: string;
    limit?: number;
  }): Promise<TourSuggestion[]> {
    const q = params.q.trim();
    if (q.length < ExploreSearchLimits.minQueryLengthDb) return [];

    const db = await createServerClient();
    const kw = `%${q}%`;
    const orClause = `${TourExploreSearchColumn.TITLE}.ilike.${kw},${TourExploreSearchColumn.CITY}.ilike.${kw}`;
    const { data } = await db
      .from("tours")
      .select(TourExploreSuggestionSelect)
      .eq("is_active", true)
      .or(orClause)
      .limit(params.limit ?? ExploreSearchLimits.tourSearchDefaultLimit);

    return (data ?? []) as TourSuggestion[];
  },
};

/** Extracts the storage path from a Supabase public URL for a given bucket. */
function extractStoragePath(publicUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
