-- HireMIQ Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Users (managed by NextAuth, but we reference them) ───

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  image text,
  created_at timestamptz default now()
);

-- ─── Analyses ───

create table if not exists analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  job_title text not null,
  client_name text not null,
  location text default '',
  work_mode text default 'Hybrid',
  priority_level text default 'High',
  status text default 'processing' check (status in ('processing', 'completed', 'failed')),
  input jsonb not null,
  result jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_analyses_user on analyses(user_id);
create index idx_analyses_status on analyses(status);

-- ─── Candidates ───

create table if not exists candidates (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references analyses(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  resume_file_name text not null,
  match_result jsonb not null,
  created_at timestamptz default now()
);

create index idx_candidates_analysis on candidates(analysis_id);

-- ─── Assessments ───

create table if not exists assessments (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidates(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  token text unique not null,
  questions jsonb not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'expired')),
  expires_at timestamptz not null,
  time_limit_minutes int default 35,
  max_attempts int default 1,
  created_at timestamptz default now()
);

create unique index idx_assessments_token on assessments(token);
create index idx_assessments_candidate on assessments(candidate_id);

-- ─── Assessment Responses ───

create table if not exists assessment_responses (
  id uuid primary key default uuid_generate_v4(),
  assessment_id uuid references assessments(id) on delete cascade not null,
  answers jsonb not null,
  evaluation jsonb,
  submitted_at timestamptz default now()
);

create index idx_responses_assessment on assessment_responses(assessment_id);

-- ─── Row Level Security ───

alter table analyses enable row level security;
alter table candidates enable row level security;
alter table assessments enable row level security;
alter table assessment_responses enable row level security;

-- Policies: users can only see their own data
create policy "Users see own analyses" on analyses
  for all using (user_id = auth.uid());

create policy "Users see own candidates" on candidates
  for all using (user_id = auth.uid());

create policy "Users see own assessments" on assessments
  for all using (user_id = auth.uid());

-- Assessment responses: accessible by token (for candidate-facing page)
-- The API route handles token validation, so we use service role key for inserts
create policy "Service role manages responses" on assessment_responses
  for all using (true);

-- ─── Updated at trigger ───

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger analyses_updated_at
  before update on analyses
  for each row execute function update_updated_at();
