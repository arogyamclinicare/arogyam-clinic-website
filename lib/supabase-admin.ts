import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase'

// Admin Supabase client with service role key for bypassing RLS
// SECURITY: Service role key should NEVER be exposed in client-side code
// This is a temporary fallback - in production, use server-side API endpoints
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mvmbbpjtyrjmoccoajmt.supabase.co'
// SECURITY: Service role key should NEVER be in client-side code
// This should only be used in server-side/admin contexts
let supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Environment variables loaded securely

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}
if (!supabaseServiceKey) {
  throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Singleton pattern to ensure only one admin client is ever created
let _adminClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseAdmin = () => {
  if (!_adminClient) {
    _adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        storageKey: 'arogyam-admin-auth', // Different storage key to avoid conflicts
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
          'X-Client-Info': 'arogyam-admin-client'
        }
      }
    });
  }
  return _adminClient;
};

// Export the admin client directly
// Only export the lazy getter function, not a direct client instance

// Export the same types as the regular client
export type { Database, SupabaseClient, Consultation, ConsultationInsert, ConsultationUpdate, Patient, PatientInsert, PatientUpdate, PrescriptionDrug, PrescriptionDrugInsert, PrescriptionDrugUpdate, DrugTemplate, DrugTemplateInsert, DrugTemplateUpdate } from './supabase'
