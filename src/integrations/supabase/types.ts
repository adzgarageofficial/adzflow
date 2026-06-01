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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applicants: {
        Row: {
          address: string | null
          cover_letter: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          resume_url: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          cover_letter?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          resume_url?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          cover_letter?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          resume_url?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          applicant_id: string
          application_number: string
          applied_at: string
          created_at: string
          hired_at: string | null
          id: string
          job_posting_id: string
          notes: string | null
          rating: number | null
          rejected_at: string | null
          rejection_reason: string | null
          stage: Database["public"]["Enums"]["application_stage"]
          updated_at: string
        }
        Insert: {
          applicant_id: string
          application_number: string
          applied_at?: string
          created_at?: string
          hired_at?: string | null
          id?: string
          job_posting_id: string
          notes?: string | null
          rating?: number | null
          rejected_at?: string | null
          rejection_reason?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          application_number?: string
          applied_at?: string
          created_at?: string
          hired_at?: string | null
          id?: string
          job_posting_id?: string
          notes?: string | null
          rating?: number | null
          rejected_at?: string | null
          rejection_reason?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      attendance_logs: {
        Row: {
          break_end: string | null
          break_start: string | null
          created_at: string
          created_by: string | null
          employee_id: string
          id: string
          late_minutes: number
          log_date: string
          method: string
          notes: string | null
          overtime_hours: number
          regular_hours: number
          shift_id: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          time_in: string | null
          time_out: string | null
          total_hours: number
          undertime_minutes: number
          updated_at: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          created_by?: string | null
          employee_id: string
          id?: string
          late_minutes?: number
          log_date?: string
          method?: string
          notes?: string | null
          overtime_hours?: number
          regular_hours?: number
          shift_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          time_in?: string | null
          time_out?: string | null
          total_hours?: number
          undertime_minutes?: number
          updated_at?: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          created_by?: string | null
          employee_id?: string
          id?: string
          late_minutes?: number
          log_date?: string
          method?: string
          notes?: string | null
          overtime_hours?: number
          regular_hours?: number
          shift_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          time_in?: string | null
          time_out?: string | null
          total_hours?: number
          undertime_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          summary: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          summary?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          summary?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_number: string
          branch_id: string | null
          created_at: string
          customer_id: string | null
          duration_minutes: number
          id: string
          notes: string | null
          scheduled_at: string
          service_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          technician_id: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          booking_number: string
          branch_id?: string | null
          created_at?: string
          customer_id?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          scheduled_at: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          technician_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          booking_number?: string
          branch_id?: string | null
          created_at?: string
          customer_id?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          scheduled_at?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          technician_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cash_drawer_sessions: {
        Row: {
          branch_id: string | null
          cash_sales: number
          cashier_id: string
          closed_at: string | null
          closing_balance: number | null
          created_at: string
          expected_cash: number
          id: string
          notes: string | null
          opened_at: string
          opening_balance: number
          session_number: string
          status: Database["public"]["Enums"]["drawer_status"]
          updated_at: string
          variance: number
        }
        Insert: {
          branch_id?: string | null
          cash_sales?: number
          cashier_id: string
          closed_at?: string | null
          closing_balance?: number | null
          created_at?: string
          expected_cash?: number
          id?: string
          notes?: string | null
          opened_at?: string
          opening_balance?: number
          session_number: string
          status?: Database["public"]["Enums"]["drawer_status"]
          updated_at?: string
          variance?: number
        }
        Update: {
          branch_id?: string | null
          cash_sales?: number
          cashier_id?: string
          closed_at?: string | null
          closing_balance?: number | null
          created_at?: string
          expected_cash?: number
          id?: string
          notes?: string | null
          opened_at?: string
          opening_balance?: number
          session_number?: string
          status?: Database["public"]["Enums"]["drawer_status"]
          updated_at?: string
          variance?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          employee_id: string
          expiry_date: string | null
          file_url: string | null
          id: string
          issue_date: string
          issuing_org: string | null
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          employee_id: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string
          issuing_org?: string | null
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          employee_id?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string
          issuing_org?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          company_name: string
          created_at: string
          currency: string
          email: string | null
          fiscal_year_start: number
          id: string
          invoice_prefix: string | null
          is_singleton: boolean
          legal_name: string | null
          logo_url: string | null
          phone: string | null
          receipt_footer: string | null
          tin: string | null
          updated_at: string
          vat_rate: number
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string
          created_at?: string
          currency?: string
          email?: string | null
          fiscal_year_start?: number
          id?: string
          invoice_prefix?: string | null
          is_singleton?: boolean
          legal_name?: string | null
          logo_url?: string | null
          phone?: string | null
          receipt_footer?: string | null
          tin?: string | null
          updated_at?: string
          vat_rate?: number
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          created_at?: string
          currency?: string
          email?: string | null
          fiscal_year_start?: number
          id?: string
          invoice_prefix?: string | null
          is_singleton?: boolean
          legal_name?: string | null
          logo_url?: string | null
          phone?: string | null
          receipt_footer?: string | null
          tin?: string | null
          updated_at?: string
          vat_rate?: number
          website?: string | null
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string | null
          feedback_number: string
          id: string
          is_public: boolean
          order_id: string | null
          rating: number
          responded_at: string | null
          responded_by: string | null
          response: string | null
          sentiment: Database["public"]["Enums"]["feedback_sentiment"]
          source: Database["public"]["Enums"]["feedback_source"]
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          feedback_number?: string
          id?: string
          is_public?: boolean
          order_id?: string | null
          rating?: number
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          sentiment?: Database["public"]["Enums"]["feedback_sentiment"]
          source?: Database["public"]["Enums"]["feedback_source"]
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          feedback_number?: string
          id?: string
          is_public?: boolean
          order_id?: string | null
          rating?: number
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          sentiment?: Database["public"]["Enums"]["feedback_sentiment"]
          source?: Database["public"]["Enums"]["feedback_source"]
          updated_at?: string
        }
        Relationships: []
      }
      customer_interactions: {
        Row: {
          assigned_to: string | null
          body: string | null
          channel: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          followup_at: string | null
          id: string
          outcome: string | null
          subject: string
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          body?: string | null
          channel?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          followup_at?: string | null
          id?: string
          outcome?: string | null
          subject: string
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          body?: string | null
          channel?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          followup_at?: string | null
          id?: string
          outcome?: string | null
          subject?: string
          type?: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          id: string
          lifetime_value: number
          loyalty_points: number
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          id?: string
          lifetime_value?: number
          loyalty_points?: number
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          id?: string
          lifetime_value?: number
          loyalty_points?: number
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_manager_fk"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          ends_at: string | null
          id: string
          is_active: boolean
          starts_at: string | null
          updated_at: string
          usage_count: number
          usage_limit: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id: string
          expiry_date: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          issued_date: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          employee_id: string
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          issued_date?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          employee_id?: string
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          issued_date?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_shifts: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          is_active: boolean
          shift_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          employee_id: string
          id?: string
          is_active?: boolean
          shift_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean
          shift_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          allowance: number
          avatar_url: string | null
          bank_account_number: string | null
          bank_name: string | null
          basic_salary: number
          birth_date: string | null
          branch_id: string | null
          civil_status: Database["public"]["Enums"]["civil_status"] | null
          created_at: string
          daily_rate: number
          date_hired: string
          date_regularized: string | null
          date_terminated: string | null
          department_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          employee_number: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          first_name: string
          gender: string | null
          hourly_rate: number
          id: string
          last_name: string
          middle_name: string | null
          nationality: string | null
          notes: string | null
          pagibig_number: string | null
          philhealth_number: string | null
          phone: string | null
          position_id: string | null
          sss_number: string | null
          status: Database["public"]["Enums"]["employment_status"]
          suffix: string | null
          tin_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          allowance?: number
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          basic_salary?: number
          birth_date?: string | null
          branch_id?: string | null
          civil_status?: Database["public"]["Enums"]["civil_status"] | null
          created_at?: string
          daily_rate?: number
          date_hired?: string
          date_regularized?: string | null
          date_terminated?: string | null
          department_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          employee_number: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          first_name: string
          gender?: string | null
          hourly_rate?: number
          id?: string
          last_name: string
          middle_name?: string | null
          nationality?: string | null
          notes?: string | null
          pagibig_number?: string | null
          philhealth_number?: string | null
          phone?: string | null
          position_id?: string | null
          sss_number?: string | null
          status?: Database["public"]["Enums"]["employment_status"]
          suffix?: string | null
          tin_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          allowance?: number
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          basic_salary?: number
          birth_date?: string | null
          branch_id?: string | null
          civil_status?: Database["public"]["Enums"]["civil_status"] | null
          created_at?: string
          daily_rate?: number
          date_hired?: string
          date_regularized?: string | null
          date_terminated?: string | null
          department_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          employee_number?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          first_name?: string
          gender?: string | null
          hourly_rate?: number
          id?: string
          last_name?: string
          middle_name?: string | null
          nationality?: string | null
          notes?: string | null
          pagibig_number?: string | null
          philhealth_number?: string | null
          phone?: string | null
          position_id?: string | null
          sss_number?: string | null
          status?: Database["public"]["Enums"]["employment_status"]
          suffix?: string | null
          tin_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      employment_contracts: {
        Row: {
          allowance: number
          basic_salary: number
          contract_number: string
          contract_type: Database["public"]["Enums"]["employment_type"]
          created_at: string
          employee_id: string
          end_date: string | null
          file_url: string | null
          id: string
          position_title: string | null
          signed_at: string | null
          signed_by: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"]
          terms: string | null
          updated_at: string
        }
        Insert: {
          allowance?: number
          basic_salary?: number
          contract_number: string
          contract_type?: Database["public"]["Enums"]["employment_type"]
          created_at?: string
          employee_id: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          position_title?: string | null
          signed_at?: string | null
          signed_by?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"]
          terms?: string | null
          updated_at?: string
        }
        Update: {
          allowance?: number
          basic_salary?: number
          contract_number?: string
          contract_type?: Database["public"]["Enums"]["employment_type"]
          created_at?: string
          employee_id?: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          position_title?: string | null
          signed_at?: string | null
          signed_by?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"]
          terms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employment_contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_transactions: {
        Row: {
          amount: number
          branch_id: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          direction: Database["public"]["Enums"]["txn_direction"]
          id: string
          method: Database["public"]["Enums"]["payment_method"] | null
          reference_id: string | null
          reference_type: string | null
          txn_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          branch_id?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          direction: Database["public"]["Enums"]["txn_direction"]
          id?: string
          method?: Database["public"]["Enums"]["payment_method"] | null
          reference_id?: string | null
          reference_type?: string | null
          txn_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          branch_id?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          direction?: Database["public"]["Enums"]["txn_direction"]
          id?: string
          method?: Database["public"]["Enums"]["payment_method"] | null
          reference_id?: string | null
          reference_type?: string | null
          txn_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_transactions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      fitments: {
        Row: {
          created_at: string
          id: string
          make: string
          model: string
          notes: string | null
          product_id: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          make: string
          model: string
          notes?: string | null
          product_id: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          make?: string
          model?: string
          notes?: string | null
          product_id?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fitments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          duration_minutes: number
          feedback: string | null
          id: string
          interview_type: string | null
          interviewer_id: string | null
          location: string | null
          meeting_link: string | null
          rating: number | null
          recommendation: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["interview_status"]
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          duration_minutes?: number
          feedback?: string | null
          id?: string
          interview_type?: string | null
          interviewer_id?: string | null
          location?: string | null
          meeting_link?: string | null
          rating?: number | null
          recommendation?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          duration_minutes?: number
          feedback?: string | null
          id?: string
          interview_type?: string | null
          interviewer_id?: string | null
          location?: string | null
          meeting_link?: string | null
          rating?: number | null
          recommendation?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
        }
        Relationships: []
      }
      inventory_levels: {
        Row: {
          id: string
          product_id: string
          quantity: number
          reorder_point: number
          reserved_quantity: number
          updated_at: string
          variant_id: string | null
          warehouse_id: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          reorder_point?: number
          reserved_quantity?: number
          updated_at?: string
          variant_id?: string | null
          warehouse_id: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          reorder_point?: number
          reserved_quantity?: number
          updated_at?: string
          variant_id?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_levels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_levels_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_levels_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      job_order_items: {
        Row: {
          created_at: string
          id: string
          is_labor: boolean
          job_order_id: string
          line_total: number
          name: string
          product_id: string | null
          quantity: number
          service_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_labor?: boolean
          job_order_id: string
          line_total: number
          name: string
          product_id?: string | null
          quantity?: number
          service_id?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          is_labor?: boolean
          job_order_id?: string
          line_total?: number
          name?: string
          product_id?: string | null
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_order_items_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_order_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      job_order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: string | null
          id: string
          job_order_id: string
          notes: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          job_order_id: string
          notes?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          job_order_id?: string
          notes?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_order_status_history_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      job_orders: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          description: string | null
          id: string
          job_number: string
          labor_cost: number
          parts_cost: number
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          technician_id: string | null
          total: number
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          job_number: string
          labor_cost?: number
          parts_cost?: number
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          total?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          job_number?: string
          labor_cost?: number
          parts_cost?: number
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          total?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          branch_id: string | null
          closes_at: string | null
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          employment_type: string | null
          id: string
          openings: number
          position_id: string | null
          posted_at: string | null
          posting_number: string
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_posting_status"]
          title: string
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          openings?: number
          position_id?: string | null
          posted_at?: string | null
          posting_number: string
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_posting_status"]
          title: string
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          openings?: number
          position_id?: string | null
          posted_at?: string | null
          posting_number?: string
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_posting_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpi_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          carried_over: number
          created_at: string
          employee_id: string
          entitled_days: number
          id: string
          leave_type_id: string
          notes: string | null
          pending_days: number
          updated_at: string
          used_days: number
          year: number
        }
        Insert: {
          carried_over?: number
          created_at?: string
          employee_id: string
          entitled_days?: number
          id?: string
          leave_type_id: string
          notes?: string | null
          pending_days?: number
          updated_at?: string
          used_days?: number
          year?: number
        }
        Update: {
          carried_over?: number
          created_at?: string
          employee_id?: string
          entitled_days?: number
          id?: string
          leave_type_id?: string
          notes?: string | null
          pending_days?: number
          updated_at?: string
          used_days?: number
          year?: number
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          created_at: string
          days_count: number
          employee_id: string
          end_date: string
          id: string
          leave_type_id: string
          reason: string
          rejection_reason: string | null
          request_number: string
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string
          days_count?: number
          employee_id: string
          end_date: string
          id?: string
          leave_type_id: string
          reason: string
          rejection_reason?: string | null
          request_number: string
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type_id?: string
          reason?: string
          rejection_reason?: string | null
          request_number?: string
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
        }
        Relationships: []
      }
      leave_types: {
        Row: {
          code: string
          color: string | null
          created_at: string
          default_days_per_year: number
          description: string | null
          id: string
          is_active: boolean
          is_paid: boolean
          name: string
          requires_approval: boolean
          updated_at: string
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string
          default_days_per_year?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_paid?: boolean
          name: string
          requires_approval?: boolean
          updated_at?: string
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string
          default_days_per_year?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_paid?: boolean
          name?: string
          requires_approval?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_tiers: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          min_points: number
          multiplier: number
          name: string
          perks: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          min_points?: number
          multiplier?: number
          name: string
          perks?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          min_points?: number
          multiplier?: number
          name?: string
          perks?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          balance_after: number
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          order_id: string | null
          points: number
          reason: string | null
          type: Database["public"]["Enums"]["loyalty_txn_type"]
        }
        Insert: {
          balance_after?: number
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          order_id?: string | null
          points: number
          reason?: string | null
          type: Database["public"]["Enums"]["loyalty_txn_type"]
        }
        Update: {
          balance_after?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          order_id?: string | null
          points?: number
          reason?: string | null
          type?: Database["public"]["Enums"]["loyalty_txn_type"]
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          channel: string | null
          conversions: number
          created_at: string
          ends_at: string | null
          id: string
          name: string
          notes: string | null
          reach: number
          spent: number
          starts_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          channel?: string | null
          conversions?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          name: string
          notes?: string | null
          reach?: number
          spent?: number
          starts_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          channel?: string | null
          conversions?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          reach?: number
          spent?: number
          starts_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          audience_role: string | null
          body: string | null
          category: Database["public"]["Enums"]["notification_category"]
          created_at: string
          created_by: string | null
          id: string
          link: string | null
          read_at: string | null
          severity: Database["public"]["Enums"]["notification_severity"]
          title: string
          user_id: string | null
        }
        Insert: {
          audience_role?: string | null
          body?: string | null
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          severity?: Database["public"]["Enums"]["notification_severity"]
          title: string
          user_id?: string | null
        }
        Update: {
          audience_role?: string | null
          body?: string | null
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          severity?: Database["public"]["Enums"]["notification_severity"]
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          discount: number
          id: string
          is_service: boolean
          line_total: number
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          discount?: number
          id?: string
          is_service?: boolean
          line_total: number
          name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          discount?: number
          id?: string
          is_service?: boolean
          line_total?: number
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paid_at: string
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paid_at?: string
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          paid_at?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_refunds: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          order_id: string
          reason: string
          refund_method: string | null
          refund_number: string
          rejection_reason: string | null
          requested_by: string | null
          status: Database["public"]["Enums"]["refund_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          order_id: string
          reason: string
          refund_method?: string | null
          refund_number: string
          rejection_reason?: string | null
          requested_by?: string | null
          status?: Database["public"]["Enums"]["refund_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          order_id?: string
          reason?: string
          refund_method?: string | null
          refund_number?: string
          rejection_reason?: string | null
          requested_by?: string | null
          status?: Database["public"]["Enums"]["refund_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number
          branch_id: string | null
          cashier_id: string | null
          channel: Database["public"]["Enums"]["order_channel"]
          created_at: string
          customer_id: string | null
          discount: number
          id: string
          notes: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          amount_paid?: number
          branch_id?: string | null
          cashier_id?: string | null
          channel?: Database["public"]["Enums"]["order_channel"]
          created_at?: string
          customer_id?: string | null
          discount?: number
          id?: string
          notes?: string | null
          order_number: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          amount_paid?: number
          branch_id?: string | null
          cashier_id?: string | null
          channel?: Database["public"]["Enums"]["order_channel"]
          created_at?: string
          customer_id?: string | null
          discount?: number
          id?: string
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      overtime_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          employee_id: string
          end_time: string
          hours: number
          id: string
          ot_date: string
          reason: string
          rejection_reason: string | null
          start_time: string
          status: Database["public"]["Enums"]["ot_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id: string
          end_time: string
          hours?: number
          id?: string
          ot_date: string
          reason: string
          rejection_reason?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["ot_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id?: string
          end_time?: string
          hours?: number
          id?: string
          ot_date?: string
          reason?: string
          rejection_reason?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["ot_status"]
          updated_at?: string
        }
        Relationships: []
      }
      payroll_periods: {
        Row: {
          created_at: string
          created_by: string | null
          cutoff_label: string
          id: string
          notes: string | null
          pay_date: string
          period_code: string
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["payroll_status"]
          total_deductions: number
          total_gross: number
          total_net: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cutoff_label?: string
          id?: string
          notes?: string | null
          pay_date: string
          period_code: string
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["payroll_status"]
          total_deductions?: number
          total_gross?: number
          total_net?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cutoff_label?: string
          id?: string
          notes?: string | null
          pay_date?: string
          period_code?: string
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["payroll_status"]
          total_deductions?: number
          total_gross?: number
          total_net?: number
          updated_at?: string
        }
        Relationships: []
      }
      payslips: {
        Row: {
          allowance: number
          basic_pay: number
          created_at: string
          days_worked: number
          employee_id: string
          gross_pay: number
          holiday_pay: number
          id: string
          late_deduction: number
          late_minutes: number
          net_pay: number
          notes: string | null
          other_deductions: number
          other_earnings: number
          overtime_hours: number
          overtime_pay: number
          pagibig: number
          payslip_number: string
          period_id: string
          philhealth: number
          regular_hours: number
          sss: number
          status: Database["public"]["Enums"]["payslip_status"]
          total_deductions: number
          updated_at: string
          withholding_tax: number
        }
        Insert: {
          allowance?: number
          basic_pay?: number
          created_at?: string
          days_worked?: number
          employee_id: string
          gross_pay?: number
          holiday_pay?: number
          id?: string
          late_deduction?: number
          late_minutes?: number
          net_pay?: number
          notes?: string | null
          other_deductions?: number
          other_earnings?: number
          overtime_hours?: number
          overtime_pay?: number
          pagibig?: number
          payslip_number: string
          period_id: string
          philhealth?: number
          regular_hours?: number
          sss?: number
          status?: Database["public"]["Enums"]["payslip_status"]
          total_deductions?: number
          updated_at?: string
          withholding_tax?: number
        }
        Update: {
          allowance?: number
          basic_pay?: number
          created_at?: string
          days_worked?: number
          employee_id?: string
          gross_pay?: number
          holiday_pay?: number
          id?: string
          late_deduction?: number
          late_minutes?: number
          net_pay?: number
          notes?: string | null
          other_deductions?: number
          other_earnings?: number
          overtime_hours?: number
          overtime_pay?: number
          pagibig?: number
          payslip_number?: string
          period_id?: string
          philhealth?: number
          regular_hours?: number
          sss?: number
          status?: Database["public"]["Enums"]["payslip_status"]
          total_deductions?: number
          updated_at?: string
          withholding_tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "payslips_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          employee_id: string
          id: string
          progress: number
          start_date: string
          status: Database["public"]["Enums"]["goal_status"]
          target_value: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          employee_id: string
          id?: string
          progress?: number
          start_date?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_value?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          employee_id?: string
          id?: string
          progress?: number
          start_date?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_value?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      performance_reviews: {
        Row: {
          acknowledged_at: string | null
          comments: string | null
          created_at: string
          employee_id: string
          id: string
          improvements: string | null
          overall_rating: number
          period_end: string
          period_start: string
          review_date: string
          review_number: string
          reviewer_id: string | null
          scores: Json
          status: Database["public"]["Enums"]["review_status"]
          strengths: string | null
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          comments?: string | null
          created_at?: string
          employee_id: string
          id?: string
          improvements?: string | null
          overall_rating?: number
          period_end: string
          period_start: string
          review_date?: string
          review_number: string
          reviewer_id?: string | null
          scores?: Json
          status?: Database["public"]["Enums"]["review_status"]
          strengths?: string | null
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          comments?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          improvements?: string | null
          overall_rating?: number
          period_end?: string
          period_start?: string
          review_date?: string
          review_number?: string
          reviewer_id?: string | null
          scores?: Json
          status?: Database["public"]["Enums"]["review_status"]
          strengths?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string
          department_id: string | null
          description: string | null
          id: string
          is_active: boolean
          level: string | null
          max_salary: number
          min_salary: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          level?: string | null
          max_salary?: number
          min_salary?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          level?: string | null
          max_salary?: number
          min_salary?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json | null
          created_at: string
          id: string
          name: string
          price_override: number | null
          product_id: string
          sku: string
          updated_at: string
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          id?: string
          name: string
          price_override?: number | null
          product_id: string
          sku: string
          updated_at?: string
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          id?: string
          name?: string
          price_override?: number | null
          product_id?: string
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          brand_id: string | null
          category_id: string | null
          cost_price: number
          created_at: string
          description: string | null
          gallery: Json | null
          id: string
          image_url: string | null
          is_service: boolean
          name: string
          reseller_price: number | null
          retail_price: number | null
          sku: string
          specs: Json | null
          status: Database["public"]["Enums"]["product_status"]
          tags: string[] | null
          updated_at: string
          wholesale_price: number | null
        }
        Insert: {
          base_price?: number
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_service?: boolean
          name: string
          reseller_price?: number | null
          retail_price?: number | null
          sku: string
          specs?: Json | null
          status?: Database["public"]["Enums"]["product_status"]
          tags?: string[] | null
          updated_at?: string
          wholesale_price?: number | null
        }
        Update: {
          base_price?: number
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_service?: boolean
          name?: string
          reseller_price?: number | null
          retail_price?: number | null
          sku?: string
          specs?: Json | null
          status?: Database["public"]["Enums"]["product_status"]
          tags?: string[] | null
          updated_at?: string
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          created_at: string
          display_name: string
          email: string
          face_descriptor: Json | null
          face_enrolled_at: string | null
          face_enrolled_by: string | null
          id: string
          last_active: string | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string
          display_name: string
          email: string
          face_descriptor?: Json | null
          face_enrolled_at?: string | null
          face_enrolled_by?: string | null
          id: string
          last_active?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string
          display_name?: string
          email?: string
          face_descriptor?: Json | null
          face_enrolled_at?: string | null
          face_enrolled_by?: string | null
          id?: string
          last_active?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          product_id: string
          purchase_order_id: string
          quantity: number
          received_quantity: number
          unit_cost: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          product_id: string
          purchase_order_id: string
          quantity: number
          received_quantity?: number
          unit_cost: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number
          unit_cost?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          expected_at: string | null
          id: string
          notes: string | null
          po_number: string
          received_at: string | null
          status: Database["public"]["Enums"]["po_status"]
          subtotal: number
          supplier_id: string
          tax: number
          total: number
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expected_at?: string | null
          id?: string
          notes?: string | null
          po_number: string
          received_at?: string | null
          status?: Database["public"]["Enums"]["po_status"]
          subtotal?: number
          supplier_id: string
          tax?: number
          total?: number
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expected_at?: string | null
          id?: string
          notes?: string | null
          po_number?: string
          received_at?: string | null
          status?: Database["public"]["Enums"]["po_status"]
          subtotal?: number
          supplier_id?: string
          tax?: number
          total?: number
          updated_at?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          created_at: string
          id: string
          is_labor: boolean
          line_total: number
          name: string
          product_id: string | null
          quantity: number
          quotation_id: string
          service_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_labor?: boolean
          line_total: number
          name: string
          product_id?: string | null
          quantity?: number
          quotation_id: string
          service_id?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          is_labor?: boolean
          line_total?: number
          name?: string
          product_id?: string | null
          quantity?: number
          quotation_id?: string
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          converted_order_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          discount: number
          downpayment: number
          id: string
          notes: string | null
          quotation_number: string
          status: Database["public"]["Enums"]["quotation_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
          valid_until: string | null
          vehicle_id: string | null
        }
        Insert: {
          converted_order_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount?: number
          downpayment?: number
          id?: string
          notes?: string | null
          quotation_number: string
          status?: Database["public"]["Enums"]["quotation_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
          vehicle_id?: string | null
        }
        Update: {
          converted_order_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount?: number
          downpayment?: number
          id?: string
          notes?: string | null
          quotation_number?: string
          status?: Database["public"]["Enums"]["quotation_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      recognitions: {
        Row: {
          awarded_at: string
          category: string | null
          created_at: string
          employee_id: string
          given_by: string | null
          id: string
          is_public: boolean
          message: string | null
          points: number
          title: string
          updated_at: string
        }
        Insert: {
          awarded_at?: string
          category?: string | null
          created_at?: string
          employee_id: string
          given_by?: string | null
          id?: string
          is_public?: boolean
          message?: string | null
          points?: number
          title: string
          updated_at?: string
        }
        Update: {
          awarded_at?: string
          category?: string | null
          created_at?: string
          employee_id?: string
          given_by?: string | null
          id?: string
          is_public?: boolean
          message?: string | null
          points?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          qualified_at: string | null
          referral_code: string
          referred_id: string | null
          referred_name: string | null
          referred_phone: string | null
          referrer_id: string
          reward_points: number
          rewarded_at: string | null
          status: Database["public"]["Enums"]["referral_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          qualified_at?: string | null
          referral_code?: string
          referred_id?: string | null
          referred_name?: string | null
          referred_phone?: string | null
          referrer_id: string
          reward_points?: number
          rewarded_at?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          qualified_at?: string | null
          referral_code?: string
          referred_id?: string | null
          referred_name?: string | null
          referred_phone?: string | null
          referrer_id?: string
          reward_points?: number
          rewarded_at?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
          updated_at?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          created_at: string
          created_by: string | null
          filters: Json
          id: string
          name: string
          report_type: string
          schedule: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          filters?: Json
          id?: string
          name: string
          report_type: string
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          filters?: Json
          id?: string
          name?: string
          report_type?: string
          schedule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          rate?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      shifts: {
        Row: {
          break_minutes: number
          created_at: string
          days_of_week: number[]
          description: string | null
          end_time: string
          grace_period_minutes: number
          id: string
          is_active: boolean
          name: string
          start_time: string
          updated_at: string
        }
        Insert: {
          break_minutes?: number
          created_at?: string
          days_of_week?: number[]
          description?: string | null
          end_time: string
          grace_period_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          start_time: string
          updated_at?: string
        }
        Update: {
          break_minutes?: number
          created_at?: string
          days_of_week?: number[]
          description?: string | null
          end_time?: string
          grace_period_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          variant_id: string | null
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          variant_id?: string | null
          warehouse_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          variant_id?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transfer_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          transfer_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          transfer_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          transfer_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfer_items_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "stock_transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transfers: {
        Row: {
          created_at: string
          created_by: string | null
          destination_warehouse_id: string
          id: string
          notes: string | null
          received_at: string | null
          shipped_at: string | null
          source_warehouse_id: string
          status: Database["public"]["Enums"]["transfer_status"]
          transfer_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          destination_warehouse_id: string
          id?: string
          notes?: string | null
          received_at?: string | null
          shipped_at?: string | null
          source_warehouse_id: string
          status?: Database["public"]["Enums"]["transfer_status"]
          transfer_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          destination_warehouse_id?: string
          id?: string
          notes?: string | null
          received_at?: string | null
          shipped_at?: string | null
          source_warehouse_id?: string
          status?: Database["public"]["Enums"]["transfer_status"]
          transfer_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          payment_terms: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_rates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_inclusive: boolean
          name: string
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_inclusive?: boolean
          name: string
          rate?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_inclusive?: boolean
          name?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      training_enrollments: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          created_at: string
          employee_id: string
          enrolled_at: string
          id: string
          notes: string | null
          score: number | null
          session_id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          employee_id: string
          enrolled_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          session_id: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          employee_id?: string
          enrolled_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          session_id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          updated_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          category: string | null
          code: string
          cost_per_person: number
          created_at: string
          description: string | null
          duration_hours: number
          id: string
          is_active: boolean
          is_mandatory: boolean
          provider: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          code: string
          cost_per_person?: number
          created_at?: string
          description?: string | null
          duration_hours?: number
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          provider?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string
          cost_per_person?: number
          created_at?: string
          description?: string | null
          duration_hours?: number
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          provider?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          location: string | null
          max_participants: number | null
          notes: string | null
          program_id: string
          session_code: string
          start_date: string
          status: Database["public"]["Enums"]["training_status"]
          trainer: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          location?: string | null
          max_participants?: number | null
          notes?: string | null
          program_id: string
          session_code: string
          start_date: string
          status?: Database["public"]["Enums"]["training_status"]
          trainer?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          notes?: string | null
          program_id?: string
          session_code?: string
          start_date?: string
          status?: Database["public"]["Enums"]["training_status"]
          trainer?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_service_logs: {
        Row: {
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          mileage: number | null
          service_date: string
          title: string
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          mileage?: number | null
          service_date?: string
          title: string
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          mileage?: number | null
          service_date?: string
          title?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_service_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          customer_id: string | null
          engine: string | null
          id: string
          image_url: string | null
          make: string
          mileage: number | null
          model: string
          notes: string | null
          plate_number: string | null
          updated_at: string
          vin: string | null
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          customer_id?: string | null
          engine?: string | null
          id?: string
          image_url?: string | null
          make: string
          mileage?: number | null
          model: string
          notes?: string | null
          plate_number?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          customer_id?: string | null
          engine?: string | null
          id?: string
          image_url?: string | null
          make?: string
          mileage?: number | null
          model?: string
          notes?: string | null
          plate_number?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: string | null
          branch_id: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_stock_for_order: {
        Args: { p_direction: string; p_order_id: string }
        Returns: undefined
      }
      ensure_default_warehouse: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _uid: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "owner"
        | "admin"
        | "cashier"
        | "inventory"
        | "mechanic"
        | "marketing"
        | "finance"
      application_stage:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
        | "withdrawn"
      attendance_status:
        | "present"
        | "late"
        | "absent"
        | "half_day"
        | "on_leave"
        | "holiday"
      booking_status:
        | "scheduled"
        | "confirmed"
        | "in_service"
        | "completed"
        | "cancelled"
        | "no_show"
      civil_status: "single" | "married" | "widowed" | "separated" | "divorced"
      contract_status: "draft" | "active" | "expired" | "terminated"
      document_type:
        | "contract"
        | "government_id"
        | "resume"
        | "certificate"
        | "medical"
        | "clearance"
        | "training"
        | "evaluation"
        | "other"
      drawer_status: "open" | "closed"
      employment_status:
        | "active"
        | "on_leave"
        | "suspended"
        | "terminated"
        | "resigned"
      employment_type:
        | "regular"
        | "probationary"
        | "contractual"
        | "project_based"
        | "part_time"
        | "intern"
      enrollment_status:
        | "enrolled"
        | "in_progress"
        | "completed"
        | "failed"
        | "dropped"
      feedback_sentiment: "positive" | "neutral" | "negative"
      feedback_source:
        | "in_store"
        | "sms"
        | "email"
        | "web"
        | "google"
        | "facebook"
        | "other"
      goal_status: "not_started" | "in_progress" | "completed" | "cancelled"
      interaction_type:
        | "call"
        | "visit"
        | "email"
        | "sms"
        | "chat"
        | "meeting"
        | "complaint"
        | "followup"
      interview_status: "scheduled" | "completed" | "cancelled" | "no_show"
      job_posting_status: "draft" | "open" | "closed" | "filled"
      job_status:
        | "pending"
        | "in_progress"
        | "awaiting_parts"
        | "completed"
        | "cancelled"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      loyalty_txn_type: "earn" | "redeem" | "adjust" | "expire" | "bonus"
      movement_type:
        | "purchase"
        | "sale"
        | "adjustment"
        | "transfer_in"
        | "transfer_out"
        | "return"
      notification_category:
        | "inventory"
        | "finance"
        | "hr"
        | "ops"
        | "crm"
        | "system"
      notification_severity: "info" | "success" | "warning" | "error"
      order_channel: "pos" | "ecommerce" | "phone" | "walk_in"
      order_status:
        | "pending"
        | "paid"
        | "partial"
        | "refunded"
        | "cancelled"
        | "completed"
      ot_status: "pending" | "approved" | "rejected" | "cancelled"
      payment_method:
        | "cash"
        | "gcash"
        | "card"
        | "bank_transfer"
        | "maya"
        | "other"
      payroll_status: "draft" | "processing" | "posted" | "paid"
      payslip_status: "draft" | "finalized" | "paid"
      po_status: "draft" | "sent" | "received" | "partial" | "cancelled"
      product_status: "active" | "draft" | "archived" | "out_of_stock"
      quotation_status:
        | "draft"
        | "sent"
        | "accepted"
        | "rejected"
        | "converted"
        | "expired"
      referral_status: "pending" | "qualified" | "rewarded" | "expired"
      refund_status: "pending" | "approved" | "rejected" | "completed"
      review_status: "draft" | "in_progress" | "completed" | "acknowledged"
      training_status: "scheduled" | "ongoing" | "completed" | "cancelled"
      transfer_status: "draft" | "in_transit" | "received" | "cancelled"
      txn_direction: "in" | "out"
      user_status: "active" | "suspended" | "disabled"
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
    Enums: {
      app_role: [
        "owner",
        "admin",
        "cashier",
        "inventory",
        "mechanic",
        "marketing",
        "finance",
      ],
      application_stage: [
        "applied",
        "screening",
        "interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
      attendance_status: [
        "present",
        "late",
        "absent",
        "half_day",
        "on_leave",
        "holiday",
      ],
      booking_status: [
        "scheduled",
        "confirmed",
        "in_service",
        "completed",
        "cancelled",
        "no_show",
      ],
      civil_status: ["single", "married", "widowed", "separated", "divorced"],
      contract_status: ["draft", "active", "expired", "terminated"],
      document_type: [
        "contract",
        "government_id",
        "resume",
        "certificate",
        "medical",
        "clearance",
        "training",
        "evaluation",
        "other",
      ],
      drawer_status: ["open", "closed"],
      employment_status: [
        "active",
        "on_leave",
        "suspended",
        "terminated",
        "resigned",
      ],
      employment_type: [
        "regular",
        "probationary",
        "contractual",
        "project_based",
        "part_time",
        "intern",
      ],
      enrollment_status: [
        "enrolled",
        "in_progress",
        "completed",
        "failed",
        "dropped",
      ],
      feedback_sentiment: ["positive", "neutral", "negative"],
      feedback_source: [
        "in_store",
        "sms",
        "email",
        "web",
        "google",
        "facebook",
        "other",
      ],
      goal_status: ["not_started", "in_progress", "completed", "cancelled"],
      interaction_type: [
        "call",
        "visit",
        "email",
        "sms",
        "chat",
        "meeting",
        "complaint",
        "followup",
      ],
      interview_status: ["scheduled", "completed", "cancelled", "no_show"],
      job_posting_status: ["draft", "open", "closed", "filled"],
      job_status: [
        "pending",
        "in_progress",
        "awaiting_parts",
        "completed",
        "cancelled",
      ],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      loyalty_txn_type: ["earn", "redeem", "adjust", "expire", "bonus"],
      movement_type: [
        "purchase",
        "sale",
        "adjustment",
        "transfer_in",
        "transfer_out",
        "return",
      ],
      notification_category: [
        "inventory",
        "finance",
        "hr",
        "ops",
        "crm",
        "system",
      ],
      notification_severity: ["info", "success", "warning", "error"],
      order_channel: ["pos", "ecommerce", "phone", "walk_in"],
      order_status: [
        "pending",
        "paid",
        "partial",
        "refunded",
        "cancelled",
        "completed",
      ],
      ot_status: ["pending", "approved", "rejected", "cancelled"],
      payment_method: [
        "cash",
        "gcash",
        "card",
        "bank_transfer",
        "maya",
        "other",
      ],
      payroll_status: ["draft", "processing", "posted", "paid"],
      payslip_status: ["draft", "finalized", "paid"],
      po_status: ["draft", "sent", "received", "partial", "cancelled"],
      product_status: ["active", "draft", "archived", "out_of_stock"],
      quotation_status: [
        "draft",
        "sent",
        "accepted",
        "rejected",
        "converted",
        "expired",
      ],
      referral_status: ["pending", "qualified", "rewarded", "expired"],
      refund_status: ["pending", "approved", "rejected", "completed"],
      review_status: ["draft", "in_progress", "completed", "acknowledged"],
      training_status: ["scheduled", "ongoing", "completed", "cancelled"],
      transfer_status: ["draft", "in_transit", "received", "cancelled"],
      txn_direction: ["in", "out"],
      user_status: ["active", "suspended", "disabled"],
    },
  },
} as const
