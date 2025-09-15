import { createClient } from '@supabase/supabase-js'

// Environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          age: number
          gender: string
          condition: string | null
          preferred_date: string
          preferred_time: string
          consultation_type: 'phone' | 'video'
          treatment_type: string
          status: string
          appointment_status: string | null
          created_at: string
          updated_at: string
          notes: string | null
          prescription: string | null
          follow_up_date: string | null
          follow_up_notes: string | null
          doctor_notes: string | null
          treatment_plan: string | null
          describe_it: string | null
          symptoms: string | null
          diagnosis: string | null
          medicines_prescribed: string | null
          dosage_instructions: string | null
          next_appointment_date: string | null
          patient_concerns: string | null
          doctor_observations: string | null
          medical_history: string | null
          allergies: string | null
          current_medications: string | null
          emergency_contact: string | null
          insurance_info: string | null
          payment_status: string | null
          consultation_fee: number | null
          payment_method: string | null
          payment_reference: string | null
          patient_id: string | null
          service_type: string | null
          segment: string | null
          sub_segment: string | null
          sub_sub_segment_text: string | null
          case_type: string | null
          remarks: string | null
          manual_case_type: string | null
          associated_segments: string[] | null
          unit_doctor: string | null
          pathological_investigations: string[] | null
          radio_diagnosis: string[] | null
          recommendations: string | null
          drug_name: string | null
          potency: string | null
          dosage: string | null
          repetition_frequency: number | null
          repetition_interval: number | null
          repetition_unit: string | null
          quantity: number | null
          period: number | null
          prescription_remarks: string | null
          is_lead: boolean | null
          lead_marked_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          age: number
          gender: string
          condition?: string | null
          preferred_date: string
          preferred_time: string
          consultation_type: 'phone' | 'video'
          treatment_type: string
          status?: string
          appointment_status?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
          prescription?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          doctor_notes?: string | null
          treatment_plan?: string | null
          describe_it?: string | null
          symptoms?: string | null
          diagnosis?: string | null
          medicines_prescribed?: string | null
          dosage_instructions?: string | null
          next_appointment_date?: string | null
          patient_concerns?: string | null
          doctor_observations?: string | null
          medical_history?: string | null
          allergies?: string | null
          current_medications?: string | null
          emergency_contact?: string | null
          insurance_info?: string | null
          payment_status?: string | null
          consultation_fee?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          patient_id?: string | null
          service_type?: string | null
          segment?: string | null
          sub_segment?: string | null
          sub_sub_segment_text?: string | null
          case_type?: string | null
          remarks?: string | null
          manual_case_type?: string | null
          associated_segments?: string[] | null
          unit_doctor?: string | null
          pathological_investigations?: string[] | null
          radio_diagnosis?: string[] | null
          recommendations?: string | null
          drug_name?: string | null
          potency?: string | null
          dosage?: string | null
          repetition_frequency?: number | null
          repetition_interval?: number | null
          repetition_unit?: string | null
          quantity?: number | null
          period?: number | null
          prescription_remarks?: string | null
          is_lead?: boolean | null
          lead_marked_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          age?: number
          gender?: string
          condition?: string | null
          preferred_date?: string
          preferred_time?: string
          consultation_type?: 'phone' | 'video'
          treatment_type?: string
          status?: string
          appointment_status?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
          prescription?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          doctor_notes?: string | null
          treatment_plan?: string | null
          describe_it?: string | null
          symptoms?: string | null
          diagnosis?: string | null
          medicines_prescribed?: string | null
          dosage_instructions?: string | null
          next_appointment_date?: string | null
          patient_concerns?: string | null
          doctor_observations?: string | null
          medical_history?: string | null
          allergies?: string | null
          current_medications?: string | null
          emergency_contact?: string | null
          insurance_info?: string | null
          payment_status?: string | null
          consultation_fee?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          patient_id?: string | null
          service_type?: string | null
          segment?: string | null
          sub_segment?: string | null
          sub_sub_segment_text?: string | null
          case_type?: string | null
          remarks?: string | null
          manual_case_type?: string | null
          associated_segments?: string[] | null
          unit_doctor?: string | null
          pathological_investigations?: string[] | null
          radio_diagnosis?: string[] | null
          recommendations?: string | null
          drug_name?: string | null
          potency?: string | null
          dosage?: string | null
          repetition_frequency?: number | null
          repetition_interval?: number | null
          repetition_unit?: string | null
          quantity?: number | null
          period?: number | null
          prescription_remarks?: string | null
          is_lead?: boolean | null
          lead_marked_at?: string | null
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string | null
          email: string
          name: string
          phone: string
          patient_id: string
          password: string
          credentials_generated_at: string
          email_sent: boolean
          consultation_id: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          name: string
          phone: string
          patient_id: string
          password: string
          credentials_generated_at: string
          email_sent: boolean
          consultation_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          name?: string
          phone?: string
          patient_id?: string
          password?: string
          credentials_generated_at?: string
          email_sent?: boolean
          consultation_id?: string | null
        }
      }
      prescription_drugs: {
        Row: {
          id: string
          consultation_id: string
          drug_name: string
          potency: string | null
          dosage: string | null
          repetition_frequency: number | null
          repetition_interval: number | null
          repetition_unit: string | null
          quantity: number | null
          period: number | null
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          consultation_id: string
          drug_name: string
          potency?: string | null
          dosage?: string | null
          repetition_frequency?: number | null
          repetition_interval?: number | null
          repetition_unit?: string | null
          quantity?: number | null
          period?: number | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          consultation_id?: string
          drug_name?: string
          potency?: string | null
          dosage?: string | null
          repetition_frequency?: number | null
          repetition_interval?: number | null
          repetition_unit?: string | null
          quantity?: number | null
          period?: number | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drug_templates: {
        Row: {
          id: string
          drug_name: string
          common_potencies: string[] | null
          common_dosages: string[] | null
          common_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          drug_name: string
          common_potencies?: string[] | null
          common_dosages?: string[] | null
          common_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          drug_name?: string
          common_potencies?: string[] | null
          common_dosages?: string[] | null
          common_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          role: string
          permissions: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          role: string
          permissions?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          role?: string
          permissions?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}
if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Lazy-loaded Supabase client to prevent multiple GoTrueClient instances
let _supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = (): ReturnType<typeof createClient<Database>> => {
  if (!_supabaseClient) {

    _supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        storageKey: 'arogyam-regular-auth', // Different storage key to avoid conflicts
        detectSessionInUrl: false // Disable session detection to reduce conflicts
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'arogyam-regular-client'
        }
      }
    });

  }
  return _supabaseClient;
};

// Export lazy-loaded getter function only
export const getSupabase = getSupabaseClient;

// Type aliases for easier use
export type SupabaseClient = ReturnType<typeof createClient<Database>>
export type Consultation = Database['public']['Tables']['consultations']['Row']
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert']
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update']
export type Patient = Database['public']['Tables']['patients']['Row']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']
export type PrescriptionDrug = Database['public']['Tables']['prescription_drugs']['Row']
export type PrescriptionDrugInsert = Database['public']['Tables']['prescription_drugs']['Insert']
export type PrescriptionDrugUpdate = Database['public']['Tables']['prescription_drugs']['Update']
export type DrugTemplate = Database['public']['Tables']['drug_templates']['Row']
export type DrugTemplateInsert = Database['public']['Tables']['drug_templates']['Insert']
export type DrugTemplateUpdate = Database['public']['Tables']['drug_templates']['Update']
export type Staff = Database['public']['Tables']['staff']['Row']
export type StaffInsert = Database['public']['Tables']['staff']['Insert']
export type StaffUpdate = Database['public']['Tables']['staff']['Update']