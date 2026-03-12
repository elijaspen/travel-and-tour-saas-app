import { createClient } from "@supabase/supabase-js";
import { Database } from "@supabase/types";
import { getSupabaseAdminEnv } from "./config";

export function createAdminClient() {
 const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return createClient<Database>(url!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

