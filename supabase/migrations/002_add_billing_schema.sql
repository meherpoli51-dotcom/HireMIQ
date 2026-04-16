-- HireMIQ Billing & Workspace Schema
-- Migration 002: Workspaces, Subscriptions, Usage Tracking
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Create workspaces FIRST (no circular dependency)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workspaces (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier        TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  logo_url    TEXT,
  timezone    TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  members_count INTEGER NOT NULL DEFAULT 1,
  max_members INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspace_owner    ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_tier     ON workspaces(tier);
CREATE INDEX IF NOT EXISTS idx_workspace_slug     ON workspaces(slug);

-- ============================================================================
-- STEP 2: Extend users table (now workspaces exists)
-- ============================================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tier               TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS primary_workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS avatar_url         TEXT,
  ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- STEP 3: Workspace members (team collaboration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workspace_members (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'recruiter' CHECK (role IN ('owner', 'admin', 'recruiter', 'viewer')),
  invited_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user      ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_role      ON workspace_members(workspace_id, role);

-- ============================================================================
-- STEP 4: Subscriptions
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id             UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_customer_id     TEXT,
  status                   TEXT NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','active','paused','payment_failed','cancelled','expired')),
  plan                     TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
  amount_paisa             INTEGER,
  billing_cycle_start      TIMESTAMPTZ,
  billing_cycle_end        TIMESTAMPTZ,
  paid_until               TIMESTAMPTZ,
  attempted_charge_date    TIMESTAMPTZ,
  failure_reason           TEXT,
  failure_count            INTEGER NOT NULL DEFAULT 0,
  started_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at             TIMESTAMPTZ,
  cancellation_reason      TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_workspace      ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscription_status_active  ON subscriptions(workspace_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscription_razorpay       ON subscriptions(razorpay_subscription_id);

-- ============================================================================
-- STEP 5: Usage tracking (credit metering)
-- ============================================================================

CREATE TABLE IF NOT EXISTS usage (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action           TEXT NOT NULL CHECK (action IN ('jd_analyze','candidate_assess','resume_parse')),
  resource_id      TEXT,
  job_title        TEXT,
  client_name      TEXT,
  credits_consumed INTEGER NOT NULL DEFAULT 1,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_workspace      ON usage(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_user           ON usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_workspace_month
  ON usage(workspace_id, DATE_TRUNC('month', created_at DESC));

-- Monthly rollup (analytics / fast reads)
CREATE TABLE IF NOT EXISTS usage_monthly_rollup (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id             UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  year_month               DATE NOT NULL,
  total_jd_analyses        INTEGER NOT NULL DEFAULT 0,
  total_assessments        INTEGER NOT NULL DEFAULT 0,
  total_candidates_matched INTEGER NOT NULL DEFAULT 0,
  credits_used             INTEGER NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, year_month)
);

CREATE INDEX IF NOT EXISTS idx_usage_rollup ON usage_monthly_rollup(workspace_id, year_month DESC);

-- ============================================================================
-- STEP 6: Credit transactions (audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS credit_transactions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL
    CHECK (transaction_type IN ('monthly_reset','usage_charge','team_bonus','rollover','overage','manual_adjustment')),
  credits_delta    INTEGER NOT NULL,
  balance_before   INTEGER,
  balance_after    INTEGER,
  reason           TEXT,
  related_id       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_workspace ON credit_transactions(workspace_id);

-- ============================================================================
-- STEP 7: Webhook events (idempotency)
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id            TEXT PRIMARY KEY,
  event_type    TEXT NOT NULL,
  source        TEXT NOT NULL DEFAULT 'razorpay',
  entity_id     TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processed','failed')),
  error_message TEXT,
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);

-- ============================================================================
-- STEP 8: Row-Level Security
-- ============================================================================

ALTER TABLE workspaces         ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage              ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_monthly_rollup ENABLE ROW LEVEL SECURITY;

-- Workspaces: visible to owner + members
CREATE POLICY "workspace_select" ON workspaces FOR SELECT
  USING (
    owner_id = auth.uid() OR
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND accepted_at IS NOT NULL)
  );

-- Service role can do everything (used by API routes)
CREATE POLICY "workspace_service_all" ON workspaces FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "members_select" ON workspace_members FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "members_service_all" ON workspace_members FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "subscriptions_service_all" ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "usage_select" ON usage FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "usage_service_all" ON usage FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "credit_tx_select" ON credit_transactions FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "credit_tx_service_all" ON credit_transactions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "rollup_select" ON usage_monthly_rollup FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "rollup_service_all" ON usage_monthly_rollup FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 9: Auto-update updated_at triggers
-- ============================================================================

-- Reuse function from migration 001 if it exists, otherwise create
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workspace_members_updated_at
  BEFORE UPDATE ON workspace_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER usage_rollup_updated_at
  BEFORE UPDATE ON usage_monthly_rollup
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
