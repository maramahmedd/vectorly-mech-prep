-- Migration to add bookmarked problems feature
-- Run this in your Supabase SQL Editor

-- Create bookmarked_problems table
CREATE TABLE IF NOT EXISTS bookmarked_problems (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id text NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, problem_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookmarked_problems_user_id ON bookmarked_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarked_problems_problem_id ON bookmarked_problems(problem_id);
CREATE INDEX IF NOT EXISTS idx_bookmarked_problems_created_at ON bookmarked_problems(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarked_problems ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read/write their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarked_problems FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarked_problems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarked_problems FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE bookmarked_problems IS 'Stores user bookmarks/starred problems for later review';
