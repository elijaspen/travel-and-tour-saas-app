import { createClient as createServerClient } from "@supabase/utils/server";
import { supabaseService, type ServiceResult, type TableRow } from "@/features/shared/supabase-service";
import type { SavedTourWithDetails } from "./saved-tours.types";

const base = supabaseService("user_saved_tours");

export const savedToursService = {
    ...base,

    async isTourSaved(userId: string, tourId: string): Promise<boolean> {
        const supabase = await createServerClient();
        const { data } = await supabase
            .from("user_saved_tours")
            .select("id")
            .eq("user_id", userId)
            .eq("tour_id", tourId)
            .maybeSingle();

        return !!data;
    },

    async getSavedTours(userId: string): Promise<ServiceResult<SavedTourWithDetails[]>> {
        const supabase = await createServerClient()

        const { data, error } = await supabase
        .from("user_saved_tours")
        .select(`
         *,
        tour:tours (
            *,
            photos:tour_photos(file_url, sort_order),
            prices:tour_prices(amount, currency)
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

        return { data: (data ?? []) as SavedTourWithDetails[], error}
            
    }
}