import { redirect } from "next/navigation"
import { ROUTE_PATHS } from "@/config/routes"
import { profileService } from "./profile.service"
import type { Profile, ProfileRole } from "./profile.types"

export type RoleGuardResult = {
  profile: Profile
}

export async function requireRole(allowedRoles: ProfileRole[]): Promise<RoleGuardResult> {
  const { data: profile, error } = await profileService.getCurrentProfile()

  if (error || !profile) {
    redirect(ROUTE_PATHS.PUBLIC.AUTH.LOGIN)
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect(ROUTE_PATHS.AUTHED.SHARED.DASHBOARD)
  }

  return { profile }
}

