-- Complete Sample Data for Testing - Patients + Consultations
-- Run this in your Supabase SQL Editor to get everything set up

-- =====================================================
-- STEP 1: Clear existing data (since it's demo data)
-- =====================================================
DELETE FROM consultations;
DELETE FROM patients;

-- =====================================================
-- STEP 2: Add sample patients
-- =====================================================
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

-- =====================================================
-- STEP 3: Add sample consultations linked to patients
-- =====================================================
INSERT INTO consultations (
  id,
  name,
  email,
  phone,
  age,
  gender,
  condition,
  preferred_date,
  preferred_time,
  consultation_type,
  treatment_type,
  status,
  created_at,
  patient_id
) VALUES 
(
  gen_random_uuid(),
  'John Doe',
  'john.doe@example.com',
  '+91 98765 43210',
  35,
  'male',
  'Chronic back pain and stress-related headaches. Looking for natural treatment alternatives.',
  '2025-02-15',
  '10:00 AM',
  'video',
  'General Consultation',
  'completed',
  NOW() - INTERVAL '5 days',
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-001')
),
(
  gen_random_uuid(),
  'Sarah Wilson',
  'sarah.wilson@example.com',
  '+91 87654 32109',
  28,
  'female',
  'Skin allergies and digestive issues. Previous treatments not effective.',
  '2025-02-10',
  '02:00 PM',
  'phone',
  'Skin & Digestive Health',
  'completed',
  NOW() - INTERVAL '10 days',
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-002')
),
(
  gen_random_uuid(),
  'Mike Chen',
  'mike.chen@example.com',
  '+91 76543 21098',
  42,
  'male',
  'Insomnia and anxiety. Seeking holistic approach for better sleep.',
  '2025-02-20',
  '06:00 PM',
  'video',
  'Mental Health & Sleep',
  'pending',
  NOW() - INTERVAL '2 days',
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-003')
),
(
  gen_random_uuid(),
  'Emma Brown',
  'emma.brown@example.com',
  '+91 65432 10987',
  31,
  'female',
  'Hormonal imbalance and irregular periods. Want natural treatment.',
  '2025-02-25',
  '11:30 AM',
  'video',
  'Women\'s Health',
  'pending',
  NOW() - INTERVAL '1 day',
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-004')
),
(
  gen_random_uuid(),
  'Alex Kumar',
  'alex.kumar@example.com',
  '+91 54321 09876',
  39,
  'male',
  'Joint pain and inflammation. Looking for alternative to painkillers.',
  '2025-02-28',
  '07:00 PM',
  'phone',
  'Joint & Pain Management',
  'scheduled',
  NOW(),
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-005')
),
(
  gen_random_uuid(),
  'John Doe',
  'john.doe@example.com',
  '+91 98765 43210',
  35,
  'male',
  'Follow-up consultation for back pain treatment progress.',
  '2025-03-05',
  '10:30 AM',
  'video',
  'Follow-up Consultation',
  'scheduled',
  NOW() + INTERVAL '5 days',
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-001')
),
(
  gen_random_uuid(),
  'Sarah Wilson',
  'sarah.wilson@example.com',
  '+91 87654 32109',
  28,
  'female',
  'Review of skin treatment and new digestive concerns.',
  '2025-03-08',
  '03:00 PM',
  'video',
  'Follow-up Consultation',
  'scheduled',
  NOW() + INTERVAL '8 days',
  (SELECT id FROM patients WHERE patient_id = 'PAT-2025-002')
);

-- =====================================================
-- STEP 4: Verify all data was inserted correctly
-- =====================================================

-- Show all patients
SELECT 
  patient_id,
  name,
  email,
  phone,
  LEFT(password, 20) as password_preview,
  credentials_generated_at
FROM patients
ORDER BY patient_id;

-- Show all consultations with patient info
SELECT 
  c.id,
  c.name,
  c.phone,
  c.preferred_date,
  c.preferred_time,
  c.consultation_type,
  c.treatment_type,
  c.status,
  c.created_at,
  p.patient_id
FROM consultations c
LEFT JOIN patients p ON c.patient_id = p.id
ORDER BY c.created_at DESC;

-- Show consultation count by status
SELECT 
  status,
  COUNT(*) as count
FROM consultations 
GROUP BY status
ORDER BY count DESC;

-- Show consultations by patient
SELECT 
  p.patient_id,
  p.name,
  COUNT(c.id) as consultation_count,
  MAX(c.created_at) as last_consultation
FROM patients p
LEFT JOIN consultations c ON p.id = c.patient_id
GROUP BY p.id, p.patient_id, p.name
ORDER BY consultation_count DESC;

-- =====================================================
-- TEST LOGIN CREDENTIALS:
-- =====================================================
-- Patient ID: PAT-2025-001, Password: password123 (John Doe)
-- Patient ID: PAT-2025-002, Password: demo456 (Sarah Wilson)  
-- Patient ID: PAT-2025-003, Password: test789 (Mike Chen)
-- Patient ID: PAT-2025-004, Password: demo2025 (Emma Brown)
-- Patient ID: PAT-2025-005, Password: portal123 (Alex Kumar)

-- =====================================================
-- WHAT YOU GET:
-- =====================================================
-- ✅ 5 patients with login credentials
-- ✅ 7 consultations (mix of completed, pending, scheduled)
-- ✅ All consultations properly linked to patients
-- ✅ Realistic health conditions and treatment types
-- ✅ Mix of video and phone consultations
-- ✅ Various dates (past, present, future)
-- ✅ Complete test environment for Patient Portal
