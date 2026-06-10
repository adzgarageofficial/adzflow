-- Recurring bills tracker for Finance — fixed periodic costs (electricity,
-- wifi, rent, etc.) that the owner currently has to remember to log manually
-- every cycle. Register a bill once with its frequency + next due date; the
-- Finance page surfaces upcoming/overdue bills, lets staff record a payment
-- (which posts a normal outflow to finance_transactions and rolls the due
-- date forward), and reminds the owner via the existing "finance" notification
-- category. RLS mirrors finance_transactions (owner/admin/finance).
CREATE TYPE public.bill_frequency AS ENUM ('weekly', 'monthly', 'quarterly', 'annually');

CREATE TABLE public.recurring_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'utilities',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  frequency public.bill_frequency NOT NULL DEFAULT 'monthly',
  next_due_date DATE NOT NULL,
  method public.payment_method,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_recurring_bills_updated BEFORE UPDATE ON public.recurring_bills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.recurring_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fin read bills" ON public.recurring_bills FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]));
CREATE POLICY "fin write bills" ON public.recurring_bills FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]));
