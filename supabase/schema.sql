-- Run once in the Supabase SQL Editor. This migration is safe to rerun.
begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- Membership can only be granted by the database owner / SQL Editor, never the browser.
create or replace function public.is_couture_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_couture_admin() from public;
grant execute on function public.is_couture_admin() to anon, authenticated;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('work', 'product')),
  title text not null check (char_length(trim(title)) between 1 and 100),
  category text not null check (char_length(trim(category)) between 1 and 60),
  description text not null default '' check (char_length(description) <= 2000),
  alt text not null check (char_length(trim(alt)) between 1 and 250),
  price numeric(12,2),
  unit text,
  image_path text not null unique check (image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_details check (
    (kind = 'product' and price is not null and price > 0 and price <= 100000000
      and unit is not null and unit in ('piece', 'yard') and category in ('readymade', 'materials'))
    or (kind = 'work' and price is null and unit is null)
  )
);
create index if not exists content_items_public on public.content_items(status, kind, created_at desc);
alter table public.content_items enable row level security;
revoke all on public.content_items from anon, authenticated;
grant select on public.content_items to anon;
grant select, insert, update, delete on public.content_items to authenticated;

drop policy if exists "Published items are public" on public.content_items;
create policy "Published items are public" on public.content_items
  for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage content" on public.content_items;
create policy "Admins manage content" on public.content_items
  for all to authenticated using ((select public.is_couture_admin()))
  with check ((select public.is_couture_admin()));

create or replace function public.touch_content_item()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists content_items_updated on public.content_items;
create trigger content_items_updated before update on public.content_items
  for each row execute function public.touch_content_item();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('couture-media', 'couture-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins read couture media" on storage.objects;
create policy "Admins read couture media" on storage.objects for select to authenticated
  using (bucket_id = 'couture-media' and (select public.is_couture_admin()));
drop policy if exists "Admins upload couture media" on storage.objects;
create policy "Admins upload couture media" on storage.objects for insert to authenticated
  with check (bucket_id = 'couture-media' and (select public.is_couture_admin())
    and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Admins delete couture media" on storage.objects;
create policy "Admins delete couture media" on storage.objects for delete to authenticated
  using (bucket_id = 'couture-media' and (select public.is_couture_admin()));

commit;

