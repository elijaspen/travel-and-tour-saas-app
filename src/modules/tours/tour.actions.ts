"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@supabase/utils/server";

import { companyService } from "@/modules/company/company.service";
import type { ActionResult } from "@/modules/shared/types";
import {
  createTourCommandSchema,
  updateTourCommandSchema,
} from "@/modules/tours/tour.validation";
import { tourService } from "@/modules/tours/tour.service";

async function getAuthenticatedCompany() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, error: "You must be logged in." };
  }

  const { data: company } = await companyService.getCompanyByOwner(user.id);
  if (!company) {
    return { ok: false as const, error: "Only business owners with a company can manage tours." };
  }

  return { ok: true as const, userId: user.id, companyId: company.id };
}

function parseFormDataPayload(formData: FormData) {
  const rawJson = formData.get("payload");
  if (typeof rawJson !== "string") {
    return { ok: false as const, error: "Invalid form data." };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch {
    return { ok: false as const, error: "Invalid JSON payload." };
  }

  const files = formData
    .getAll("photo")
    .filter((f): f is File => f instanceof File && f.size > 0);

  return { ok: true as const, parsed: parsedJson, files };
}

export async function createTourAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const auth = await getAuthenticatedCompany();
  if (!auth.ok) return { success: false, message: auth.error };

  const payload = parseFormDataPayload(formData);
  if (!payload.ok) return { success: false, message: payload.error };
  const { parsed, files } = payload;

  const validated = createTourCommandSchema.safeParse(parsed);
  if (!validated.success) {
    return { success: false, fieldErrors: z.flattenError(validated.error).fieldErrors };
  }

  const { data, error } = await tourService.createWithChildren({
    companyId: auth.companyId,
    command: validated.data,
    photoFiles: files,
  });

  if (error || !data) {
    const message =
      error instanceof Error ? error.message : "Could not create tour. Please try again.";
    return { success: false, message };
  }

  return { success: true, data };
}

export async function updateTourAction(
  tourId: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await getAuthenticatedCompany();
  if (!auth.ok) return { success: false, message: auth.error };

  const { data: existing } = await tourService.getTourWithDetails(tourId);
  if (!existing || existing.company_id !== auth.companyId) {
    return { success: false, message: "Tour not found or you do not have permission." };
  }

  const payload = parseFormDataPayload(formData);
  if (!payload.ok) return { success: false, message: payload.error };
  const { parsed, files } = payload;

  const validated = updateTourCommandSchema.safeParse(parsed);
  if (!validated.success) {
    return { success: false, fieldErrors: z.flattenError(validated.error).fieldErrors };
  }

  const { data, error } = await tourService.updateWithChildren({
    tourId,
    companyId: auth.companyId,
    command: validated.data,
    newPhotoFiles: files,
  });

  if (error || !data) {
    const message =
      error instanceof Error ? error.message : "Could not update tour. Please try again.";
    return { success: false, message };
  }

  return { success: true, data };
}

export async function toggleTourActiveAction(tourId: string): Promise<ActionResult<{ id: string }>> {
  const auth = await getAuthenticatedCompany();
  if (!auth.ok) return { success: false, message: auth.error };

  const { data: existing } = await tourService.getTourWithDetails(tourId);
  if (!existing || existing.company_id !== auth.companyId) {
    return { success: false, message: "Tour not found or you do not have permission." };
  }

  const newActive = !existing.is_active;
  const { data, error } = await tourService.toggleActive(tourId, newActive);

  if (error || !data) {
    const message =
      error instanceof Error ? error.message : "Could not update tour status.";
    return { success: false, message };
  }

  revalidatePath("/agency/tours");
  return { success: true, data };
}
