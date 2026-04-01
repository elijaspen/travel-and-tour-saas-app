import { redirect } from "next/navigation"
import { ROUTE_PATHS } from "@/config/routes"
import { getNavConfig } from "@/config/navigation"
import { profileService } from "@/modules/profile/profile.service"
import type { Profile, ProfileRole } from "@/modules/profile/profile.types"

export type RoleGuardResult = {
  profile: Profile
}

export async function requireRole(allowedRoles: ProfileRole[]): Promise<RoleGuardResult> {
  const { data: profile, error } = await profileService.getCurrentProfile()

  if (error || !profile) {
    redirect(ROUTE_PATHS.PUBLIC.AUTH.LOGIN)
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect(getNavConfig(profile.role).home)
  }

  return { profile }
}
