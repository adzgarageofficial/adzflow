-- Bay Queue: exactly 8 rows, one per bay, updated in-place by mechanics.
-- Public read policy so the customer lounge display works without auth.

create table if not exists bay_queue (
  bay_number smallint primary key check (bay_number between 1 and 8),
  status     text      not null default 'empty'
               check (status in ('empty','waiting','in_progress','quality_check','done')),
  customer_name  text,
  vehicle_info   text,
  mechanic_name  text,
  services       jsonb    not null default '[]'::jsonb,
  progress       smallint not null default 0 check (progress between 0 and 100),
  notes          text,
  started_at     timestamptz,
  updated_at     timestamptz not null default now()
);

-- Seed the 8 bays (no-op if already present)
insert into bay_queue (bay_number)
select generate_series(1, 8)
on conflict do nothing;

-- Keep updated_at fresh on every write
create or replace function touch_bay_queue()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists bay_queue_touch on bay_queue;
create trigger bay_queue_touch
  before update on bay_queue
  for each row execute function touch_bay_queue();

-- RLS
alter table bay_queue enable row level security;

drop policy if exists "bay_queue_select" on bay_queue;
create policy "bay_queue_select" on bay_queue
  for select using (true);

drop policy if exists "bay_queue_update" on bay_queue;
create policy "bay_queue_update" on bay_queue
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
