"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@supabase/types";
import { getSupabaseEnv } from "./config";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
