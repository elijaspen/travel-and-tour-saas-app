"use server"

import { createClient as createServerClient } from "@supabase/utils/server";
import { savedToursService } from "./saved-tours.service";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/features/shared/types";

export async function toggleSaveTourAction(
    tourId: string
): Promise<ActionResult<{ isSaved: boolean }>> {

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "You must be logged in to save tours." };
    }

    try {
        const isSaved = await savedToursService.isTourSaved(user.id, tourId);

        if (isSaved) {
            await supabase
                .from("user_saved_tours")
                .delete()
                .eq("user_id", user.id)
                .eq("tour_id", tourId);
        } else {
            await savedToursService.create({ user_id: user.id, tour_id: tourId });
        }

        revalidatePath("/explore", "page");
        revalidatePath("/saved", "page");

        return {
            success: true,
            data: { isSaved: !isSaved },
            message: !isSaved ? "Tour saved to your list!" : "Tour removed from your list."
        }
    } catch (error) {
        console.error("Action Error:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again."
        }
    }
}