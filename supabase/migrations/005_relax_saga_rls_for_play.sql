-- Migration 005: Relax saga RLS to allow viewing sagas with is_active=true OR status='active'
-- Also allow anonymous users to view playable sagas (for /play page without auth)

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Active sagas are viewable by everyone" ON sagas;
DROP POLICY IF EXISTS "Levels of active sagas are viewable" ON levels;

-- Sagas: viewable if status='active' OR is_active=true OR owned by current user
CREATE POLICY "Playable sagas are viewable by everyone"
  ON sagas FOR SELECT USING (
    status = 'active' OR is_active = true OR created_by = auth.uid()
  );

-- Levels: viewable if parent saga is playable (same logic)
CREATE POLICY "Levels of playable sagas are viewable"
  ON levels FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sagas
      WHERE sagas.id = levels.saga_id
      AND (sagas.status = 'active' OR sagas.is_active = true OR sagas.created_by = auth.uid())
    )
  );
