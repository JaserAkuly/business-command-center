export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          action_data: Json | null
          business_date: string
          category: Database["public"]["Enums"]["insight_category"]
          created_at: string | null
          id: string
          message: string
          severity: Database["public"]["Enums"]["insight_severity"] | null
          venue_id: string
        }
        Insert: {
          action_data?: Json | null
          business_date: string
          category: Database["public"]["Enums"]["insight_category"]
          created_at?: string | null
          id?: string
          message: string
          severity?: Database["public"]["Enums"]["insight_severity"] | null
          venue_id: string
        }
        Update: {
          action_data?: Json | null
          business_date?: string
          category?: Database["public"]["Enums"]["insight_category"]
          created_at?: string | null
          id?: string
          message?: string
          severity?: Database["public"]["Enums"]["insight_severity"] | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_envelope_tx: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          envelope_id: string
          id: string
          transaction_date: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          envelope_id: string
          id?: string
          transaction_date: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          envelope_id?: string
          id?: string
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_envelope_tx_envelope_id_fkey"
            columns: ["envelope_id"]
            isOneToOne: false
            referencedRelation: "cash_envelopes"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_envelopes: {
        Row: {
          created_at: string | null
          current_balance: number | null
          id: string
          name: string
          target_pct: number
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          current_balance?: number | null
          id?: string
          name: string
          target_pct: number
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          current_balance?: number | null
          id?: string
          name?: string
          target_pct?: number
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_envelopes_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          enabled_for_premium: boolean | null
          enabled_for_starter: boolean | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled_for_premium?: boolean | null
          enabled_for_starter?: boolean | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled_for_premium?: boolean | null
          enabled_for_starter?: boolean | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      growth_goals: {
        Row: {
          created_at: string | null
          estimated_cost_per_unit: number
          horizon_years: number
          id: string
          org_id: string
          start_date: string
          target_units: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_cost_per_unit: number
          horizon_years: number
          id?: string
          org_id: string
          start_date: string
          target_units: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_cost_per_unit?: number
          horizon_years?: number
          id?: string
          org_id?: string
          start_date?: string
          target_units?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_goals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_counts: {
        Row: {
          business_date: string
          created_at: string | null
          id: string
          notes: string | null
          on_hand: number
          sku_id: string
          waste: number
        }
        Insert: {
          business_date: string
          created_at?: string | null
          id?: string
          notes?: string | null
          on_hand?: number
          sku_id: string
          waste?: number
        }
        Update: {
          business_date?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          on_hand?: number
          sku_id?: string
          waste?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_counts_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
        ]
      }
      orgs: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          id: string
          name: string
          price_monthly: number | null
          type: Database["public"]["Enums"]["plan_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          price_monthly?: number | null
          type: Database["public"]["Enums"]["plan_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          price_monthly?: number | null
          type?: Database["public"]["Enums"]["plan_type"]
        }
        Relationships: []
      }
      po_lines: {
        Row: {
          created_at: string | null
          id: string
          line_total: number
          po_id: string
          quantity: number
          sku_id: string
          unit_cost: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          line_total: number
          po_id: string
          quantity: number
          sku_id: string
          unit_cost: number
        }
        Update: {
          created_at?: string | null
          id?: string
          line_total?: number
          po_id?: string
          quantity?: number
          sku_id?: string
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "po_lines_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_lines_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sales_daily: {
        Row: {
          business_date: string
          check_count: number
          cogs_food: number
          cogs_liquor: number
          comps: number
          created_at: string | null
          discounts: number
          gross_sales: number
          guests: number
          id: string
          labor_cost: number
          labor_hours: number
          net_sales: number
          tax_collected: number
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          business_date: string
          check_count?: number
          cogs_food?: number
          cogs_liquor?: number
          comps?: number
          created_at?: string | null
          discounts?: number
          gross_sales?: number
          guests?: number
          id?: string
          labor_cost?: number
          labor_hours?: number
          net_sales?: number
          tax_collected?: number
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          business_date?: string
          check_count?: number
          cogs_food?: number
          cogs_liquor?: number
          comps?: number
          created_at?: string | null
          discounts?: number
          gross_sales?: number
          guests?: number
          id?: string
          labor_cost?: number
          labor_hours?: number
          net_sales?: number
          tax_collected?: number
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_sales_daily_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          order_date: string
          status: string | null
          total_cost: number | null
          updated_at: string | null
          vendor_name: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date: string
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
          vendor_name?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
          vendor_name?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      roles_wages: {
        Row: {
          created_at: string | null
          hourly_wage: number
          id: string
          role_name: string
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          hourly_wage: number
          id?: string
          role_name: string
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          hourly_wage?: number
          id?: string
          role_name?: string
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_wages_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          role: string
          scheduled_cost: number
          scheduled_hours: number
          start_time: string
          status: Database["public"]["Enums"]["shift_status"] | null
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          role: string
          scheduled_cost: number
          scheduled_hours: number
          start_time: string
          status?: Database["public"]["Enums"]["shift_status"] | null
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          role?: string
          scheduled_cost?: number
          scheduled_hours?: number
          start_time?: string
          status?: Database["public"]["Enums"]["shift_status"] | null
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      skus: {
        Row: {
          case_cost: number | null
          case_pack_qty: number | null
          category: string
          cost_per_uom: number
          created_at: string | null
          id: string
          lead_time_days: number
          name: string
          par: number
          safety_stock: number
          uom: string
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          case_cost?: number | null
          case_pack_qty?: number | null
          category: string
          cost_per_uom: number
          created_at?: string | null
          id?: string
          lead_time_days?: number
          name: string
          par: number
          safety_stock?: number
          uom: string
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          case_cost?: number | null
          case_pack_qty?: number | null
          category?: string
          cost_per_uom?: number
          created_at?: string | null
          id?: string
          lead_time_days?: number
          name?: string
          par?: number
          safety_stock?: number
          uom?: string
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skus_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      staffing_targets: {
        Row: {
          created_at: string | null
          id: string
          max_on_shift: number
          min_on_shift: number
          target_labor_pct: number
          updated_at: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_on_shift?: number
          min_on_shift?: number
          target_labor_pct?: number
          updated_at?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_on_shift?: number
          min_on_shift?: number
          target_labor_pct?: number
          updated_at?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staffing_targets_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          created_at: string | null
          id: string
          name: string
          org_id: string
          timezone: string | null
          type: Database["public"]["Enums"]["venue_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          org_id: string
          timezone?: string | null
          type: Database["public"]["Enums"]["venue_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
          timezone?: string | null
          type?: Database["public"]["Enums"]["venue_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      insight_category: "cash" | "growth" | "labor" | "inventory" | "risk" | "opportunity"
      insight_severity: "low" | "medium" | "high" | "critical"
      plan_type: "starter" | "premium"
      shift_status: "scheduled" | "active" | "completed" | "cancelled"
      venue_type: "restaurant" | "bar" | "lounge"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}