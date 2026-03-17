"use server"

import { z } from "zod"
import { createClient as createServerClient } from "@supabase/utils/server"
import { companyOnboardingSchema, type CompanyOnboardingPayload } from "./company.validation"
import { companyService } from "./company.service"
import type { ActionResult } from "@/features/shared/types"
import type { Company, CompanyUpdate } from "./company.types"

export async function createCompanyAction(
  values: CompanyOnboardingPayload,
): Promise<ActionResult<Company>> {
  const parsed = companyOnboardingSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "You must be logged in to complete this step." }
  }

  const { name, description, contact_email, contact_phone, location } = parsed.data

  const { data, error } = await companyService.create({
    owner_profile_id: user.id,
    name,
    description: description || null,
    contact_email: contact_email || null,
    contact_phone: contact_phone || null,
    location: location || null,
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
