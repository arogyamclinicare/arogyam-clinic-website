-- Simple Patient Data for Testing - No Foreign Key Issues
-- Run this in your Supabase SQL Editor

-- First, clear existing patient data
DELETE FROM patients;

-- Check table structure first
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;

-- Insert patients with minimal required fields
-- This approach should work regardless of foreign key constraints
INSERT INTO patients (
  id,
  email,
  name,
  phone,
  patient_id,
  password,
  credentials_generated_at,
  email_sent
) VALUES 
(
  gen_random_uuid(),
  'john.doe@example.com',
  'John Doe',
  '+91 98765 43210',
  'PAT-2025-001',
  'password123',
  NOW(),
  true
),
(
  gen_random_uuid(),
  'sarah.wilson@example.com',
  'Sarah Wilson',
  '+91 87654 32109',
  'PAT-2025-002',
  'demo456',
  NOW(),
  true
),
(
  gen_random_uuid(),
  'mike.chen@example.com',
  'Mike Chen',
  '+91 76543 21098',
  'PAT-2025-003',
  'test789',
  NOW(),
  true
),
(
  gen_random_uuid(),
  'emma.brown@example.com',
  'Emma Brown',
  '+91 65432 10987',
  'PAT-2025-004',
  'demo2025',
  NOW(),
  true
),
(
  gen_random_uuid(),
  'alex.kumar@example.com',
  'Alex Kumar',
  '+91 54321 09876',
  'PAT-2025-005',
  'portal123',
  NOW(),
  true
);

-- Verify the data was inserted
SELECT 
  patient_id,
  name,
  email,
  phone,
  LEFT(password, 20) as password_preview,
  credentials_generated_at
FROM patients
ORDER BY patient_id;

-- Test login credentials:
-- Patient ID: PAT-2025-001, Password: password123
-- Patient ID: PAT-2025-002, Password: demo456
-- Patient ID: PAT-2025-003, Password: test789
-- Patient ID: PAT-2025-004, Password: demo2025
-- Patient ID: PAT-2025-005, Password: portal123
