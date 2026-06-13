-- Add delivery_token to purchase_orders for the magic-link supplier receipt flow.
-- Token is generated on first "Share Delivery Link" click; NULL until then.
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS delivery_token UUID UNIQUE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_po_delivery_token ON public.purchase_orders(delivery_token);
