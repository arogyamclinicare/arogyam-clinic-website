import { createClient } from '@supabase/supabase-js'

// Environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging to verify environment variables
console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Key:', supabaseAnonKey ? 'Set' : 'Missing')
console.log('🔍 Full URL value:', supabaseUrl)
console.log('🔍 Full Key value:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'null')
console.log('🔍 All env vars:', import.meta.env)

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}
if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Create Supabase client with real-time enabled
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
})

// Test connection
console.log('📡 Supabase client created successfully')

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
          consultation_type: 'video' | 'phone'
          treatment_type: string
          status: string
          created_at: string
          prescription: string | null
          notes: string | null
          follow_up_date: string | null
          follow_up_notes: string | null
          treatment_plan: string | null
          symptoms: string | null
          diagnosis: string | null
          medicines_prescribed: string | null
          dosage_instructions: string | null
          next_appointment_date: string | null
          patient_concerns: string | null
          doctor_observations: string | null
          patient_id: string | null
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
          consultation_type: 'video' | 'phone'
          treatment_type: string
          status?: string
          created_at?: string
          prescription?: string | null
          notes?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          treatment_plan?: string | null
          symptoms?: string | null
          diagnosis?: string | null
          medicines_prescribed?: string | null
          dosage_instructions?: string | null
          next_appointment_date?: string | null
          patient_concerns?: string | null
          doctor_observations?: string | null
          patient_id?: string | null
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
          consultation_type?: 'video' | 'phone'
          treatment_type?: string
          status?: string
          created_at?: string
          prescription?: string | null
          notes?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          treatment_plan?: string | null
          symptoms?: string | null
          diagnosis?: string | null
          medicines_prescribed?: string | null
          dosage_instructions?: string | null
          next_appointment_date?: string | null
          patient_concerns?: string | null
          doctor_observations?: string | null
          patient_id?: string | null
        }
      }
      prescription_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          common_medicines: string[] | null
          dosage_pattern: string | null
          instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          common_medicines?: string[] | null
          dosage_pattern?: string | null
          instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          common_medicines?: string[] | null
          dosage_pattern?: string | null
          instructions?: string | null
          created_at?: string
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
          credentials_generated_at?: string
          email_sent?: boolean
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
    }
  }
}

// Type-safe Supabase client
export type SupabaseClient = typeof supabase

// Export types for use in components
export type Consultation = Database['public']['Tables']['consultations']['Row']
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert']
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update']
export type Patient = Database['public']['Tables']['patients']['Row']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']
