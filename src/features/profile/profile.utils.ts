import type { Profile } from "./profile.types"

const ROLE_LABELS: Record<Profile["role"], string> = {
  customer: "Traveler",
  business_owner: "Business Owner",
  agent: "Premier Agent",
  admin: "Administrator",
}

export function getUserInitials(fullName: string | null | undefined): string {
  const name = fullName?.trim()

  if (!name) {
    return "U"
  }

  const parts = name.split(/\s+/).filter(Boolean)

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase()
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]!)
    .join("")
    .toUpperCase()
}

export function getRoleLabel(role: Profile["role"]): string {
  return ROLE_LABELS[role] ?? role
}

