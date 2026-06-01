
-- ============ ENUMS ============
CREATE TYPE public.employment_status AS ENUM ('active','on_leave','suspended','terminated','resigned');
CREATE TYPE public.employment_type AS ENUM ('regular','probationary','contractual','project_based','part_time','intern');
CREATE TYPE public.civil_status AS ENUM ('single','married','widowed','separated','divorced');
CREATE TYPE public.contract_status AS ENUM ('draft','active','expired','terminated');
CREATE TYPE public.document_type AS ENUM ('contract','government_id','resume','certificate','medical','clearance','training','evaluation','other');

-- ============ DEPARTMENTS ============
CREATE TABLE public.departments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text UNIQUE,
  description text,
  manager_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read departments" ON public.departments FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write departments" ON public.departments FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_departments_updated BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ POSITIONS ============
CREATE TABLE public.positions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  level text,
  min_salary numeric NOT NULL DEFAULT 0,
  max_salary numeric NOT NULL DEFAULT 0,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.positions TO authenticated;
GRANT ALL ON public.positions TO service_role;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read positions" ON public.positions FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write positions" ON public.positions FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_positions_updated BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EMPLOYEES ============
CREATE TABLE public.employees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_number text NOT NULL UNIQUE,
  user_id uuid,
  -- Personal
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  suffix text,
  birth_date date,
  gender text,
  civil_status civil_status,
  nationality text DEFAULT 'Filipino',
  -- Contact
  email text,
  phone text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relation text,
  -- Government IDs
  sss_number text,
  philhealth_number text,
  pagibig_number text,
  tin_number text,
  -- Employment
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  position_id uuid REFERENCES public.positions(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  employment_type employment_type NOT NULL DEFAULT 'probationary',
  status employment_status NOT NULL DEFAULT 'active',
  date_hired date NOT NULL DEFAULT CURRENT_DATE,
  date_regularized date,
  date_terminated date,
  -- Salary
  basic_salary numeric NOT NULL DEFAULT 0,
  daily_rate numeric NOT NULL DEFAULT 0,
  hourly_rate numeric NOT NULL DEFAULT 0,
  allowance numeric NOT NULL DEFAULT 0,
  -- Bank
  bank_name text,
  bank_account_number text,
  -- Meta
  avatar_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_employees_department ON public.employees(department_id);
CREATE INDEX idx_employees_position ON public.employees(position_id);
CREATE INDEX idx_employees_status ON public.employees(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read employees" ON public.employees FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write employees" ON public.employees FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_employees_updated BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add FK for department manager
ALTER TABLE public.departments ADD CONSTRAINT departments_manager_fk FOREIGN KEY (manager_id) REFERENCES public.employees(id) ON DELETE SET NULL;

-- ============ EMPLOYMENT CONTRACTS ============
CREATE TABLE public.employment_contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  contract_number text NOT NULL UNIQUE,
  contract_type employment_type NOT NULL DEFAULT 'probationary',
  status contract_status NOT NULL DEFAULT 'draft',
  start_date date NOT NULL,
  end_date date,
  basic_salary numeric NOT NULL DEFAULT 0,
  allowance numeric NOT NULL DEFAULT 0,
  position_title text,
  terms text,
  signed_at timestamptz,
  signed_by uuid,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_contracts_employee ON public.employment_contracts(employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employment_contracts TO authenticated;
GRANT ALL ON public.employment_contracts TO service_role;
ALTER TABLE public.employment_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read contracts" ON public.employment_contracts FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write contracts" ON public.employment_contracts FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_contracts_updated BEFORE UPDATE ON public.employment_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EMPLOYEE DOCUMENTS (201 files) ============
CREATE TABLE public.employee_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  document_type document_type NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  file_url text,
  file_name text,
  file_size integer,
  uploaded_by uuid,
  issued_date date,
  expiry_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_documents_employee ON public.employee_documents(employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_documents TO authenticated;
GRANT ALL ON public.employee_documents TO service_role;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read documents" ON public.employee_documents FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write documents" ON public.employee_documents FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_documents_updated BEFORE UPDATE ON public.employee_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ STORAGE BUCKET for 201 files ============
INSERT INTO storage.buckets (id, name, public) VALUES ('hr-documents', 'hr-documents', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "staff read hr docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'hr-documents' AND is_staff(auth.uid()));
CREATE POLICY "staff upload hr docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hr-documents' AND is_staff(auth.uid()));
CREATE POLICY "staff update hr docs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hr-documents' AND is_staff(auth.uid()));
CREATE POLICY "staff delete hr docs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hr-documents' AND is_staff(auth.uid()));
