import { createClient } from "@supabase/supabase-js";
import { Database } from "@supabase/types";
import { getSupabaseAdminEnv } from "./config";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

