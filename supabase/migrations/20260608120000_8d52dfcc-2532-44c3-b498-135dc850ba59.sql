-- Discount approval requests: cashier requests an owner/admin sign-off before
-- a peso-value POS discount can be applied to a sale.
CREATE TYPE public.discount_approval_status AS ENUM ('pending', 'approved', 'denied');

CREATE TABLE public.discount_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requested_by UUID NOT NULL,
  requested_by_name TEXT,
  amount NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  customer_label TEXT,
  status public.discount_approval_status NOT NULL DEFAULT 'pending',
  decided_by UUID,
  decided_by_name TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  decision_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.discount_approvals TO authenticated;
GRANT ALL ON public.discount_approvals TO service_role;

ALTER TABLE public.discount_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff or requester read discount approvals" ON public.discount_approvals
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR requested_by = auth.uid());

CREATE POLICY "auth create own discount approval" ON public.discount_approvals
  FOR INSERT TO authenticated
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "staff decide discount approval" ON public.discount_approvals
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX idx_discount_approvals_status ON public.discount_approvals(status);
CREATE INDEX idx_discount_approvals_requested_by ON public.discount_approvals(requested_by, created_at DESC);
