type SupabaseEnv = {
  url: string;
  anonKey: string;
};

type SupabaseAdminEnv = SupabaseEnv & {
  serviceRoleKey: string;
};

export enum SupabaseEnvVar {
  PUBLIC_URL = "NEXT_PUBLIC_SUPABASE_URL",
  PUBLIC_ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  SERVICE_ROLE_KEY = "SUPABASE_SERVICE_ROLE_KEY",
}

function requireEnv(name: SupabaseEnvVar) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required Supabase environment variable: ${name}`
    );
  }
  return value;
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = requireEnv(SupabaseEnvVar.PUBLIC_URL);
  const anonKey = requireEnv(SupabaseEnvVar.PUBLIC_ANON_KEY);

  try {
    new URL(url);
  } catch {
    throw new Error(
      "Invalid NEXT_PUBLIC_SUPABASE_URL: expected a valid absolute URL"
    );
  }

  return { url, anonKey };
}

export function getSupabaseAdminEnv(): SupabaseAdminEnv {
  const base = getSupabaseEnv();
  const serviceRoleKey = requireEnv(SupabaseEnvVar.SERVICE_ROLE_KEY);

  return { ...base, serviceRoleKey };
}
