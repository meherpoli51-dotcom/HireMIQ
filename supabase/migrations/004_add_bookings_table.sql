-- Migration 004: Add bookings table for consultation request form
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  preferred_date date,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Index for quick lookups by status and date
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- No RLS needed — only accessible via service role key (server-side API)
-- Admins can view all bookings in Supabase Table Editor
