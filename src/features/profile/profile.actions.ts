"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import {
  profileLoginSchema,
  signupFormSchema,
  forgotPasswordSchema,
  profileUpdateSchema,
  type SignupFormValues,
  type LoginPayload,
  type ForgotPasswordPayload,
  type ProfileUpdatePayload,
} from "./profile.validation"
import type { ActionResult } from "@/features/shared/types"
import { ROUTE_PATHS } from "@/config/routes"
import { profileService } from "./profile.service"
import { Profile, ProfileRole } from "./profile.types"
import { createClient as createSupabaseServerClient } from "@supabase/utils/server"

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


export async function signUpAction(
  values: SignupFormValues,
  role: ProfileRole,
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

export async function requestPasswordResetAction(
  values: ForgotPasswordPayload,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createSupabaseServerClient()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    return {
      success: false,
      message:
        "Password reset is temporarily unavailable. Please contact support or try again later (missing app URL configuration).",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const redirectTo = new URL(ROUTE_PATHS.PUBLIC.AUTH.RESET_PASSWORD, baseUrl).toString()

  console.log("redirectTo", redirectTo)
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo,
  })

  if (error) {
    return {
      success: false,
      message: "We couldn't send a reset link right now. Please try again in a few minutes.",
    }
  }

  return {
    success: true,
    message: "If that email is registered, we've sent a password reset link.",
  }
}

export async function updateProfileAction(
  values: ProfileUpdatePayload,
): Promise<ActionResult<Profile>> {
  const parsed = profileUpdateSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors
    return { success: false, fieldErrors }
  }

  const patch = {
    full_name: parsed.data.fullName,
    phone: parsed.data.phone || null,
    emergency_contact: parsed.data.emergencyContact || null,
  }

  const { data, error } = await profileService.updateCurrentProfile(patch)

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Could not update profile. Please try again."
    return { success: false, message }
  }

  return { success: true, data }
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect(ROUTE_PATHS.PUBLIC.AUTH.LOGIN)
}
