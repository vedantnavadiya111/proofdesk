-- ============================================================
-- ProofDesk — Supabase Schema (Idempotent / Clean Setup)
-- Run this in the Supabase SQL Editor to create all tables cleanly.
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Clean teardown of existing objects (safe re-run)
drop table if exists public.activity_logs cascade;
drop table if exists public.call_requests cascade;
drop table if exists public.peer_volunteers cascade;
drop table if exists public.dossiers cascade;
drop table if exists public.leads cascade;
drop table if exists public.evidence cascade;
drop table if exists public.universities cascade;

drop type if exists evidence_status cascade;
drop type if exists lead_status cascade;
drop type if exists dossier_language cascade;
drop type if exists experiment_group cascade;
drop type if exists consent_status cascade;
drop type if exists call_request_status cascade;

-- ─── Types ──────────────────────────────────────────────────
create type evidence_status as enum (
  'VERIFIED',
  'NOT_YET_VERIFIED',
  'NOT_YET_PROVEN',
  'CONFLICTING_EVIDENCE'
);

create type lead_status as enum (
  'new',
  'counselling_scheduled',
  'counselling_completed',
  'stalled',
  'dossier_generated',
  'dossier_delivered',
  'peer_call_requested',
  'peer_call_booked',
  'seat_block_paid',
  'enrolled',
  'opted_out'
);

create type dossier_language as enum ('en', 'hi', 'te');
create type experiment_group as enum ('control', 'test');
create type consent_status as enum ('pending', 'consented', 'revoked');
create type call_request_status as enum (
  'requested',
  'matched',
  'scheduled',
  'completed',
  'cancelled'
);

-- ─── Universities ───────────────────────────────────────────
create table public.universities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  short_name text not null,
  city text not null,
  state text not null,
  established_year int,
  university_type text not null default 'Private',
  official_website text not null,
  ugc_url text,
  niat_campus_url text,
  niat_collaboration_details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Evidence ───────────────────────────────────────────────
create table public.evidence (
  id uuid primary key default uuid_generate_v4(),
  university_id uuid not null references public.universities(id) on delete cascade,
  category text not null,
  claim text not null,
  source_organisation text not null,
  source_title text not null,
  source_url text not null,
  publication_date date,
  date_checked date not null default current_date,
  status evidence_status not null default 'NOT_YET_VERIFIED',
  explanation text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_evidence_university on public.evidence(university_id);
create index idx_evidence_category on public.evidence(category);

-- ─── Leads ──────────────────────────────────────────────────
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  student_name text not null,
  parent_name text not null,
  parent_phone text,
  parent_email text,
  university_id uuid not null references public.universities(id),
  city text not null,
  state text not null default '',
  preferred_language dossier_language not null default 'en',
  lead_source text not null default 'NIAT counselling',
  lead_status lead_status not null default 'new',
  experiment_group experiment_group not null default 'test',
  counselling_date date,
  counselling_completed boolean not null default false,
  days_since_counselling int,
  seat_block_payment boolean not null default false,
  seat_block_payment_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_status on public.leads(lead_status);
create index idx_leads_university on public.leads(university_id);

-- ─── Dossiers ───────────────────────────────────────────────
create table public.dossiers (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  university_id uuid not null references public.universities(id),
  language dossier_language not null default 'en',
  share_token text not null unique,
  generated_content jsonb,
  generation_status text not null default 'pending',
  generation_error text,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_dossiers_token on public.dossiers(share_token);
create index idx_dossiers_lead on public.dossiers(lead_id);

-- ─── Peer Volunteers ────────────────────────────────────────
create table public.peer_volunteers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null default 'student',
  university_id uuid not null references public.universities(id),
  language dossier_language not null default 'en',
  city text not null,
  state text not null default '',
  year_of_joining int,
  bio text,
  consent_status consent_status not null default 'pending',
  is_available boolean not null default true,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Call Requests ──────────────────────────────────────────
create table public.call_requests (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  volunteer_id uuid references public.peer_volunteers(id),
  dossier_id uuid references public.dossiers(id),
  preferred_time text,
  preferred_language dossier_language not null default 'en',
  status call_request_status not null default 'requested',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Activity Logs ──────────────────────────────────────────
create table public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads(id) on delete set null,
  dossier_id uuid references public.dossiers(id) on delete set null,
  action text not null,
  details jsonb,
  performed_by text not null default 'system',
  created_at timestamptz not null default now()
);

create index idx_activity_lead on public.activity_logs(lead_id);
create index idx_activity_dossier on public.activity_logs(dossier_id);
create index idx_activity_created on public.activity_logs(created_at desc);

-- ─── Row Level Security ─────────────────────────────────────
alter table public.universities enable row level security;
alter table public.evidence enable row level security;
alter table public.leads enable row level security;
alter table public.dossiers enable row level security;
alter table public.peer_volunteers enable row level security;
alter table public.call_requests enable row level security;
alter table public.activity_logs enable row level security;

-- Universities & Evidence (public read)
create policy "Universities are publicly readable"
  on public.universities for select using (true);

create policy "Universities insertable"
  on public.universities for insert with check (true);

create policy "Evidence is publicly readable"
  on public.evidence for select using (true);

create policy "Evidence insertable"
  on public.evidence for insert with check (true);

-- Leads
create policy "Leads readable"
  on public.leads for select using (true);

create policy "Leads insertable"
  on public.leads for insert with check (true);

create policy "Leads updatable"
  on public.leads for update using (true);

-- Dossiers
create policy "Dossiers readable by token"
  on public.dossiers for select using (true);

create policy "Dossiers insertable"
  on public.dossiers for insert with check (true);

create policy "Dossiers updatable"
  on public.dossiers for update using (true);

-- Peer Volunteers
create policy "Volunteers publicly readable"
  on public.peer_volunteers for select using (true);

create policy "Volunteers insertable"
  on public.peer_volunteers for insert with check (true);

-- Call Requests
create policy "Call requests readable"
  on public.call_requests for select using (true);

create policy "Call requests insertable"
  on public.call_requests for insert with check (true);

-- Activity Logs
create policy "Activity logs readable"
  on public.activity_logs for select using (true);

create policy "Activity logs insertable"
  on public.activity_logs for insert with check (true);

-- ─── Helper Functions ───────────────────────────────────────
create or replace function public.increment_view_count(token text)
returns void as $$
  update public.dossiers
  set view_count = view_count + 1,
      updated_at = now()
  where share_token = token;
$$ language sql security definer;
