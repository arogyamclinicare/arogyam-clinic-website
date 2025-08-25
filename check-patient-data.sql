-- Check if the consultation for Krishna has patient_id set
-- This will help us understand why the patient portal isn't showing the data

-- First, let's see the consultation details
SELECT 
  id,
  name,
  email,
  status,
  medicines_prescribed,
  dosage_instructions,
  diagnosis,
  treatment_plan,
  patient_id,
  created_at
FROM consultations 
WHERE email = 'test@gmail.com' OR name = 'krishna'
ORDER BY created_at DESC;

-- Check if there's a patient record for this email
SELECT 
  id,
  name,
  email,
  patient_id,
  password,
  credentials_generated_at
FROM patients 
WHERE email = 'test@gmail.com';

-- If patient_id is missing from consultations, we need to link them
-- This should have been done when credentials were generated
