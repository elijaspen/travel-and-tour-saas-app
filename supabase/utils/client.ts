"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@supabase/types";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createBrowserClient<Database>(url!, anonKey!);
}
