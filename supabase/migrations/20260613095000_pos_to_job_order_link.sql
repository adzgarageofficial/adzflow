-- Link POS orders to job orders, and service queue entries to job orders.
-- When a cashier confirms an installation sale, a Job Order is auto-created
-- and linked here so the bay queue can reference the JO number.

alter table public.job_orders
  add column if not exists order_id uuid references public.orders(id) on delete set null;

alter table public.service_queue
  add column if not exists job_order_id uuid references public.job_orders(id) on delete set null;

create index if not exists idx_job_orders_order on public.job_orders(order_id);
create index if not exists idx_service_queue_jo on public.service_queue(job_order_id);
