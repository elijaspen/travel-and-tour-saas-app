export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blackout_dates: {
        Row: {
          end_date: string
          id: string
          reason: string | null
          start_date: string
          tour_id: string
        }
        Insert: {
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          tour_id: string
        }
        Update: {
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blackout_dates_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_profile_id: string
          id: string
          participant_count: number
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          tour_id: string
          travel_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_profile_id: string
          id?: string
          participant_count: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          tour_id: string
          travel_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_profile_id?: string
          id?: string
          participant_count?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          tour_id?: string
          travel_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_profile_id_fkey"
            columns: ["customer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          owner_profile_id: string
          permit_url: string | null
          status: Database["public"]["Enums"]["company_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          owner_profile_id: string
          permit_url?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          owner_profile_id?: string
          permit_url?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          emergency_contact: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          emergency_contact?: string | null
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          emergency_contact?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          customer_profile_id: string
          id: string
          rating: number
          tour_id: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          customer_profile_id: string
          id?: string
          rating: number
          tour_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          customer_profile_id?: string
          id?: string
          rating?: number
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_profile_id_fkey"
            columns: ["customer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_categories: {
        Row: {
          category_id: string
          created_at: string
          tour_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          tour_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_categories_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_itineraries: {
        Row: {
          day_number: number
          description: string | null
          id: string
          image_url: string | null
          start_time: string | null
          title: string
          tour_id: string
        }
        Insert: {
          day_number: number
          description?: string | null
          id?: string
          image_url?: string | null
          start_time?: string | null
          title: string
          tour_id: string
        }
        Update: {
          day_number?: number
          description?: string | null
          id?: string
          image_url?: string | null
          start_time?: string | null
          title?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_itineraries_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_photos: {
        Row: {
          file_url: string
          id: string
          sort_order: number
          tour_id: string
        }
        Insert: {
          file_url: string
          id?: string
          sort_order?: number
          tour_id: string
        }
        Update: {
          file_url?: string
          id?: string
          sort_order?: number
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_photos_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_prices: {
        Row: {
          amount: number
          currency: string
          id: string
          max_pax: number | null
          min_pax: number
          tour_id: string
        }
        Insert: {
          amount: number
          currency: string
          id?: string
          max_pax?: number | null
          min_pax: number
          tour_id: string
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          max_pax?: number | null
          min_pax?: number
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_prices_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          address_line: string | null
          city: string | null
          company_id: string
          country_code: string | null
          created_at: string
          default_capacity: number | null
          description: string
          duration_days: number | null
          exclusions: string[]
          id: string
          inclusions: string[]
          is_active: boolean
          latitude: number | null
          longitude: number | null
          max_simultaneous_bookings: number | null
          place_id: string | null
          postal_code: string | null
          province_state: string | null
          short_description: string | null
          slug: string
          tags: string[]
          title: string
          tour_type: Database["public"]["Enums"]["tour_type"]
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          company_id: string
          country_code?: string | null
          created_at?: string
          default_capacity?: number | null
          description: string
          duration_days?: number | null
          exclusions?: string[]
          id?: string
          inclusions?: string[]
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          max_simultaneous_bookings?: number | null
          place_id?: string | null
          postal_code?: string | null
          province_state?: string | null
          short_description?: string | null
          slug: string
          tags?: string[]
          title: string
          tour_type?: Database["public"]["Enums"]["tour_type"]
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          company_id?: string
          country_code?: string | null
          created_at?: string
          default_capacity?: number | null
          description?: string
          duration_days?: number | null
          exclusions?: string[]
          id?: string
          inclusions?: string[]
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          max_simultaneous_bookings?: number | null
          place_id?: string | null
          postal_code?: string | null
          province_state?: string | null
          short_description?: string | null
          slug?: string
          tags?: string[]
          title?: string
          tour_type?: Database["public"]["Enums"]["tour_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_tours: {
        Row: {
          created_at: string
          id: string
          tour_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tour_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tour_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_tours_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_company_status_counts: {
        Args: never
        Returns: {
          count: number
          status: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      booking_status:
        | "pending_payment"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "cancellation_requested"
      company_status: "pending" | "approved" | "declined" | "suspended"
      profile_status: "active" | "suspended"
      tour_type: "on_demand" | "fixed_schedule"
      user_role: "customer" | "business_owner" | "agent" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: [
        "pending_payment",
        "confirmed",
        "completed",
        "cancelled",
        "cancellation_requested",
      ],
      company_status: ["pending", "approved", "declined", "suspended"],
      profile_status: ["active", "suspended"],
      tour_type: ["on_demand", "fixed_schedule"],
      user_role: ["customer", "business_owner", "agent", "admin"],
    },
  },
} as const

