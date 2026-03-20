import { createClient as createServerClient } from "@supabase/utils/server"

import { companyService } from "@/features/company/company.service"
import type { Profile } from "@/features/profile/profile.types"
import { ProfileRoles } from "@/features/profile/profile.types"
import type { OffsetResult } from "@/features/shared/supabase-service"

import type { TourListItem } from "./tour.types"

// PostgREST: nested selects follow foreign keys in supabase/types/database.ts
const AGENCY_TOURS_SELECT = `
  id,
  title,
  city,
  province_state,
  country_code,
  duration_days,
  is_active,
  tour_photos(file_url, sort_order),
  tour_categories(categories(name)),
  tour_prices(currency, amount, min_pax)
`.trim()

/** Strips characters that would confuse `.or(...ilike...)` filters (user-typed % _ break matching). */
function safeSearchText(input: string) {
  return input.trim().replace(/[%_,()]/g, "")
}

export const tourService = {
  async listForAgencyPage(params: {
    profile: Profile
    page?: number
    pageSize?: number
    search?: string
  }): Promise<OffsetResult<TourListItem>> {
    const page = Math.max(1, params.page ?? 1)
    const pageSize = params.pageSize ?? 20
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { profile } = params

    if (profile.role === ProfileRoles.AGENT) {
      return { data: [], total: 0, error: null }
    }

    let ownerCompanyId: string | null = null
    if (profile.role === ProfileRoles.BUSINESS_OWNER) {
      const { data: company } = await companyService.getCompanyByOwner(profile.id)
      if (!company) return { data: [], total: 0, error: null }
      ownerCompanyId = company.id
    }

    const db = await createServerClient()
    let q = db
      .from("tours")
      .select(AGENCY_TOURS_SELECT, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (ownerCompanyId) q = q.eq("company_id", ownerCompanyId)

    const word = safeSearchText(params.search ?? "")
    if (word.length > 0) {
      const pattern = `%${word}%`
      q = q.or(`title.ilike.${pattern},city.ilike.${pattern}`)
    }

    const { data, error, count } = await q
    if (error) return { data: [], total: null, error }

    return {
      data: (data ?? []) as unknown as TourListItem[],
      total: count ?? 0,
      error: null,
    }
  },
}
