-- IciWork Supabase schema (frontend-first)
-- Run this in Supabase SQL Editor

create extension if not exists pgcrypto;

-- CLIENT PROFILES
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  postal_code text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PROVIDER PROFILES
create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  provider_type text not null check (provider_type in ('particulier', 'professionnel')),
  company_name text,
  siret text,
  primary_category text,
  primary_job text,
  postal_code text,
  intervention_radius_km int default 20,
  bio text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists trg_providers_updated_at on public.providers;
create trigger trg_providers_updated_at
before update on public.providers
for each row execute function public.set_updated_at();

-- RLS
alter table public.clients enable row level security;
alter table public.providers enable row level security;

-- Clients policies
-- Read your own profile
create policy if not exists "clients_select_own"
on public.clients
for select
using (auth.uid() = auth_user_id);

-- Insert your own profile
create policy if not exists "clients_insert_own"
on public.clients
for insert
with check (auth.uid() = auth_user_id);

-- Update your own profile
create policy if not exists "clients_update_own"
on public.clients
for update
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

-- Providers policies
-- Public can read only published providers
create policy if not exists "providers_select_published"
on public.providers
for select
using (is_published = true or auth.uid() = auth_user_id);

-- Insert your own provider profile
create policy if not exists "providers_insert_own"
on public.providers
for insert
with check (auth.uid() = auth_user_id);

-- Update your own provider profile
create policy if not exists "providers_update_own"
on public.providers
for update
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);
