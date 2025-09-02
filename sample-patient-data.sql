-- Sample Patient Data for Testing Patient Portal Login
-- Run this in your Supabase SQL Editor

-- First, clear existing patient data (since you mentioned it's demo data)
DELETE FROM patients;

-- Option 1: Create users first, then patients (if you want to maintain relationships)
-- Uncomment the following lines if you want to create users first:

/*
-- Create sample users first
INSERT INTO users (
  id,
  email,
  role,
  created_at
) VALUES 
(
  '94dddafc-7b8a-43ff-8bbe-ca36d8b6aabd',
  'john.doe@example.com',
  'patient',
  NOW()
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'sarah.wilson@example.com',
  'patient',
  NOW()
),
(
  'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  'mike.chen@example.com',
  'patient',
  NOW()
),
(
  'c3d4e5f6-g7h8-9012-cdef-345678901234',
  'emma.brown@example.com',
  'patient',
  NOW()
),
(
  'd4e5f6g7-h8i9-0123-defg-456789012345',
  'alex.kumar@example.com',
  'patient',
  NOW()
);
*/

-- Option 2: Insert patients with NULL user_id (simpler for demo)
-- This bypasses the foreign key constraint for demo purposes
INSERT INTO patients (
  id,
  user_id,  -- Set to NULL to bypass foreign key constraint
  email,
  name,
  phone,
  patient_id,
  password,
  credentials_generated_at,
  email_sent,
  consultation_id
) VALUES 
(
  gen_random_uuid(),
  NULL,  -- No user relationship for demo
  'john.doe@example.com',
  'John Doe',
  '+91 98765 43210',
  'PAT-2025-001',
  'password123',  -- Plain text password for testing
  NOW(),
  true,
  NULL
),
(
  gen_random_uuid(),
  NULL,  -- No user relationship for demo
  'sarah.wilson@example.com',
  'Sarah Wilson',
  '+91 87654 32109',
  'PAT-2025-002',
  'demo456',  -- Plain text password for testing
  NOW(),
  true,
  NULL
),
(
  gen_random_uuid(),
  NULL,  -- No user relationship for demo
  'mike.chen@example.com',
  'Mike Chen',
  '+91 76543 21098',
  'PAT-2025-003',
  'test789',  -- Plain text password for testing
  NOW(),
  true,
  NULL
),
(
  gen_random_uuid(),
  NULL,  -- No user relationship for demo
  'emma.brown@example.com',
  'Emma Brown',
  '+91 65432 10987',
  'PAT-2025-004',
  'demo2025',  -- Plain text password for testing
  NOW(),
  true,
  NULL
),
(
  gen_random_uuid(),
  NULL,  -- No user relationship for demo
  'alex.kumar@example.com',
  'Alex Kumar',
  '+91 54321 09876',
  'PAT-2025-005',
  'portal123',  -- Plain text password for testing
  NOW(),
  true,
  NULL
);

-- Verify the data was inserted
SELECT 
  patient_id,
  name,
  email,
  phone,
  LEFT(password, 20) as password_preview,
  credentials_generated_at,
  user_id
FROM patients
ORDER BY patient_id;

-- Test login credentials:
-- Patient ID: PAT-2025-001, Password: password123
-- Patient ID: PAT-2025-002, Password: demo456
-- Patient ID: PAT-2025-003, Password: test789
-- Patient ID: PAT-2025-004, Password: demo2025
-- Patient ID: PAT-2025-005, Password: portal123

-- If you still get foreign key errors, you can also try this alternative approach:
-- Check if the user_id column allows NULL values:
-- SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'user_id';

-- If user_id doesn't allow NULL, you might need to modify the table structure temporarily:
-- ALTER TABLE patients ALTER COLUMN user_id DROP NOT NULL;
