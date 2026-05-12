-- SQL Script to create tables in Supabase
-- Run this in the Supabase SQL Editor

-- 1. Habits Table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT,
  category TEXT,
  completions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own habits" 
ON habits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" 
ON habits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
ON habits FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
ON habits FOR DELETE 
USING (auth.uid() = user_id);


-- 2. Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  mood_text TEXT,
  gratitude TEXT,
  highlights TEXT,
  challenges TEXT,
  learning TEXT,
  goals TEXT,
  notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own journal entries" 
ON journal_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" 
ON journal_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON journal_entries FOR UPDATE 
USING (auth.uid() = user_id);


-- 3. Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  type TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own notes" 
ON notes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" 
ON notes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON notes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON notes FOR DELETE 
USING (auth.uid() = user_id);
