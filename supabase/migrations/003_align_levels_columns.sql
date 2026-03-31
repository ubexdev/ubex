-- Migration 003: Align levels table with admin panel expectations
-- The admin panel code uses different column names than the original schema.
-- This adds aliases/columns so both old and new code work.
-- Run in Supabase SQL Editor

-- Add columns the admin panel expects that don't exist yet
ALTER TABLE levels ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 100;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS level_number INTEGER;

-- Backfill level_number from number
UPDATE levels SET level_number = number WHERE level_number IS NULL;

-- Add description column to levels (admin editor uses it)
ALTER TABLE levels ADD COLUMN IF NOT EXISTS description TEXT;

-- Add answer column (admin uses single text answer, original uses JSONB correct_answers)
ALTER TABLE levels ADD COLUMN IF NOT EXISTS answer TEXT;

-- Backfill answer from correct_answers (take first element)
UPDATE levels SET answer = correct_answers->>0 WHERE answer IS NULL AND correct_answers IS NOT NULL;
