-- UBEX Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('player', 'admin');
CREATE TYPE saga_status AS ENUM ('draft', 'active', 'completed');
CREATE TYPE difficulty_mode AS ENUM ('libre', 'explorador');
CREATE TYPE session_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE level_difficulty AS ENUM ('easy', 'medium', 'hard', 'extreme');

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'player',
  team_id UUID,
  total_score INTEGER NOT NULL DEFAULT 0,
  sagas_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAGAS
-- ============================================
CREATE TABLE sagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  prize_amount_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_participants INTEGER NOT NULL DEFAULT 5000,
  status saga_status NOT NULL DEFAULT 'draft',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sagas_status ON sagas(status);
CREATE INDEX idx_sagas_city ON sagas(city);

-- ============================================
-- LEVELS
-- ============================================
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saga_id UUID NOT NULL REFERENCES sagas(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  clue_text TEXT NOT NULL,
  hint TEXT,
  difficulty level_difficulty NOT NULL DEFAULT 'medium',
  spawn_lat DOUBLE PRECISION NOT NULL,
  spawn_lng DOUBLE PRECISION NOT NULL,
  spawn_heading DOUBLE PRECISION NOT NULL DEFAULT 0,
  spawn_pitch DOUBLE PRECISION NOT NULL DEFAULT 0,
  target_lat DOUBLE PRECISION NOT NULL,
  target_lng DOUBLE PRECISION NOT NULL,
  correct_answers JSONB NOT NULL DEFAULT '[]',
  explanation TEXT,
  proximity_radius_m INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(saga_id, number)
);

CREATE INDEX idx_levels_saga ON levels(saga_id);

-- ============================================
-- TEAMS
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(invite_code)
);

-- Add FK from profiles to teams (deferred because teams didn't exist yet)
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- ============================================
-- GAME SESSIONS
-- ============================================
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saga_id UUID NOT NULL REFERENCES sagas(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  current_level INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL DEFAULT 0,
  difficulty difficulty_mode NOT NULL DEFAULT 'libre',
  status session_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_sessions_saga ON game_sessions(saga_id);
CREATE INDEX idx_sessions_status ON game_sessions(status);

-- ============================================
-- LEVEL ATTEMPTS
-- ============================================
CREATE TABLE level_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id),
  answer_given TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  distance_to_target_m DOUBLE PRECISION,
  time_spent_seconds INTEGER NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attempts_session ON level_attempts(session_id);

-- ============================================
-- LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id AS user_id,
  p.display_name,
  p.avatar_url,
  p.total_score,
  p.sagas_completed,
  RANK() OVER (ORDER BY p.total_score DESC) AS rank
FROM profiles p
WHERE p.total_score > 0
ORDER BY p.total_score DESC;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Sagas
ALTER TABLE sagas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active sagas are viewable by everyone"
  ON sagas FOR SELECT USING (status = 'active' OR created_by = auth.uid());

CREATE POLICY "Admins can create sagas"
  ON sagas FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update own sagas"
  ON sagas FOR UPDATE USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete own draft sagas"
  ON sagas FOR DELETE USING (
    created_by = auth.uid() AND status = 'draft' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Levels
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Levels of active sagas are viewable"
  ON levels FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sagas
      WHERE sagas.id = levels.saga_id
      AND (sagas.status = 'active' OR sagas.created_by = auth.uid())
    )
  );

CREATE POLICY "Admins can manage levels"
  ON levels FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Game Sessions
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON game_sessions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own sessions"
  ON game_sessions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own active sessions"
  ON game_sessions FOR UPDATE USING (user_id = auth.uid() AND status = 'active');

-- Level Attempts
ALTER TABLE level_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
  ON level_attempts FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_sessions
      WHERE game_sessions.id = level_attempts.session_id
      AND game_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attempts for own sessions"
  ON level_attempts FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_sessions
      WHERE game_sessions.id = level_attempts.session_id
      AND game_sessions.user_id = auth.uid()
    )
  );

-- Teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT WITH CHECK (auth.uid() = created_by);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_sagas_updated_at
  BEFORE UPDATE ON sagas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED: Demo Saga (Zona Colonial)
-- ============================================
-- Note: Run after creating an admin user. Replace ADMIN_USER_ID.
-- INSERT INTO sagas (title, subtitle, description, city, country, prize_amount_usd, max_participants, status, created_by)
-- VALUES ('Saga de Colón', 'Zona Colonial · Santo Domingo', 'Recorre la ciudad más antigua...', 'Santo Domingo', 'República Dominicana', 1000, 5000, 'active', 'ADMIN_USER_ID');
