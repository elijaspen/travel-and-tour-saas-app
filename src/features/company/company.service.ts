import { createClient as createServerClient } from "@supabase/utils/server"
import { createAdminClient } from "@supabase/utils/admin"
import { supabaseService, ServiceResult } from "@/features/shared/supabase-service"
import type { Company, CompanyStatus } from "./company.types"
import type { Profile } from "@/features/profile/profile.types"
import {
  COMPANY_PERMIT_BUCKET,
  COMPANY_PERMIT_ALLOWED_MIME_TYPES,
  COMPANY_PERMIT_MAX_SIZE_BYTES,
} from "./company.constants"

const base = supabaseService("companies")

export type CompanyWithOwner = Company & { owner: Profile | null }
const COMPANY_WITH_OWNER_SELECT =
  "*, owner:profiles!companies_owner_profile_id_fkey(*)"

export type StatusCounts = {
  pending: number
  approved: number
  declined: number
  suspended: number
  total: number
}

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

  async getStatusCounts(): Promise<ServiceResult<StatusCounts>> {
    const supabase = await createServerClient()
    const { data, error } = await supabase.rpc("get_company_status_counts")

    if (error || !data) {
      return {
        data: { pending: 0, approved: 0, declined: 0, suspended: 0, total: 0 },
        error,
      }
    }

    const counts: StatusCounts = { pending: 0, approved: 0, declined: 0, suspended: 0, total: 0 }
    for (const row of data as { status: string; count: number }[]) {
      const key = row.status as keyof Omit<StatusCounts, "total">
      if (key in counts) counts[key] = Number(row.count)
    }
    counts.total = counts.pending + counts.approved + counts.declined + counts.suspended

    return { data: counts, error: null }
  },

  async listWithOwnersPaginated(params?: {
    page?: number
    pageSize?: number
    status?: CompanyStatus
  }) {
    const result = await base.listOffset({
      page: params?.page,
      pageSize: params?.pageSize,
      orderBy: "created_at",
      ascending: false,
      select: COMPANY_WITH_OWNER_SELECT,
      eq: params?.status ? { status: params.status } : undefined,
    })
    return {
      ...result,
      data: result.data as CompanyWithOwner[],
    }
  },

  async getWithOwner(id: string): Promise<ServiceResult<CompanyWithOwner>> {
    const { data, error } = await base.getById(id, {
      select: COMPANY_WITH_OWNER_SELECT,
    })
    return { data: (data ?? null) as CompanyWithOwner | null, error }
  },

  async getOwnerEmail(userId: string): Promise<ServiceResult<string | null>> {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.getUserById(userId)
    return { data: data?.user?.email ?? null, error }
  },

  async getPermitSignedUrl(path: string, expiresIn = 60 * 10): Promise<ServiceResult<string>> {
    const supabase = await createServerClient()
    const { data, error } = await supabase.storage
      .from(COMPANY_PERMIT_BUCKET)
      .createSignedUrl(path, expiresIn)

    return { data: data?.signedUrl ?? null, error }
  },

  validatePermitFile(file: File): { ok: true } | { ok: false; error: string } {
    if (!COMPANY_PERMIT_ALLOWED_MIME_TYPES.includes(file.type as (typeof COMPANY_PERMIT_ALLOWED_MIME_TYPES)[number])) {
      return { ok: false, error: "Permit must be a PDF, PNG, or JPG file." }
    }
    if (file.size > COMPANY_PERMIT_MAX_SIZE_BYTES) {
      return { ok: false, error: "Permit file must be 2MB or smaller." }
    }
    return { ok: true }
  },

  async uploadPermit(file: File, ownerId: string): Promise<ServiceResult<{ path: string }>> {
    const validation = companyService.validatePermitFile(file)
    if (!validation.ok) {
      return { data: null, error: new Error(validation.error) }
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin"
    const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "bin"
    const objectPath = `${ownerId}/${crypto.randomUUID()}.${safeExtension}`

    const supabase = await createServerClient()
    const { error } = await supabase.storage
      .from(COMPANY_PERMIT_BUCKET)
      .upload(objectPath, file, { upsert: false, contentType: file.type })

    if (error) {
      return { data: null, error }
    }

    return { data: { path: objectPath }, error: null }
  },
}
