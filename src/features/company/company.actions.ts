"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { createClient as createServerClient } from "@supabase/utils/server"
import { companyOnboardingSchema } from "./company.validation"
import { companyService } from "./company.service"
import type { ActionResult } from "@/features/shared/types"
import type { Company, CompanyUpdate, CompanyStatus } from "./company.types"
import { ROUTE_PATHS } from "@/config/routes"

export async function createCompanyAction(
  formData: FormData,
): Promise<ActionResult<Company>> {
  const supabase = await createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "You must be logged in to complete this step." }
  }

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone"),
    location: formData.get("location"),
  }

  const parsed = companyOnboardingSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const permitFile = formData.get("permit_file")
  if (!(permitFile instanceof File) || permitFile.size === 0) {
    return { success: false, fieldErrors: { permit_url: ["Business permit is required."] } }
  }

  const { data: uploadData, error: uploadError } = await companyService.uploadPermit(permitFile, user.id)
  if (uploadError || !uploadData) {
    const message = uploadError instanceof Error ? uploadError.message : "Failed to upload permit file."
    return { success: false, fieldErrors: { permit_url: [message] } }
  }

  const { name, description, contact_email, contact_phone, location } = parsed.data

  const { data, error } = await companyService.create({
    owner_profile_id: user.id,
    name,
    description: description || null,
    contact_email: contact_email || null,
    contact_phone: contact_phone || null,
    location: location || null,
    permit_url: uploadData.path,
  })

  if (error || !data) {
    const message =
      error instanceof Error ? error.message : "Could not create your business. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}

export async function updateCompanyAction(
  companyId: string,
  patch: Partial<CompanyUpdate>,
): Promise<ActionResult<Company>> {
  const { data, error } = await companyService.patch(companyId, patch)

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Could not update company. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}

/**
 * Admin-only action: updates a company's status and redirects to the businesses list.
 * Use with form action: updateCompanyStatusAction.bind(null, companyId, newStatus)
 */
export async function updateCompanyStatusAction(
  companyId: string,
  newStatus: CompanyStatus,
) {
  await updateCompanyAction(companyId, { status: newStatus })
  redirect(ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES)
}
