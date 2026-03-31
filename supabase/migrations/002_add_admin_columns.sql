-- Migration 002: Add columns needed by admin panel and game API
-- Run in Supabase SQL Editor

-- Sagas: new columns for admin CRUD
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium';
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS estimated_duration INTEGER;
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS total_levels INTEGER DEFAULT 0;

-- Levels: new columns for level editor
ALTER TABLE levels ADD COLUMN IF NOT EXISTS answer_type TEXT DEFAULT 'text';
ALTER TABLE levels ADD COLUMN IF NOT EXISTS proximity_radius INTEGER DEFAULT 50;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS hints JSONB DEFAULT '[]';
ALTER TABLE levels ADD COLUMN IF NOT EXISTS time_limit INTEGER;

-- Profiles: new columns for user management
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;
