import { createClient as createServerClient } from "@supabase/utils/server"
import type { ServiceResult } from "./supabase-service"

export function buildStoragePath(folder: string, file: File): string {
  const extRaw = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const ext = extRaw.replace(/[^a-z0-9]/g, "") || "bin"
  return `${folder}/${globalThis.crypto.randomUUID()}.${ext}`
}

export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
): Promise<ServiceResult<{ path: string; publicUrl: string }>> {
  const supabase = await createServerClient()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) return { data: null, error }
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path)
  return { data: { path, publicUrl: pub.publicUrl }, error: null }
}
