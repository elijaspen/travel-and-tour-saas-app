import { Tables } from "@supabase/types/database"
import { TableRow, TableInsert, TableUpdate } from "@/modules/shared/supabase-service"

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