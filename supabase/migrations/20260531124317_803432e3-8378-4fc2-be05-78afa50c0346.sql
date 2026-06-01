
-- Phase 7: Operations Enhancement
-- 1) Stock transfers between warehouses
CREATE TYPE public.transfer_status AS ENUM ('draft','in_transit','received','cancelled');

CREATE TABLE public.stock_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_number text NOT NULL UNIQUE,
  source_warehouse_id uuid NOT NULL,
  destination_warehouse_id uuid NOT NULL,
  status transfer_status NOT NULL DEFAULT 'draft',
  notes text,
  shipped_at timestamptz,
  received_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_transfers TO authenticated;
GRANT ALL ON public.stock_transfers TO service_role;
ALTER TABLE public.stock_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv read transfers" ON public.stock_transfers FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write transfers" ON public.stock_transfers FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::app_role[]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::app_role[]));

CREATE TABLE public.stock_transfer_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid NOT NULL REFERENCES public.stock_transfers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  variant_id uuid,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_transfer_items TO authenticated;
GRANT ALL ON public.stock_transfer_items TO service_role;
ALTER TABLE public.stock_transfer_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv read transfer items" ON public.stock_transfer_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write transfer items" ON public.stock_transfer_items FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::app_role[]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::app_role[]));

-- 2) POS cash drawer sessions
CREATE TYPE public.drawer_status AS ENUM ('open','closed');

CREATE TABLE public.cash_drawer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_number text NOT NULL UNIQUE,
  cashier_id uuid NOT NULL,
  branch_id uuid,
  opening_balance numeric(12,2) NOT NULL DEFAULT 0,
  closing_balance numeric(12,2),
  expected_cash numeric(12,2) NOT NULL DEFAULT 0,
  cash_sales numeric(12,2) NOT NULL DEFAULT 0,
  variance numeric(12,2) NOT NULL DEFAULT 0,
  status drawer_status NOT NULL DEFAULT 'open',
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cash_drawer_sessions TO authenticated;
GRANT ALL ON public.cash_drawer_sessions TO service_role;
ALTER TABLE public.cash_drawer_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read drawers" ON public.cash_drawer_sessions FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::app_role[]));
CREATE POLICY "ops write drawers" ON public.cash_drawer_sessions FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::app_role[]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::app_role[]));

-- 3) Order refunds / voids
CREATE TYPE public.refund_status AS ENUM ('pending','approved','rejected','completed');

CREATE TABLE public.order_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_number text NOT NULL UNIQUE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  reason text NOT NULL,
  status refund_status NOT NULL DEFAULT 'pending',
  requested_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  refund_method text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_refunds TO authenticated;
GRANT ALL ON public.order_refunds TO service_role;
ALTER TABLE public.order_refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read refunds" ON public.order_refunds FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::app_role[]));
CREATE POLICY "ops write refunds" ON public.order_refunds FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::app_role[]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::app_role[]));

-- 4) Job order status history
CREATE TABLE public.job_order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_order_id uuid NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_order_status_history TO authenticated;
GRANT ALL ON public.job_order_status_history TO service_role;
ALTER TABLE public.job_order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read job history" ON public.job_order_status_history FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic','finance']::app_role[]));
CREATE POLICY "ops write job history" ON public.job_order_status_history FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::app_role[]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::app_role[]));

-- Timestamp triggers
CREATE TRIGGER update_stock_transfers_updated_at BEFORE UPDATE ON public.stock_transfers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cash_drawer_sessions_updated_at BEFORE UPDATE ON public.cash_drawer_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_order_refunds_updated_at BEFORE UPDATE ON public.order_refunds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
