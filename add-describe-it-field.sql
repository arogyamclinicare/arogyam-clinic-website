-- Add describe_it field to consultations table
-- Run this in your Supabase SQL Editor

-- Add the new describe_it column
ALTER TABLE consultations 
ADD COLUMN describe_it TEXT;

-- Add a comment to document the field
COMMENT ON COLUMN consultations.describe_it IS 'Admin-only field for detailed condition description';

-- Verify the column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'consultations' 
AND column_name = 'describe_it';

-- Show the updated table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'consultations' 
ORDER BY ordinal_position;
