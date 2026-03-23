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
import {
  toQueryParams,
  type ListParams,
} from "@/features/shared/list-params";
import { agencyToursConfig } from "./utils/agency-tours-config";
import { TOUR_PHOTOS_BUCKET } from "./tour.constants";
import type { CreateTourFormPayload } from "./tour.validation";
import type { TourListItem } from "./tour.types";

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
    payload: CreateTourFormPayload;
    photoFiles: File[];
  }): Promise<ServiceResult<{ id: string }>> {
    const db = await createServerClient();
    const { companyId, payload, photoFiles } = params;
    const photoMeta = payload.photos ?? [];
    if (photoMeta.length !== photoFiles.length) {
      return { data: null, error: new Error("Photos and files must match.") };
    }

    const tourInsert = {
      company_id: companyId,
      slug: slugFromTitle(payload.title),
      title: payload.title,
      short_description: payload.short_description ?? null,
      description: payload.description,
      duration_days: payload.duration_days ?? null,
      default_capacity: payload.default_capacity ?? null,
      max_simultaneous_bookings: payload.max_simultaneous_bookings ?? null,
      tour_type: payload.tour_type ?? "on_demand",
      address_line: payload.address_line ?? null,
      city: payload.city ?? null,
      province_state: payload.province_state ?? null,
      country_code: payload.country_code ?? null,
      postal_code: payload.postal_code ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      place_id: payload.place_id ?? null,
      inclusions: payload.inclusions ?? [],
      exclusions: payload.exclusions ?? [],
      is_active: payload.is_active ?? true,
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
      const prices = payload.pricing_tiers.map((tier) => ({
        tour_id: tourId,
        currency: tier.currency,
        min_pax: tier.min_pax,
        max_pax: tier.max_pax,
        amount: tier.amount,
      }));
      const { error: pErr } = await db.from("tour_prices").insert(prices);
      if (pErr) throw pErr;

      const days = payload.itinerary_days;
      if (days?.length) {
        const rows = days.map((day) => ({
          tour_id: tourId,
          day_number: day.day_number,
          title: day.title,
          description: day.description?.trim() ? day.description : null,
          start_time: day.start_time?.trim() ? day.start_time : null,
          image_url: day.image_url?.trim() ? day.image_url : null,
        }));
        const { error: iErr } = await db.from("tour_itineraries").insert(rows);
        if (iErr) throw iErr;
      }

      const blacks = payload.blackout_dates;
      if (blacks?.length) {
        const rows = blacks.map((blackoutDate) => ({
          tour_id: tourId,
          start_date: blackoutDate.start_date,
          end_date: blackoutDate.end_date,
          reason: blackoutDate.reason?.trim() ? blackoutDate.reason : null,
        }));
        const { error: bErr } = await db.from("blackout_dates").insert(rows);
        if (bErr) throw bErr;
      }

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const extRaw = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const ext = extRaw.replace(/[^a-z0-9]/g, "") || "jpg";
        const safeExt = ext === "jpeg" ? "jpg" : ext;
        const path = `${companyId}/${tourId}/${globalThis.crypto.randomUUID()}.${safeExt}`;
        const { error: upErr } = await db.storage.from(TOUR_PHOTOS_BUCKET).upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = db.storage.from(TOUR_PHOTOS_BUCKET).getPublicUrl(path);
        const { error: phErr } = await db.from("tour_photos").insert({
          tour_id: tourId,
          file_url: pub.publicUrl,
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
};
