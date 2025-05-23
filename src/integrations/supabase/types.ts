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
      form_submissions: {
        Row: {
          additional_info: Json | null
          attendance_status: string | null
          email: string | null
          first_name: string
          "form id": string
          grade_level: string | null
          has_guest: boolean | null
          id: string
          payment_status: string | null
          qr_code: string | null
          scan_count: number | null
          student_number: string | null
          submission_data: Json | null
          submitted_at: string
          surname: string
          ticket_id: number | null
          ticket_type: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          additional_info?: Json | null
          attendance_status?: string | null
          email?: string | null
          first_name: string
          "form id": string
          grade_level?: string | null
          has_guest?: boolean | null
          id?: string
          payment_status?: string | null
          qr_code?: string | null
          scan_count?: number | null
          student_number?: string | null
          submission_data?: Json | null
          submitted_at?: string
          surname: string
          ticket_id?: number | null
          ticket_type?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          additional_info?: Json | null
          attendance_status?: string | null
          email?: string | null
          first_name?: string
          "form id"?: string
          grade_level?: string | null
          has_guest?: boolean | null
          id?: string
          payment_status?: string | null
          qr_code?: string | null
          scan_count?: number | null
          student_number?: string | null
          submission_data?: Json | null
          submitted_at?: string
          surname?: string
          ticket_id?: number | null
          ticket_type?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          attendance_status: string | null
          attendee_id: string | null
          first_name: string
          grade_level: string | null
          guest_email: string | null
          id: string
          payment_status: string | null
          qr_code: string | null
          scan_count: number | null
          submission_data: Json | null
          submitted_at: string | null
          surname: string
          ticket_type: string | null
        }
        Insert: {
          attendance_status?: string | null
          attendee_id?: string | null
          first_name: string
          grade_level?: string | null
          guest_email?: string | null
          id?: string
          payment_status?: string | null
          qr_code?: string | null
          scan_count?: number | null
          submission_data?: Json | null
          submitted_at?: string | null
          surname: string
          ticket_type?: string | null
        }
        Update: {
          attendance_status?: string | null
          attendee_id?: string | null
          first_name?: string
          grade_level?: string | null
          guest_email?: string | null
          id?: string
          payment_status?: string | null
          qr_code?: string | null
          scan_count?: number | null
          submission_data?: Json | null
          submitted_at?: string | null
          surname?: string
          ticket_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "ticket_form"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_requests: {
        Row: {
          attendee_id: string | null
          id: string
          request_details: Json | null
          request_type: string
          submitted_at: string | null
        }
        Insert: {
          attendee_id?: string | null
          id?: string
          request_details?: Json | null
          request_type: string
          submitted_at?: string | null
        }
        Update: {
          attendee_id?: string | null
          id?: string
          request_details?: Json | null
          request_type?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seating_requests_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "ticket_form"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_form: {
        Row: {
          attendance_status: string | null
          first_name: string
          grade_level: string | null
          has_guest: boolean | null
          id: string
          payment_status: string | null
          qr_code: string | null
          scan_count: number | null
          student_email: string
          submission_data: Json | null
          submitted_at: string | null
          surname: string
          ticket_type: string | null
          user_email: string | null
        }
        Insert: {
          attendance_status?: string | null
          first_name: string
          grade_level?: string | null
          has_guest?: boolean | null
          id?: string
          payment_status?: string | null
          qr_code?: string | null
          scan_count?: number | null
          student_email: string
          submission_data?: Json | null
          submitted_at?: string | null
          surname: string
          ticket_type?: string | null
          user_email?: string | null
        }
        Update: {
          attendance_status?: string | null
          first_name?: string
          grade_level?: string | null
          has_guest?: boolean | null
          id?: string
          payment_status?: string | null
          qr_code?: string | null
          scan_count?: number | null
          student_email?: string
          submission_data?: Json | null
          submitted_at?: string | null
          surname?: string
          ticket_type?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mark_ticket_as_paid: {
        Args: { submission_id: string }
        Returns: boolean
      }
      url_encode: {
        Args: { input: string }
        Returns: string
      }
      verify_ticket: {
        Args: { code: string }
        Returns: {
          id: string
          first_name: string
          surname: string
          student_number: string
          grade_level: string
          scan_count: number
          submission_data: Json
          payment_status: string
          attendance_status: string
          is_valid: boolean
          message: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
