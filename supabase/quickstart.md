# Supabase Quickstart (IciWork)

## 1) Run database SQL
In Supabase Dashboard:
1. Open `SQL Editor`
2. Run `supabase/schema.sql`
3. Run `supabase/seed_test_data.sql`

## 2) Create test auth users
In Supabase Dashboard:
1. Open `Authentication` -> `Users`
2. Click `Add user`

Create these 2 users:
- Client test
  - Email: `client.test@iciwork.local`
  - Password: `ClientTest123!`
  - Mark email as confirmed
- Provider test
  - Email: `presta.test@iciwork.local`
  - Password: `PrestaTest123!`
  - Mark email as confirmed

## 3) Link test users to profile tables
Run this SQL after creating auth users:

```sql
update public.clients c
set auth_user_id = u.id
from auth.users u
where c.email = u.email
  and c.email in ('client.test@iciwork.local');

update public.providers p
set auth_user_id = u.id
from auth.users u
where p.email = u.email
  and p.email in ('presta.test@iciwork.local');
```

## 4) Local env
Set in `.env.local`:

```env
VITE_SUPABASE_URL=https://mcqkhtudjplqzetlvujh.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 5) Run app
```bash
npm run dev
```

You can now sign in with the two test users and start wiring pages to Supabase.
