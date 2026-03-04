-- Test rows for quick UI checks (without auth link)
-- Run after schema.sql in Supabase SQL Editor

insert into public.clients (
  first_name,
  last_name,
  email,
  phone,
  postal_code,
  city
)
values (
  'Amadou',
  'Diallo',
  'client.test@iciwork.local',
  '0600000001',
  '33000',
  'Bordeaux'
)
on conflict do nothing;

insert into public.providers (
  first_name,
  last_name,
  email,
  phone,
  provider_type,
  company_name,
  siret,
  primary_category,
  primary_job,
  postal_code,
  intervention_radius_km,
  bio,
  is_published
)
values (
  'Sophie',
  'Martin',
  'presta.test@iciwork.local',
  '0600000002',
  'professionnel',
  'SM Services',
  '12345678901234',
  'Plomberie',
  'Plombier-chauffagiste',
  '33100',
  20,
  'Interventions rapides en plomberie et depannage a domicile.',
  true
)
on conflict do nothing;
