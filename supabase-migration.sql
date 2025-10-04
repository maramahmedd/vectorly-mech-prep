-- Migration to add missing fields to problems table
-- Run this in your Supabase SQL Editor

-- Add missing columns to problems table
ALTER TABLE problems
ADD COLUMN IF NOT EXISTS prompt text,
ADD COLUMN IF NOT EXISTS hints text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS time_limit_minutes integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS solution text,
ADD COLUMN IF NOT EXISTS solution_explanation text;

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_subject ON problems(subject);
CREATE INDEX IF NOT EXISTS idx_problems_industry ON problems(industry);
CREATE INDEX IF NOT EXISTS idx_problems_is_premium ON problems(is_premium);

-- Example: Insert a sample problem (optional)
-- You can delete this or modify it to match your needs
INSERT INTO problems (
  id,
  title,
  description,
  prompt,
  difficulty,
  subject,
  industry,
  time_estimate,
  time_limit_minutes,
  companies,
  hints,
  solution,
  solution_explanation,
  is_premium
) VALUES (
  'test-problem-001',
  'Test Problem - Truss Force Analysis',
  'Analyze forces in a simple truss structure',
  'A truss structure consists of 5 members forming a triangular configuration. Given a 1000N load applied vertically at the apex, determine the forces in each member. State whether each member is in tension or compression.',
  'medium',
  'Solid Mechanics',
  'Civil',
  '25 min',
  25,
  ARRAY['AECOM', 'Bechtel', 'Fluor'],
  ARRAY[
    'Start by drawing a free body diagram of each joint',
    'Use method of joints - sum of forces in x and y directions equals zero',
    'Consider the geometry of the truss to find angles'
  ],
  'Member forces: AB = 1154N (C), AC = 1154N (C), BC = 1000N (T), BD = 577N (T), CD = 577N (C)',
  'Using the method of joints and starting at the apex where the load is applied, we can systematically solve for each member force by enforcing equilibrium at each joint.',
  false
) ON CONFLICT (id) DO NOTHING;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'problems'
ORDER BY ordinal_position;
