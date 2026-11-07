-- Run this once in the Supabase SQL Editor.
create table if not exists public.portfolio_content (
  id text primary key check (id = 'site'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.portfolio_content enable row level security;
alter table public.portfolio_admins enable row level security;

grant select on public.portfolio_content to anon, authenticated;
grant insert, update on public.portfolio_content to authenticated;
grant select on public.portfolio_admins to authenticated;

create policy "Published portfolio content is readable"
  on public.portfolio_content for select
  to anon, authenticated
  using (true);

create policy "Admins can read their own allowlist entry"
  on public.portfolio_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Allowlisted admins can create portfolio content"
  on public.portfolio_content for insert
  to authenticated
  with check (
    exists (
      select 1 from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

create policy "Allowlisted admins can update portfolio content"
  on public.portfolio_content for update
  to authenticated
  using (
    exists (
      select 1 from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

insert into public.portfolio_content (id, data)
values ('site', '{}'::jsonb)
on conflict (id) do nothing;

-- After creating your Supabase Auth user, replace the UUID below and run:
-- insert into public.portfolio_admins (user_id)
-- values ('YOUR-AUTH-USER-UUID')
-- on conflict (user_id) do nothing;
