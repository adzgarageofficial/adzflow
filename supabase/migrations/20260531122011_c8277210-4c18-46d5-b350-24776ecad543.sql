
-- Enums
CREATE TYPE public.attendance_status AS ENUM ('present','late','absent','half_day','on_leave','holiday');
CREATE TYPE public.ot_status AS ENUM ('pending','approved','rejected','cancelled');

-- Shifts (schedule templates)
CREATE TABLE public.shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_minutes integer NOT NULL DEFAULT 60,
  grace_period_minutes integer NOT NULL DEFAULT 10,
  days_of_week integer[] NOT NULL DEFAULT '{1,2,3,4,5}',
  is_active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shifts TO authenticated;
GRANT ALL ON public.shifts TO service_role;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read shifts" ON public.shifts FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write shifts" ON public.shifts FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_shifts_updated BEFORE UPDATE ON public.shifts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Employee shift assignments
CREATE TABLE public.employee_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  shift_id uuid NOT NULL,
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  effective_to date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_employee_shifts_employee ON public.employee_shifts(employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_shifts TO authenticated;
GRANT ALL ON public.employee_shifts TO service_role;
ALTER TABLE public.employee_shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read emp_shifts" ON public.employee_shifts FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write emp_shifts" ON public.employee_shifts FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_emp_shifts_updated BEFORE UPDATE ON public.employee_shifts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Attendance logs
CREATE TABLE public.attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  shift_id uuid,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  time_in timestamptz,
  time_out timestamptz,
  break_start timestamptz,
  break_end timestamptz,
  total_hours numeric NOT NULL DEFAULT 0,
  regular_hours numeric NOT NULL DEFAULT 0,
  overtime_hours numeric NOT NULL DEFAULT 0,
  late_minutes integer NOT NULL DEFAULT 0,
  undertime_minutes integer NOT NULL DEFAULT 0,
  status public.attendance_status NOT NULL DEFAULT 'present',
  method text NOT NULL DEFAULT 'manual',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_attendance_employee_date ON public.attendance_logs(employee_id, log_date);
CREATE INDEX idx_attendance_date ON public.attendance_logs(log_date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_logs TO authenticated;
GRANT ALL ON public.attendance_logs TO service_role;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read attendance" ON public.attendance_logs FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write attendance" ON public.attendance_logs FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON public.attendance_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Overtime requests
CREATE TABLE public.overtime_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  ot_date date NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  hours numeric NOT NULL DEFAULT 0,
  reason text NOT NULL,
  status public.ot_status NOT NULL DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ot_employee ON public.overtime_requests(employee_id);
CREATE INDEX idx_ot_status ON public.overtime_requests(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.overtime_requests TO authenticated;
GRANT ALL ON public.overtime_requests TO service_role;
ALTER TABLE public.overtime_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read ot" ON public.overtime_requests FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write ot" ON public.overtime_requests FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_ot_updated BEFORE UPDATE ON public.overtime_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
