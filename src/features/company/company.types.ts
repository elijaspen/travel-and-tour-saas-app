import { Tables } from "@supabase/types/database"
import { TableRow, TableInsert, TableUpdate } from "@/features/shared/supabase-service"

export type Company = TableRow<"companies">
export type CompanyInsert = TableInsert<"companies">
export type CompanyUpdate = TableUpdate<"companies">
export type CompanyStatus = Tables<"companies">["status"]

export const CompanyStatuses = {
  PENDING: "pending",
  APPROVED: "approved",
  DECLINED: "declined",
  SUSPENDED: "suspended",
} as const satisfies Record<string, CompanyStatus>
