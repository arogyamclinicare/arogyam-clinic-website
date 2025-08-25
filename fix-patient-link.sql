-- Fix the missing patient_id link for Krishna's consultation
-- This will ensure the patient portal can find and display the data

-- First, let's see what we're working with
SELECT 
  'Consultation' as type,
  id,
  name,
  email,
  patient_id,
  status,
  created_at
FROM consultations 
WHERE email = 'test@gmail.com' OR name ILIKE '%krishna%';

SELECT 
  'Patient' as type,
  id,
  name,
  email,
  patient_id,
  password
FROM patients 
WHERE email = 'test@gmail.com';

-- Now let's link the consultation to the patient
-- We'll use the patient_id from the patients table
UPDATE consultations 
SET patient_id = (
  SELECT patient_id 
  FROM patients 
  WHERE email = 'test@gmail.com'
)
WHERE email = 'test@gmail.com' 
  AND patient_id IS NULL;

-- Verify the fix
SELECT 
  id,
  name,
  email,
  patient_id,
  status,
  medicines_prescribed,
  dosage_instructions
FROM consultations 
WHERE email = 'test@gmail.com';
