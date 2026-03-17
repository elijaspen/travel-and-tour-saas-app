import { createClient as createServerClient } from "@supabase/utils/server"
import { supabaseService, ServiceResult } from "@/features/shared/supabase-service"
import type { Company, CompanyStatus } from "./company.types"
import type { Database } from "@supabase/types/database"

const base = supabaseService("companies")

type OwnerSnapshot = {
  id: string
  full_name: string
  phone: string | null
  status: Database["public"]["Enums"]["profile_status"]
  created_at: string
}

export type CompanyWithOwner = Company & { owner: OwnerSnapshot | null }

export const companyService = {
  ...base,

  async getCompanyByOwner(ownerProfileId: string): Promise<ServiceResult<Company>> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_profile_id", ownerProfileId)
      .maybeSingle()

    return { data: (data ?? null) as Company | null, error }
  },

  async listAllWithOwners(
    status?: CompanyStatus,
  ): Promise<ServiceResult<CompanyWithOwner[]>> {
    const supabase = await createServerClient()
    let query = supabase
      .from("companies")
      .select("*, owner:owner_profile_id(id, full_name, phone, status, created_at)")
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query
    return { data: (data ?? []) as unknown as CompanyWithOwner[], error }
  },

  async getWithOwner(id: string): Promise<ServiceResult<CompanyWithOwner>> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("companies")
      .select("*, owner:owner_profile_id(id, full_name, phone, status, created_at)")
      .eq("id", id)
      .single()

    return { data: (data ?? null) as CompanyWithOwner | null, error }
  },
}
