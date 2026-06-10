-- FIFO/FEFO support for stock that ages (tires being the prime example —
-- rubber compounds degrade over time even unsold). Each stock record can now
-- carry an optional expiry/best-by date so Inventory and the POS product
-- picker can surface and sort "earliest-expiring batch sells first."
-- Nullable + additive: existing rows are unaffected.
ALTER TABLE public.inventory_levels
  ADD COLUMN expiry_date DATE;
