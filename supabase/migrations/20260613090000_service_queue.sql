-- Service Queue: waiting list that feeds into bay_queue.
-- When a customer is reserved from POS, they land here (status='waiting').
-- Staff/mechanic picks them from here and assigns to a physical bay.

create table if not exists service_queue (
  id                    uuid primary key default gen_random_uuid(),
  customer_name         text not null,
  vehicle_info          text,
  plate_number          text,
  services              jsonb not null default '[]'::jsonb,
  reference_number      text,
  reference_image_url   text,
  reservation_number    text,
  status                text not null default 'waiting'
                          check (status in ('waiting','in_bay','done','cancelled')),
  bay_assigned          smallint,
  queued_at             timestamptz not null default now(),
  notes                 text,
  created_by            uuid references auth.users(id)
);

alter table service_queue enable row level security;

drop policy if exists "sq_select" on service_queue;
create policy "sq_select" on service_queue
  for select using (true);

drop policy if exists "sq_write" on service_queue;
create policy "sq_write" on service_queue
  for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
