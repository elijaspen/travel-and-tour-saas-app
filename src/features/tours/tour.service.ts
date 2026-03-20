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
import type { TourListItem } from "./tour.types";

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
};
