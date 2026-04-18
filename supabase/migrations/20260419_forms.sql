-- Website form submission schema
-- Run this against the Supabase project used by Meridian Clinic Intelligence.
-- Idempotent: safe to re-run.

------------------------------------------------------------
-- Schema
------------------------------------------------------------
create schema if not exists website;

------------------------------------------------------------
-- Referrals
------------------------------------------------------------
create table if not exists website.referrals (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  -- Referrer
  referrer_first_name    text not null,
  referrer_last_name     text not null,
  referrer_relation      text not null,
  referrer_phone         text not null,
  referrer_email         text not null,
  -- Patient
  patient_first_name     text not null,
  patient_last_name      text not null,
  patient_email          text not null,
  patient_phone          text not null,
  patient_dob            date not null,
  reason_for_referral    text not null,
  -- Consent
  consent_given          boolean not null,
  signature              text not null,
  submission_date        date not null,
  -- Meta
  source_ip              inet,
  user_agent             text,
  status                 text not null default 'new' check (status in ('new','contacted','booked','archived')),
  notes                  text
);

create index if not exists referrals_created_at_idx on website.referrals (created_at desc);
create index if not exists referrals_status_idx on website.referrals (status);
create index if not exists referrals_patient_name_idx on website.referrals (patient_last_name, patient_first_name);

------------------------------------------------------------
-- Career applications
------------------------------------------------------------
create table if not exists website.career_applications (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  applying_position  text not null,
  name               text not null,
  email              text not null,
  phone              text not null,
  applicant_type     text not null,
  message            text,
  cv_path            text,            -- storage path within bucket 'career-cvs'
  cover_letter_path  text,            -- storage path within bucket 'career-cvs'
  source_ip          inet,
  user_agent         text,
  status             text not null default 'new' check (status in ('new','reviewing','interview','hired','rejected','archived')),
  notes              text
);

create index if not exists career_applications_created_at_idx on website.career_applications (created_at desc);
create index if not exists career_applications_status_idx on website.career_applications (status);
create index if not exists career_applications_position_idx on website.career_applications (applying_position);

------------------------------------------------------------
-- Row-level security
-- Writes happen via service role from the Netlify Function (bypasses RLS).
-- Reads from the Intelligence Platform use the service role too, so we
-- deny anon/authenticated access by default.
------------------------------------------------------------
alter table website.referrals enable row level security;
alter table website.career_applications enable row level security;

-- Explicitly: no policies = no access for anon / authenticated roles.
-- Only service_role (which bypasses RLS) can read/write.
-- If you later add a staff dashboard with Supabase auth, add read policies here.

------------------------------------------------------------
-- Storage bucket for CVs / cover letters
-- Private bucket — staff access via signed URLs generated server-side.
------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('career-cvs', 'career-cvs', false)
on conflict (id) do nothing;

-- No anon upload/read policies on the bucket.
-- The Netlify Function uploads via service role (bypasses RLS),
-- and staff read via signed URLs issued by a server-side helper.
