export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      customer_leads: {
        Row: {
          address: string
          city: string
          country: string | null
          coupon_code: string | null
          created_at: string
          full_name: string
          id: string
          notes: string | null
          notified: boolean
          phone: string
          product_id: string | null
          product_name: string | null
          product_price: string | null
          quantity: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          city: string
          country?: string | null
          coupon_code?: string | null
          created_at?: string
          full_name: string
          id?: string
          notes?: string | null
          notified?: boolean
          phone: string
          product_id?: string | null
          product_name?: string | null
          product_price?: string | null
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string | null
          coupon_code?: string | null
          created_at?: string
          full_name?: string
          id?: string
          notes?: string | null
          notified?: boolean
          phone?: string
          product_id?: string | null
          product_name?: string | null
          product_price?: string | null
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          lang: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          lang?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          lang?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminder_settings: {
        Row: {
          evening_time: string
          hydration_enabled: boolean
          hydration_interval_min: number
          morning_time: string
          notifications_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          evening_time?: string
          hydration_enabled?: boolean
          hydration_interval_min?: number
          morning_time?: string
          notifications_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          evening_time?: string
          hydration_enabled?: boolean
          hydration_interval_min?: number
          morning_time?: string
          notifications_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      routine_days: {
        Row: {
          day: string
          id: string
          mood: string | null
          steps_done: number
          steps_total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          day?: string
          id?: string
          mood?: string | null
          steps_done?: number
          steps_total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          day?: string
          id?: string
          mood?: string | null
          steps_done?: number
          steps_total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: []
      }
      store_products: {
        Row: {
          active: boolean
          base_cost: number
          category: string | null
          created_at: string
          currency: string
          description: string | null
          external_id: string
          id: string
          image_url: string | null
          in_stock: boolean
          name: string
          price: number
          regions: string[]
          source: string
          tags: string[]
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          base_cost?: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          external_id: string
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name: string
          price?: number
          regions?: string[]
          source: string
          tags?: string[]
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          base_cost?: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          external_id?: string
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name?: string
          price?: number
          regions?: string[]
          source?: string
          tags?: string[]
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      store_sync_runs: {
        Row: {
          created_at: string
          id: string
          items_synced: number
          message: string | null
          ok: boolean
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          items_synced?: number
          message?: string | null
          ok?: boolean
          source: string
        }
        Update: {
          created_at?: string
          id?: string
          items_synced?: number
          message?: string | null
          ok?: boolean
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
