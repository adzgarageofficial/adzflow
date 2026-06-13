alter table quotations
  add column if not exists walk_in_name  text,
  add column if not exists walk_in_car   text,
  add column if not exists walk_in_plate text;
