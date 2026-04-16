-- Migration 003: Add pipeline tracking columns to candidates table
-- These columns support the pipeline Kanban board and candidate persistence

-- Add columns for pipeline tracking (IF NOT EXISTS for idempotency)
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS candidate_name text;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS match_score numeric;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verdict text;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS pipeline_stage text DEFAULT 'sourced';

-- Make resume_file_name nullable (not all candidates have a file)
ALTER TABLE candidates ALTER COLUMN resume_file_name DROP NOT NULL;

-- Make match_result nullable (will be populated, but allow graceful insert)
ALTER TABLE candidates ALTER COLUMN match_result DROP NOT NULL;

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_candidates_user ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_pipeline_stage ON candidates(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at);

-- 90-day data retention: scheduled cleanup function
-- Run this via Supabase cron (pg_cron) or an external scheduler
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete candidates older than 90 days (for free tier users)
  DELETE FROM candidates
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND user_id IN (
      SELECT u.id FROM users u
      LEFT JOIN workspace_members wm ON wm.user_id = u.id
      LEFT JOIN workspaces w ON w.id = wm.workspace_id
      WHERE w.tier IS NULL OR w.tier = 'free'
    );

  -- Delete analyses older than 90 days (for free tier users)
  DELETE FROM analyses
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND user_id IN (
      SELECT u.id FROM users u
      LEFT JOIN workspace_members wm ON wm.user_id = u.id
      LEFT JOIN workspaces w ON w.id = wm.workspace_id
      WHERE w.tier IS NULL OR w.tier = 'free'
    );
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup daily at 2:00 AM UTC (requires pg_cron extension)
-- Uncomment after enabling pg_cron in your Supabase project settings:
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data()');
