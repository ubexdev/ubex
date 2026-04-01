-- Add saga_type column (Free, Demo, Paid)
ALTER TABLE sagas ADD COLUMN IF NOT EXISTS saga_type TEXT NOT NULL DEFAULT 'free';

-- Backfill existing sagas as 'free'
UPDATE sagas SET saga_type = 'free' WHERE saga_type IS NULL;
