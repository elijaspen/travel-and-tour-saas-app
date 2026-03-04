// This file is a placeholder for Supabase generated types.
// To generate types, run:
// npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
//
// Or if using local development:
// npx supabase gen types typescript --local > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          company_id: string;
          created_at: string | null;
          customer_id: string;
          id: string;
          passenger_count: number;
          status: Database["public"]["Enums"]["booking_status"] | null;
          total_amount: number;
          tour_date_id: string;
          tour_id: string;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          customer_id: string;
          id?: string;
          passenger_count: number;
          status?: Database["public"]["Enums"]["booking_status"] | null;
          total_amount: number;
          tour_date_id: string;
          tour_id: string;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          customer_id?: string;
          id?: string;
          passenger_count?: number;
          status?: Database["public"]["Enums"]["booking_status"] | null;
          total_amount?: number;
          tour_date_id?: string;
          tour_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_tour_date_id_fkey";
            columns: ["tour_date_id"];
            isOneToOne: false;
            referencedRelation: "tour_dates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          },
        ];
      };
      bookmarks: {
        Row: {
          created_at: string | null;
          id: string;
          tour_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          tour_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          tour_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      companies: {
        Row: {
          created_at: string | null;
          id: string;
          is_suspended: boolean | null;
          name: string;
          owner_id: string;
          permits_url: string | null;
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_suspended?: boolean | null;
          name: string;
          owner_id: string;
          permits_url?: string | null;
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_suspended?: boolean | null;
          name?: string;
          owner_id?: string;
          permits_url?: string | null;
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null;
        };
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      company_agent: {
        Row: {
          company_id: string;
          id: string;
          is_active: boolean | null;
          user_id: string;
        };
        Insert: {
          company_id: string;
          id?: string;
          is_active?: boolean | null;
          user_id: string;
        };
        Update: {
          company_id?: string;
          id?: string;
          is_active?: boolean | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_agent_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_agent_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          booking_id: string;
          created_at: string | null;
          id: string;
          method: string;
          proof_url: string | null;
          status: Database["public"]["Enums"]["payment_status"] | null;
        };
        Insert: {
          amount: number;
          booking_id: string;
          created_at?: string | null;
          id?: string;
          method: string;
          proof_url?: string | null;
          status?: Database["public"]["Enums"]["payment_status"] | null;
        };
        Update: {
          amount?: number;
          booking_id?: string;
          created_at?: string | null;
          id?: string;
          method?: string;
          proof_url?: string | null;
          status?: Database["public"]["Enums"]["payment_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      promos: {
        Row: {
          company_id: string;
          discount_type: Database["public"]["Enums"]["discount_type"];
          discount_value: number;
          end_date: string;
          id: string;
          is_active: boolean | null;
          max_uses: number | null;
          promo_code: string;
          start_date: string;
          times_used: number | null;
          tour_id: string | null;
        };
        Insert: {
          company_id: string;
          discount_type: Database["public"]["Enums"]["discount_type"];
          discount_value: number;
          end_date: string;
          id?: string;
          is_active?: boolean | null;
          max_uses?: number | null;
          promo_code: string;
          start_date: string;
          times_used?: number | null;
          tour_id?: string | null;
        };
        Update: {
          company_id?: string;
          discount_type?: Database["public"]["Enums"]["discount_type"];
          discount_value?: number;
          end_date?: string;
          id?: string;
          is_active?: boolean | null;
          max_uses?: number | null;
          promo_code?: string;
          start_date?: string;
          times_used?: number | null;
          tour_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "promos_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promos_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          agent_reply: string | null;
          created_at: string | null;
          customer_comment: string | null;
          customer_id: string;
          id: string;
          is_hidden: boolean | null;
          star_rating: number | null;
          tour_id: string;
        };
        Insert: {
          agent_reply?: string | null;
          created_at?: string | null;
          customer_comment?: string | null;
          customer_id: string;
          id?: string;
          is_hidden?: boolean | null;
          star_rating?: number | null;
          tour_id: string;
        };
        Update: {
          agent_reply?: string | null;
          created_at?: string | null;
          customer_comment?: string | null;
          customer_id?: string;
          id?: string;
          is_hidden?: boolean | null;
          star_rating?: number | null;
          tour_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"];
          company_id: string;
          current_period_end: string;
          id: string;
          membership_type: Database["public"]["Enums"]["membership_type"];
          tour_limit: number;
          trial_ends_at: string | null;
        };
        Insert: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"];
          company_id: string;
          current_period_end: string;
          id?: string;
          membership_type: Database["public"]["Enums"]["membership_type"];
          tour_limit?: number;
          trial_ends_at?: string | null;
        };
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"];
          company_id?: string;
          current_period_end?: string;
          id?: string;
          membership_type?: Database["public"]["Enums"]["membership_type"];
          tour_limit?: number;
          trial_ends_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: true;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      tour_dates: {
        Row: {
          booked_slots: number | null;
          id: string;
          status: Database["public"]["Enums"]["tour_date_status"] | null;
          target_date: string;
          tour_id: string;
        };
        Insert: {
          booked_slots?: number | null;
          id?: string;
          status?: Database["public"]["Enums"]["tour_date_status"] | null;
          target_date: string;
          tour_id: string;
        };
        Update: {
          booked_slots?: number | null;
          id?: string;
          status?: Database["public"]["Enums"]["tour_date_status"] | null;
          target_date?: string;
          tour_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tour_dates_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          },
        ];
      };
      tour_faqs: {
        Row: {
          answer: string;
          id: string;
          question: string;
          tour_id: string;
        };
        Insert: {
          answer: string;
          id?: string;
          question: string;
          tour_id: string;
        };
        Update: {
          answer?: string;
          id?: string;
          question?: string;
          tour_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tour_faqs_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          },
        ];
      };
      tours: {
        Row: {
          company_id: string;
          created_at: string | null;
          description: string;
          id: string;
          is_featured: boolean | null;
          is_published: boolean | null;
          max_slots: number;
          price: number;
          title: string;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          description: string;
          id?: string;
          is_featured?: boolean | null;
          is_published?: boolean | null;
          max_slots: number;
          price: number;
          title: string;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          description?: string;
          id?: string;
          is_featured?: boolean | null;
          is_published?: boolean | null;
          max_slots?: number;
          price?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tours_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          first_name: string;
          id: string;
          is_suspended: boolean | null;
          last_name: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string | null;
          email: string;
          first_name: string;
          id: string;
          is_suspended?: boolean | null;
          last_name: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          is_suspended?: boolean | null;
          last_name?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      billing_cycle: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
      booking_status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
      discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
      membership_type: "BASIC" | "PREMIUM" | "VIP";
      payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
      tour_date_status: "AVAILABLE" | "FULLY_BOOKED" | "CANCELED";
      user_role: "ADMIN" | "BUSINESS_OWNER" | "AGENT" | "REGULAR_CUSTOMER";
      verification_status: "PENDING" | "APPROVED" | "REJECTED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      billing_cycle: ["MONTHLY", "QUARTERLY", "ANNUALLY"],
      booking_status: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"],
      discount_type: ["PERCENTAGE", "FIXED_AMOUNT"],
      membership_type: ["BASIC", "PREMIUM", "VIP"],
      payment_status: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      tour_date_status: ["AVAILABLE", "FULLY_BOOKED", "CANCELED"],
      user_role: ["ADMIN", "BUSINESS_OWNER", "AGENT", "REGULAR_CUSTOMER"],
      verification_status: ["PENDING", "APPROVED", "REJECTED"],
    },
  },
} as const;
