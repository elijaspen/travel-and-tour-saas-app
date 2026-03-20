import { createClient as createServerClient } from "@supabase/utils/server";
import type { Database } from "@supabase/types/database";

import { companyService } from "@/features/company/company.service";
import type { Profile } from "@/features/profile/profile.types";
import { ProfileRoles } from "@/features/profile/profile.types";
import type { OffsetResult } from "@/features/shared/supabase-service";

import type {
  AgencyToursPublication,
  AgencyToursSort,
  AgencyToursTourTypeFilter,
} from "./agency-tours-url";
import { TOUR_PHOTOS_BUCKET } from "./tour.constants";
import type { CreateTourFormPayload } from "./tour.validation";
import type { TourListItem } from "./tour.types";
import type { ServiceResult } from "@/features/shared/supabase-service";

type TourTypeEnum = Database["public"]["Enums"]["tour_type"];

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

function safeSearchText(input: string) {
  return input.trim().replace(/[%_,()]/g, "");
}

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
  async listForAgencyPage(params: {
    profile: Profile;
    page?: number;
    pageSize?: number;
    search?: string;
    publication?: AgencyToursPublication;
    tourType?: AgencyToursTourTypeFilter;
    sort?: AgencyToursSort;
  }): Promise<OffsetResult<TourListItem>> {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = params.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const publication = params.publication ?? "all";
    const tourType = params.tourType ?? "all";
    const sort = params.sort ?? "created_desc";

    const { profile } = params;

    if (profile.role === ProfileRoles.AGENT) {
      return { data: [], total: 0, error: null };
    }

    let ownerCompanyId: string | null = null;
    if (profile.role === ProfileRoles.BUSINESS_OWNER) {
      const { data: company } = await companyService.getCompanyByOwner(profile.id);
      if (!company) return { data: [], total: 0, error: null };
      ownerCompanyId = company.id;
    }

    const db = await createServerClient();
    let q = db
      .from("tours")
      .select(AGENCY_TOURS_SELECT, { count: "exact" })
      .range(from, to);

    if (ownerCompanyId) q = q.eq("company_id", ownerCompanyId);

    if (publication === "published") q = q.eq("is_active", true);
    if (publication === "unpublished") q = q.eq("is_active", false);

    if (tourType !== "all") {
      q = q.eq("tour_type", tourType as TourTypeEnum);
    }

    const word = safeSearchText(params.search ?? "");
    if (word.length > 0) {
      const pattern = `%${word}%`;
      q = q.or(`title.ilike.${pattern},city.ilike.${pattern}`);
    }

    switch (sort) {
      case "created_asc":
        q = q.order("created_at", { ascending: true });
        break;
      case "title_asc":
        q = q.order("title", { ascending: true });
        break;
      case "title_desc":
        q = q.order("title", { ascending: false });
        break;
      case "duration_asc":
        q = q.order("duration_days", { ascending: true, nullsFirst: false });
        break;
      case "duration_desc":
        q = q.order("duration_days", { ascending: false, nullsFirst: false });
        break;
      case "created_desc":
      default:
        q = q.order("created_at", { ascending: false });
        break;
    }

    const { data, error, count } = await q;
    if (error) return { data: [], total: null, error };

    return {
      data: (data ?? []) as unknown as TourListItem[],
      total: count ?? 0,
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
      const prices = payload.pricing_tiers.map((t) => ({
        tour_id: tourId,
        currency: t.currency,
        min_pax: t.min_pax,
        max_pax: t.max_pax,
        amount: t.amount,
      }));
      const { error: pErr } = await db.from("tour_prices").insert(prices);
      if (pErr) throw pErr;

      const days = payload.itinerary_days;
      if (days?.length) {
        const rows = days.map((d) => ({
          tour_id: tourId,
          day_number: d.day_number,
          title: d.title,
          description: d.description?.trim() ? d.description : null,
          start_time: d.start_time?.trim() ? d.start_time : null,
          image_url: d.image_url?.trim() ? d.image_url : null,
        }));
        const { error: iErr } = await db.from("tour_itineraries").insert(rows);
        if (iErr) throw iErr;
      }

      const blacks = payload.blackout_dates;
      if (blacks?.length) {
        const rows = blacks.map((b) => ({
          tour_id: tourId,
          start_date: b.start_date,
          end_date: b.end_date,
          reason: b.reason?.trim() ? b.reason : null,
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
    } catch (e) {
      await db.from("tours").delete().eq("id", tourId);
      return { data: null, error: e };
    }
  },
};
