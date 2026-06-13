-- PO header: supplier reference, shipping details, overall discount, extra charges, bill-to info
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS supplier_ref TEXT,
  ADD COLUMN IF NOT EXISTS credit_term TEXT,
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS shipping_charges NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS adjustments NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overall_discount_pct NUMERIC(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS order_date DATE,
  ADD COLUMN IF NOT EXISTS bill_to TEXT,
  ADD COLUMN IF NOT EXISTS bill_to_address TEXT,
  ADD COLUMN IF NOT EXISTS prepared_by TEXT;

-- PO items: unit type, stacked discount, per-item receive tracking
ALTER TABLE public.purchase_order_items
  ADD COLUMN IF NOT EXISTS unit_type TEXT NOT NULL DEFAULT 'Pc',
  ADD COLUMN IF NOT EXISTS discount_pct TEXT NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS discounted_unit_cost NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS received_at DATE;
