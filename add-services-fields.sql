-- =====================================================
-- ADD SERVICES FIELDS TO CONSULTATIONS TABLE
-- Migration script to add comprehensive service tracking
-- =====================================================

-- Add Service Type field (Homeopathy/Aesthetics)
ALTER TABLE consultations 
ADD COLUMN service_type VARCHAR(50);

COMMENT ON COLUMN consultations.service_type IS 'Type of service: homeopathy or aesthetics';

-- Add Segment field (e.g., ALLERGY, CARDIOVASCULAR, AI SKIN PRO)
ALTER TABLE consultations 
ADD COLUMN segment VARCHAR(100);

COMMENT ON COLUMN consultations.segment IS 'Selected segment from the service hierarchy';

-- Add Sub-Segment field (e.g., ASTHMA, HYPERTENSION, ACNE)
ALTER TABLE consultations 
ADD COLUMN sub_segment VARCHAR(100);

COMMENT ON COLUMN consultations.sub_segment IS 'Selected sub-segment from the segment';

-- Add Sub-Sub-Segment Text field (admin custom input)
ALTER TABLE consultations 
ADD COLUMN sub_sub_segment_text TEXT;

COMMENT ON COLUMN consultations.sub_sub_segment_text IS 'Admin custom text for additional sub-segment details';

-- Add Case Type field (DIFFICULT CASE, NORMAL CASE, etc.)
ALTER TABLE consultations 
ADD COLUMN case_type VARCHAR(50);

COMMENT ON COLUMN consultations.case_type IS 'Case classification: DIFFICULT CASE, NORMAL CASE, RARE & DIFFICULT CASE, RARE CASE';

-- Add Remarks field (admin notes)
ALTER TABLE consultations 
ADD COLUMN remarks TEXT;

COMMENT ON COLUMN consultations.remarks IS 'Admin notes and remarks about the case';

-- Add Manual Case Type field (admin custom input)
ALTER TABLE consultations 
ADD COLUMN manual_case_type TEXT;

COMMENT ON COLUMN consultations.manual_case_type IS 'Admin custom case type text input';

-- Add Associated Segments field (multi-select array)
ALTER TABLE consultations 
ADD COLUMN associated_segments TEXT[];

COMMENT ON COLUMN consultations.associated_segments IS 'Array of associated segments for cross-referencing';

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Index on service_type for faster filtering
CREATE INDEX idx_consultations_service_type ON consultations(service_type);

-- Index on segment for faster filtering
CREATE INDEX idx_consultations_segment ON consultations(segment);

-- Index on case_type for faster filtering
CREATE INDEX idx_consultations_case_type ON consultations(case_type);

-- Index on associated_segments using GIN for array operations
CREATE INDEX idx_consultations_associated_segments ON consultations USING GIN(associated_segments);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the new columns were added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'consultations' 
AND column_name IN (
    'service_type',
    'segment', 
    'sub_segment',
    'sub_sub_segment_text',
    'case_type',
    'remarks',
    'manual_case_type',
    'associated_segments'
)
ORDER BY column_name;

-- Verify indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'consultations' 
AND indexname LIKE '%service%' OR indexname LIKE '%segment%' OR indexname LIKE '%case%';

-- =====================================================
-- SAMPLE DATA INSERTION (OPTIONAL)
-- =====================================================

-- Example of how to insert data with new fields
/*
INSERT INTO consultations (
    name, phone, age, gender, preferred_date, preferred_time,
    service_type, segment, sub_segment, sub_sub_segment_text,
    case_type, remarks, manual_case_type, associated_segments,
    created_at, updated_at
) VALUES (
    'John Doe',
    '9876543210',
    '35',
    'male',
    '2025-01-15',
    '10:00:00',
    'homeopathy',
    'cardiovascular',
    'hypertension',
    'Chronic hypertension with family history',
    'difficult_case',
    'Patient has been on medication for 5 years, needs holistic approach',
    'COMPLEX HYPERTENSION CASE',
    ARRAY['cardiovascular', 'endocrine', 'renal'],
    NOW(),
    NOW()
);
*/

-- =====================================================
-- ROLLBACK SCRIPT (if needed)
-- =====================================================
/*
-- To rollback these changes, run:

-- Drop indexes first
DROP INDEX IF EXISTS idx_consultations_service_type;
DROP INDEX IF EXISTS idx_consultations_segment;
DROP INDEX IF EXISTS idx_consultations_case_type;
DROP INDEX IF EXISTS idx_consultations_associated_segments;

-- Drop columns
ALTER TABLE consultations DROP COLUMN IF EXISTS service_type;
ALTER TABLE consultations DROP COLUMN IF EXISTS segment;
ALTER TABLE consultations DROP COLUMN IF EXISTS sub_segment;
ALTER TABLE consultations DROP COLUMN IF EXISTS sub_sub_segment_text;
ALTER TABLE consultations DROP COLUMN IF EXISTS case_type;
ALTER TABLE consultations DROP COLUMN IF EXISTS remarks;
ALTER TABLE consultations DROP COLUMN IF EXISTS manual_case_type;
ALTER TABLE consultations DROP COLUMN IF EXISTS associated_segments;
*/
