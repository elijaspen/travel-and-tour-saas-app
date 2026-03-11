"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { profileLoginSchema, signupFormSchema, type SignupFormValues, LoginPayload } from "./profile.validation"
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

type SignupRole = (typeof ProfileRoles)["CUSTOMER" | "BUSINESS_OWNER"]

export async function signUpAction(
  values: SignupFormValues,
  role: SignupRole,
): Promise<ActionResult<Profile>> {
  const parsed = signupFormSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors
    return { success: false, fieldErrors }
  }

  const { data, error } = await profileService.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    profile: {
      full_name: parsed.data.fullName,
      role,
    },
  })

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Signup failed. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}
