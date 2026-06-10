create table if not exists public.promos (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  original_price numeric(12, 2) not null default 0,
  promo_price numeric(12, 2) not null default 0,
  image_url text,
  inclusions text[] not null default '{}',
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promos enable row level security;

create policy "Authenticated users can view promos"
  on public.promos for select
  to authenticated using (true);

create policy "Authenticated users can manage promos"
  on public.promos for all
  to authenticated using (true) with check (true);

-- Storage bucket for promo images
insert into storage.buckets (id, name, public)
values ('promo-images', 'promo-images', true)
on conflict (id) do nothing;

create policy "Public read promo images"
  on storage.objects for select
  using (bucket_id = 'promo-images');

create policy "Authenticated upload promo images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'promo-images');

create policy "Authenticated delete promo images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'promo-images');
