-- Store walk-in customer/vehicle details directly on job_orders.
-- When POS creates a JO for an unregistered customer, these carry the
-- name/vehicle/plate so the Workshop page can display them without a
-- service_queue join.

alter table public.job_orders
  add column if not exists walk_in_name    text,
  add column if not exists walk_in_vehicle text,
  add column if not exists walk_in_plate   text;
