
-- ENUMS
CREATE TYPE public.loyalty_txn_type AS ENUM ('earn','redeem','adjust','expire','bonus');
CREATE TYPE public.interaction_type AS ENUM ('call','visit','email','sms','chat','meeting','complaint','followup');
CREATE TYPE public.feedback_source AS ENUM ('in_store','sms','email','web','google','facebook','other');
CREATE TYPE public.feedback_sentiment AS ENUM ('positive','neutral','negative');
CREATE TYPE public.referral_status AS ENUM ('pending','qualified','rewarded','expired');

-- LOYALTY TIERS
CREATE TABLE public.loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  min_points INTEGER NOT NULL DEFAULT 0,
  multiplier NUMERIC NOT NULL DEFAULT 1,
  perks TEXT,
  color TEXT DEFAULT '#64748b',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.loyalty_tiers TO authenticated;
GRANT ALL ON public.loyalty_tiers TO service_role;
ALTER TABLE public.loyalty_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read loyalty_tiers" ON public.loyalty_tiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "mkt write loyalty_tiers" ON public.loyalty_tiers FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'marketing'::app_role]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'marketing'::app_role]));
CREATE TRIGGER trg_loyalty_tiers_updated BEFORE UPDATE ON public.loyalty_tiers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LOYALTY TRANSACTIONS
CREATE TABLE public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  type loyalty_txn_type NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT,
  order_id UUID,
  balance_after INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_loyalty_txn_customer ON public.loyalty_transactions(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loyalty_transactions TO authenticated;
GRANT ALL ON public.loyalty_transactions TO service_role;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read loyalty_txn" ON public.loyalty_transactions FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role,'finance'::app_role]));
CREATE POLICY "ops write loyalty_txn" ON public.loyalty_transactions FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]));

-- Trigger: auto-update customer loyalty_points + balance_after
CREATE OR REPLACE FUNCTION public.apply_loyalty_transaction()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  cur_points INTEGER;
  delta INTEGER;
BEGIN
  SELECT loyalty_points INTO cur_points FROM public.customers WHERE id = NEW.customer_id FOR UPDATE;
  IF cur_points IS NULL THEN cur_points := 0; END IF;
  delta := CASE
    WHEN NEW.type IN ('earn','bonus','adjust') THEN NEW.points
    WHEN NEW.type IN ('redeem','expire') THEN -ABS(NEW.points)
    ELSE NEW.points
  END;
  UPDATE public.customers SET loyalty_points = cur_points + delta, updated_at = now() WHERE id = NEW.customer_id;
  NEW.balance_after := cur_points + delta;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_loyalty_txn_apply BEFORE INSERT ON public.loyalty_transactions
  FOR EACH ROW EXECUTE FUNCTION public.apply_loyalty_transaction();

-- CUSTOMER INTERACTIONS
CREATE TABLE public.customer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  type interaction_type NOT NULL,
  channel TEXT,
  subject TEXT NOT NULL,
  body TEXT,
  outcome TEXT,
  followup_at TIMESTAMPTZ,
  assigned_to UUID,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_interactions_customer ON public.customer_interactions(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_interactions TO authenticated;
GRANT ALL ON public.customer_interactions TO service_role;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read interactions" ON public.customer_interactions FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role,'mechanic'::app_role]));
CREATE POLICY "ops write interactions" ON public.customer_interactions FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]));
CREATE TRIGGER trg_interactions_updated BEFORE UPDATE ON public.customer_interactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CUSTOMER FEEDBACK
CREATE TABLE public.customer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_number TEXT NOT NULL UNIQUE DEFAULT ('FB-' || to_char(now(),'YYYYMMDDHH24MISS') || '-' || substr(gen_random_uuid()::text, 1, 4)),
  customer_id UUID,
  order_id UUID,
  source feedback_source NOT NULL DEFAULT 'in_store',
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT,
  sentiment feedback_sentiment NOT NULL DEFAULT 'neutral',
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_feedback_customer ON public.customer_feedback(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_feedback TO authenticated;
GRANT ALL ON public.customer_feedback TO service_role;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read feedback" ON public.customer_feedback FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role,'mechanic'::app_role,'finance'::app_role]));
CREATE POLICY "ops write feedback" ON public.customer_feedback FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]));
CREATE TRIGGER trg_feedback_updated BEFORE UPDATE ON public.customer_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REFERRALS
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT NOT NULL UNIQUE DEFAULT ('REF-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  referrer_id UUID NOT NULL,
  referred_id UUID,
  referred_name TEXT,
  referred_phone TEXT,
  status referral_status NOT NULL DEFAULT 'pending',
  reward_points INTEGER NOT NULL DEFAULT 0,
  qualified_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops read referrals" ON public.referrals FOR SELECT TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]));
CREATE POLICY "ops write referrals" ON public.referrals FOR ALL TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]))
  WITH CHECK (has_any_role(auth.uid(), ARRAY['owner'::app_role,'admin'::app_role,'cashier'::app_role,'marketing'::app_role]));
CREATE TRIGGER trg_referrals_updated BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default loyalty tiers
INSERT INTO public.loyalty_tiers (name, min_points, multiplier, perks, color) VALUES
  ('Bronze', 0, 1.0, 'Basic member benefits', '#cd7f32'),
  ('Silver', 500, 1.25, '5% discount on parts, priority booking', '#94a3b8'),
  ('Gold', 2000, 1.5, '10% discount, free diagnostics, birthday bonus', '#eab308'),
  ('Platinum', 5000, 2.0, '15% discount, VIP service, free pickup/delivery', '#a78bfa')
ON CONFLICT (name) DO NOTHING;
