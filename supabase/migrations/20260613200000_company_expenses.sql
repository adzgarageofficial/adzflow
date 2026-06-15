create table if not exists public.company_expenses (
  id          uuid         primary key default gen_random_uuid(),
  category    text         not null default 'other',
  amount      numeric(12,2) not null,
  entry_date  date         not null default current_date,
  due_date    date         not null,
  notes       text,
  branch_id   uuid         references public.branches(id) on delete set null,
  paid_at     timestamptz,
  created_at  timestamptz  not null default now()
);

alter table public.company_expenses enable row level security;

create policy "company_expenses_staff_all" on public.company_expenses
  for all to authenticated
  using (public.has_any_role(auth.uid(), array['owner','admin','cashier','inventory','mechanic','marketing','finance']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['owner','admin','cashier','inventory','mechanic','marketing','finance']::public.app_role[]));

grant all on public.company_expenses to authenticated;
