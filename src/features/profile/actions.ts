"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { profileService, type Profile } from "./profile.service"
import {
  profileLoginSchema,
  customerSignupFormSchema,
  agencySignupFormSchema,
} from "./profile.validation"
import type { ActionResult } from "@/features/shared/types"
import { ROUTE_PATHS } from "@/config/routes"

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

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

export async function signUpCustomerAction(
  _prevState: ActionResult<Profile>,
  formData: FormData,
): Promise<ActionResult<Profile>> {
  const values = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  const parsed = customerSignupFormSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { data, error } = await profileService.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    profile: {
      full_name: parsed.data.fullName,
      role: "customer",
    },
  })

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Signup failed. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}

export async function signUpAgencyAction(
  _prevState: ActionResult<Profile>,
  formData: FormData,
): Promise<ActionResult<Profile>> {
  const values = {
    agencyName: formData.get("agencyName") as string,
    contactPerson: formData.get("contactPerson") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  const parsed = agencySignupFormSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { data, error } = await profileService.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    profile: {
      full_name: parsed.data.contactPerson,
      role: "business_owner",
      phone: parsed.data.phone ?? null,
    },
  })

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Signup failed. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}
