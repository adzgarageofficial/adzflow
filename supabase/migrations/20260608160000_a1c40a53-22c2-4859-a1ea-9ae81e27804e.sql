-- Mechanic commission system. Mirrors the existing daily_rate/hourly_rate
-- pattern on employees: each mechanic gets a commission_rate plus a
-- commission_type that says how to interpret it ('percentage' of completed
-- job orders' labor_cost, or a 'fixed' amount per completed job). Payroll
-- generation computes commission per period and stores the total on the
-- payslip. Internal-only figure — never surfaced on customer receipts.
CREATE TYPE public.commission_type AS ENUM ('percentage', 'fixed');

ALTER TABLE public.employees
  ADD COLUMN commission_type public.commission_type NOT NULL DEFAULT 'percentage',
  ADD COLUMN commission_rate NUMERIC(12,2) NOT NULL DEFAULT 0;

ALTER TABLE public.payslips
  ADD COLUMN commission NUMERIC(12,2) NOT NULL DEFAULT 0;
