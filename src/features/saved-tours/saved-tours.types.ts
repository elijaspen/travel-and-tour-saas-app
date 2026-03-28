import { Database } from "@supabase/types/database"

export type SavedTour = Database['public']['Tables']['user_saved_tours']['Row']

export type SavedTourWithDetails = SavedTour & {
    tour: Database['public']['Tables']['tours']['Row'] & {
        photos: { file_url: string; sort_order: number }[]
        prices: { amount: number, currency: string}[]
    }
}