
-- Phase 9: Analytics, Reports, Audit, Settings, Notifications

-- ============ AUDIT LOG ============
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID,
  actor_name TEXT,
  action TEXT NOT NULL, -- create, update, delete, login, export, approve
  entity_type TEXT NOT NULL, -- order, product, employee, etc.
  entity_id TEXT,
  summary TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff read audit" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]));

CREATE POLICY "any insert audit" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ============ NOTIFICATIONS ============
CREATE TYPE public.notification_severity AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE public.notification_category AS ENUM ('inventory', 'finance', 'hr', 'ops', 'crm', 'system');

CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  severity public.notification_severity NOT NULL DEFAULT 'info',
  category public.notification_category NOT NULL DEFAULT 'system',
  link TEXT,
  audience_role TEXT, -- null = broadcast
  user_id UUID, -- null = role / broadcast
  read_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read notifications" ON public.notifications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "staff write notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============ COMPANY SETTINGS ============
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'ADZ Garage',
  legal_name TEXT,
  tin TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  vat_rate NUMERIC NOT NULL DEFAULT 12,
  currency TEXT NOT NULL DEFAULT 'PHP',
  invoice_prefix TEXT DEFAULT 'INV-',
  receipt_footer TEXT,
  fiscal_year_start INTEGER NOT NULL DEFAULT 1,
  is_singleton BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_company_settings_singleton ON public.company_settings(is_singleton) WHERE is_singleton = true;

GRANT SELECT ON public.company_settings TO authenticated;
GRANT UPDATE, INSERT ON public.company_settings TO authenticated;
GRANT ALL ON public.company_settings TO service_role;

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read company" ON public.company_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "owner write company" ON public.company_settings
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin']::public.app_role[]));

CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton
INSERT INTO public.company_settings (company_name, legal_name, address, phone, email, vat_rate)
VALUES ('ADZ Garage', 'ADZ Garage Auto Services Inc.', 'Quezon City, Philippines', '+63 917 000 0000', 'info@adzgarage.ph', 12)
ON CONFLICT DO NOTHING;

-- ============ TAX RATES ============
CREATE TABLE public.tax_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rate NUMERIC NOT NULL DEFAULT 0,
  is_inclusive BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tax_rates TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tax_rates TO authenticated;
GRANT ALL ON public.tax_rates TO service_role;

ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read tax" ON public.tax_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write tax" ON public.tax_rates FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]));

CREATE TRIGGER update_tax_rates_updated_at
  BEFORE UPDATE ON public.tax_rates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tax_rates (name, rate, is_inclusive, description) VALUES
  ('VAT 12%', 12, false, 'Standard Philippine VAT'),
  ('Zero-Rated', 0, false, 'Zero-rated VAT'),
  ('VAT Exempt', 0, false, 'VAT exempt transactions');

-- ============ SAVED REPORTS ============
CREATE TABLE public.saved_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- sales, inventory, payroll, job_orders, customers
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  schedule TEXT, -- cron or null
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_reports TO authenticated;
GRANT ALL ON public.saved_reports TO service_role;

ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff read reports" ON public.saved_reports
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "staff write reports" ON public.saved_reports
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'finance'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'finance'));

CREATE TRIGGER update_saved_reports_updated_at
  BEFORE UPDATE ON public.saved_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
