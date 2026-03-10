"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import {
  profileLoginSchema,
  customerSignupFormSchema,
  agencySignupFormSchema,
  type CustomerSignupFormValues,
  type AgencySignupFormValues,
  LoginPayload,
} from "./profile.validation"
import type { ActionResult } from "@/features/shared/types"
import { ROUTE_PATHS } from "@/config/routes"
import { profileService } from "./profile.service"
import { Profile, ProfileRoles } from "./profile.types"

export async function loginAction(values: LoginPayload): Promise<ActionResult> {

  const parsed = profileLoginSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { data: user, error } = await profileService.loginWithPassword(parsed.data)

  if (error || !user) {
    return { success: false, message: "Invalid email or password. Please try again." }
  }

  redirect(ROUTE_PATHS.AUTHED.SHARED.DASHBOARD)
}

export async function signUpCustomerAction(values: CustomerSignupFormValues): Promise<ActionResult<Profile>> {
  const parsed = customerSignupFormSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors
    return { success: false, fieldErrors }
  }

  const { data, error } = await profileService.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    profile: {
      full_name: parsed.data.fullName,
      role: ProfileRoles.CUSTOMER,
    },
  })

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Signup failed. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}

export async function signUpAgencyAction(values: AgencySignupFormValues): Promise<ActionResult<Profile>> {
  const parsed = agencySignupFormSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors
    return { success: false, fieldErrors }
  }

  const { data, error } = await profileService.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    profile: {
      full_name: parsed.data.contactPerson,
      role: ProfileRoles.BUSINESS_OWNER,
      phone: parsed.data.phone ?? null,
    },
  })

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Signup failed. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}
