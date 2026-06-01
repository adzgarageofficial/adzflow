
DO $$ BEGIN
  CREATE TYPE public.payroll_status AS ENUM ('draft','processing','posted','paid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payslip_status AS ENUM ('draft','finalized','paid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.payroll_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_code text NOT NULL UNIQUE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  pay_date date NOT NULL,
  cutoff_label text NOT NULL DEFAULT '1st',
  status public.payroll_status NOT NULL DEFAULT 'draft',
  total_gross numeric NOT NULL DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,
  total_net numeric NOT NULL DEFAULT 0,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_periods TO authenticated;
GRANT ALL ON public.payroll_periods TO service_role;
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read periods" ON public.payroll_periods FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hr write periods" ON public.payroll_periods FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_payroll_periods_updated BEFORE UPDATE ON public.payroll_periods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payslip_number text NOT NULL UNIQUE,
  period_id uuid NOT NULL REFERENCES public.payroll_periods(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL,
  days_worked numeric NOT NULL DEFAULT 0,
  regular_hours numeric NOT NULL DEFAULT 0,
  overtime_hours numeric NOT NULL DEFAULT 0,
  late_minutes integer NOT NULL DEFAULT 0,
  basic_pay numeric NOT NULL DEFAULT 0,
  allowance numeric NOT NULL DEFAULT 0,
  overtime_pay numeric NOT NULL DEFAULT 0,
  holiday_pay numeric NOT NULL DEFAULT 0,
  other_earnings numeric NOT NULL DEFAULT 0,
  gross_pay numeric NOT NULL DEFAULT 0,
  sss numeric NOT NULL DEFAULT 0,
  philhealth numeric NOT NULL DEFAULT 0,
  pagibig numeric NOT NULL DEFAULT 0,
  withholding_tax numeric NOT NULL DEFAULT 0,
  late_deduction numeric NOT NULL DEFAULT 0,
  other_deductions numeric NOT NULL DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,
  net_pay numeric NOT NULL DEFAULT 0,
  status public.payslip_status NOT NULL DEFAULT 'draft',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(period_id, employee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payslips TO authenticated;
GRANT ALL ON public.payslips TO service_role;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read payslips" ON public.payslips FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hr write payslips" ON public.payslips FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_payslips_updated BEFORE UPDATE ON public.payslips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_payslips_period ON public.payslips(period_id);
CREATE INDEX idx_payslips_employee ON public.payslips(employee_id);
