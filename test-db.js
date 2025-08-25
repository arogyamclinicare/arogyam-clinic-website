// Simple database connection test
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvmbbpjtyrjmoccoajmt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bWJicGp0eXJqbW9jY29ham10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTMyNTksImV4cCI6MjA3MTQyOTI1OX0.DLw_dtjIa0MN0tesSFNPdrLV90kuX2iuYUi'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test 1: Check if we can connect
    console.log('📡 Testing basic connection...')
    
    // Test 2: Check if patients table exists
    console.log('👥 Checking patients table...')
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('*')
      .limit(1)
    
    if (patientsError) {
      console.error('❌ Patients table error:', patientsError)
    } else {
      console.log('✅ Patients table accessible, sample data:', patients)
    }
    
    // Test 3: Check if consultations table exists
    console.log('📋 Checking consultations table...')
    const { data: consultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('*')
      .limit(1)
    
    if (consultationsError) {
      console.error('❌ Consultations table error:', consultationsError)
    } else {
      console.log('✅ Consultations table accessible, sample data:', consultations)
    }
    
    // Test 4: Check specific patient
    console.log('🔍 Checking for specific patient...')
    const { data: specificPatient, error: specificError } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id', 'PAT-2025-7463-N1LT')
      .single()
    
    if (specificError) {
      console.error('❌ Specific patient error:', specificError)
    } else {
      console.log('✅ Specific patient found:', specificPatient)
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testConnection()
