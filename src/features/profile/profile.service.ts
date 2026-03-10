import { Tables } from "@supabase/types/database"
import { createClient as createServerClient } from "@supabase/utils/server"
import { createAdminClient } from "@supabase/utils/admin"
import {
  supabaseService,
  ServiceResult,
  TableInsert,
  TableRow,
  TableUpdate,
} from "@/features/shared/supabase-service"
import { User } from "@supabase/supabase-js"

export type Profile = TableRow<"profiles">
export type ProfileInsert = TableInsert<"profiles">
export type ProfileUpdate = TableUpdate<"profiles">
export type ProfileRole = Tables<"profiles">['role']

export const ProfileRoles = {
  CUSTOMER: "customer",
  BUSINESS_OWNER: "business_owner",
  AGENT: "agent",
  ADMIN: "admin",
} as const satisfies Record<string, ProfileRole>

type SignUpInput = {
  email: string
  password: string
  profile: Omit<ProfileInsert, "id">
}

type LoginInput = {
  email: string
  password: string
}

const base = supabaseService("profiles")

export const profileService = {
  ...base,

  async loginWithPassword(
    input: LoginInput,
  ): Promise<ServiceResult<User>> {
    const supabase = await createServerClient()
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    return { data: signInData?.user as User | null, error }
  },

  async signUp(
    input: SignUpInput,
  ): Promise<ServiceResult<Profile>> {
    const supabase = await createServerClient()

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    })

    if (signUpError || !signUpData?.user?.id) {
      return { data: null, error: signUpError ?? new Error("User signup failed") }
    }

    const userId = signUpData.user.id

    const profilePayload: ProfileInsert = {
      ...input.profile,
      id: userId,
    }

    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .insert(profilePayload as ProfileInsert)
      .select()
      .single()

    if (profileError || !profile) {
      return { data: null, error: profileError ?? new Error("Profile creation failed") }
    }

    return {
      data: profile,
      error: null,
    }
  },
}