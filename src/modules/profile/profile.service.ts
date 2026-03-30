import { createClient as createServerClient } from "@supabase/utils/server"
import { createAdminClient } from "@supabase/utils/admin"
import {
  supabaseService,
  ServiceResult,
} from "@/modules/shared/supabase-service"
import { User } from "@supabase/supabase-js"
import type { Profile, ProfileInsert, ProfileUpdate } from "@/modules/profile/profile.types"

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
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
      },
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

  async getCurrentProfile(): Promise<ServiceResult<Profile>> {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { data: null, error: userError ?? new Error("Not authenticated") }
    }

    const { data, error } = await base.getById(user.id)
    return { data: (data ?? null) as Profile | null, error }
  },

  async updateCurrentProfile(
    patch: Pick<ProfileUpdate, "full_name" | "phone" | "emergency_contact">,
  ): Promise<ServiceResult<Profile>> {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { data: null, error: userError ?? new Error("Not authenticated") }
    }

    const { data, error } = await base.patch(user.id, patch)
    return { data: (data ?? null) as Profile | null, error }
  },
}