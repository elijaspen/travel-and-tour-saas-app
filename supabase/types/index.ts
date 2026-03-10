import { Database } from "./database";

export type { Database, Json } from "./database";

// Add common type definitions here
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Enum-like helpers derived from Database types
export type UserRole =
  import("./database").Database["public"]["Enums"]["user_role"];
export type ProfileStatus =
  import("./database").Database["public"]["Enums"]["profile_status"];

export const UserRoles = {
  CUSTOMER: "customer",
  BUSINESS_OWNER: "business_owner",
  AGENT: "agent",
  ADMIN: "admin",
} as const satisfies Record<string, UserRole>;

export const ProfileStatuses = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
} as const satisfies Record<string, ProfileStatus>;

// Auth-oriented subset of roles used by the app today
export type AuthRole = Extract<
  UserRole,
  (typeof UserRoles)["CUSTOMER"] | (typeof UserRoles)["BUSINESS_OWNER"]
>;

export const AuthRoles = {
  CUSTOMER: UserRoles.CUSTOMER,
  BUSINESS_OWNER: UserRoles.BUSINESS_OWNER,
} as const satisfies Record<string, AuthRole>;
