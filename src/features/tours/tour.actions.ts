"use server";

import { z } from "zod";
import { createClient as createServerClient } from "@supabase/utils/server";

import { companyService } from "@/features/company/company.service";
import type { ActionResult } from "@/features/shared/types";
import { createTourSchema } from "@/features/tours/tour.validation";
import { tourService } from "@/features/tours/tour.service";

export async function createTourAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "You must be logged in." };
  }

  const { data: company } = await companyService.getCompanyByOwner(user.id);
  if (!company) {
    return {
      success: false,
      message: "Only business owners with a company can create tours.",
    };
  }

  const rawJson = formData.get("payload");
  if (typeof rawJson !== "string") {
    return { success: false, message: "Invalid form data." };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch {
    return { success: false, message: "Invalid JSON payload." };
  }

  const validated = createTourSchema.safeParse(parsedJson);
  if (!validated.success) {
    return { success: false, fieldErrors: z.flattenError(validated.error).fieldErrors };
  }

  const files = formData
    .getAll("photo")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const { data, error } = await tourService.createWithChildren({
    companyId: company.id,
    payload: validated.data,
    photoFiles: files,
  });

  if (error || !data) {
    const message =
      error instanceof Error ? error.message : "Could not create tour. Please try again.";
    return { success: false, message };
  }

  return { success: true, data };
}
