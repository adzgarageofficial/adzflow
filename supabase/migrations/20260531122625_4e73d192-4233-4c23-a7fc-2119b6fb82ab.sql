
-- Enums
DO $$ BEGIN
  CREATE TYPE public.leave_status AS ENUM ('pending','approved','rejected','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Leave Types
CREATE TABLE public.leave_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  is_paid boolean NOT NULL DEFAULT true,
  default_days_per_year numeric NOT NULL DEFAULT 0,
  requires_approval boolean NOT NULL DEFAULT true,
  color text DEFAULT '#ef4444',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_types TO authenticated;
GRANT ALL ON public.leave_types TO service_role;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read leave_types" ON public.leave_types FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hr write leave_types" ON public.leave_types FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_leave_types_updated BEFORE UPDATE ON public.leave_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Leave Balances
CREATE TABLE public.leave_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  leave_type_id uuid NOT NULL,
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  entitled_days numeric NOT NULL DEFAULT 0,
  used_days numeric NOT NULL DEFAULT 0,
  pending_days numeric NOT NULL DEFAULT 0,
  carried_over numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, leave_type_id, year)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_balances TO authenticated;
GRANT ALL ON public.leave_balances TO service_role;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read leave_balances" ON public.leave_balances FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hr write leave_balances" ON public.leave_balances FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_leave_balances_updated BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Leave Requests
CREATE TABLE public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text NOT NULL UNIQUE,
  employee_id uuid NOT NULL,
  leave_type_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days_count numeric NOT NULL DEFAULT 1,
  reason text NOT NULL,
  status public.leave_status NOT NULL DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT ALL ON public.leave_requests TO service_role;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read leave_requests" ON public.leave_requests FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hr write leave_requests" ON public.leave_requests FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_leave_requests_updated BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed common PH leave types
INSERT INTO public.leave_types (code, name, description, is_paid, default_days_per_year, color) VALUES
  ('VL','Vacation Leave','Paid vacation leave',true,5,'#3b82f6'),
  ('SL','Sick Leave','Paid sick leave',true,5,'#f59e0b'),
  ('EL','Emergency Leave','Emergency / bereavement',true,3,'#ef4444'),
  ('ML','Maternity Leave','Maternity leave (105 days RA 11210)',true,105,'#ec4899'),
  ('PL','Paternity Leave','Paternity leave (7 days)',true,7,'#06b6d4'),
  ('UL','Unpaid Leave','Leave without pay',false,0,'#6b7280')
ON CONFLICT (code) DO NOTHING;
