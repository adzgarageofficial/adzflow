
-- ============== ENUMS ==============
CREATE TYPE public.review_status AS ENUM ('draft','in_progress','completed','acknowledged');
CREATE TYPE public.goal_status AS ENUM ('not_started','in_progress','completed','cancelled');
CREATE TYPE public.job_posting_status AS ENUM ('draft','open','closed','filled');
CREATE TYPE public.application_stage AS ENUM ('applied','screening','interview','offer','hired','rejected','withdrawn');
CREATE TYPE public.interview_status AS ENUM ('scheduled','completed','cancelled','no_show');
CREATE TYPE public.training_status AS ENUM ('scheduled','ongoing','completed','cancelled');
CREATE TYPE public.enrollment_status AS ENUM ('enrolled','in_progress','completed','failed','dropped');

-- ============== PERFORMANCE ==============
CREATE TABLE public.kpi_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  weight numeric NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpi_categories TO authenticated;
GRANT ALL ON public.kpi_categories TO service_role;
ALTER TABLE public.kpi_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read kpi_categories" ON public.kpi_categories FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write kpi_categories" ON public.kpi_categories FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.performance_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_number text NOT NULL UNIQUE,
  employee_id uuid NOT NULL,
  reviewer_id uuid,
  period_start date NOT NULL,
  period_end date NOT NULL,
  review_date date NOT NULL DEFAULT CURRENT_DATE,
  overall_rating numeric NOT NULL DEFAULT 0,
  strengths text,
  improvements text,
  comments text,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  status review_status NOT NULL DEFAULT 'draft',
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performance_reviews TO authenticated;
GRANT ALL ON public.performance_reviews TO service_role;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read reviews" ON public.performance_reviews FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write reviews" ON public.performance_reviews FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.performance_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  target_value text,
  progress integer NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  completed_at timestamptz,
  status goal_status NOT NULL DEFAULT 'not_started',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performance_goals TO authenticated;
GRANT ALL ON public.performance_goals TO service_role;
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read goals" ON public.performance_goals FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write goals" ON public.performance_goals FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.recognitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  given_by uuid,
  title text NOT NULL,
  message text,
  category text DEFAULT 'kudos',
  points integer NOT NULL DEFAULT 0,
  awarded_at date NOT NULL DEFAULT CURRENT_DATE,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recognitions TO authenticated;
GRANT ALL ON public.recognitions TO service_role;
ALTER TABLE public.recognitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read recognitions" ON public.recognitions FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write recognitions" ON public.recognitions FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

-- ============== RECRUITMENT ==============
CREATE TABLE public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posting_number text NOT NULL UNIQUE,
  title text NOT NULL,
  department_id uuid,
  position_id uuid,
  branch_id uuid,
  description text,
  requirements text,
  employment_type text DEFAULT 'full_time',
  salary_min numeric DEFAULT 0,
  salary_max numeric DEFAULT 0,
  openings integer NOT NULL DEFAULT 1,
  status job_posting_status NOT NULL DEFAULT 'draft',
  posted_at date,
  closes_at date,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_postings TO authenticated;
GRANT ALL ON public.job_postings TO service_role;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read postings" ON public.job_postings FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write postings" ON public.job_postings FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  address text,
  resume_url text,
  cover_letter text,
  source text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applicants TO authenticated;
GRANT ALL ON public.applicants TO service_role;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read applicants" ON public.applicants FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write applicants" ON public.applicants FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number text NOT NULL UNIQUE,
  applicant_id uuid NOT NULL,
  job_posting_id uuid NOT NULL,
  stage application_stage NOT NULL DEFAULT 'applied',
  rating integer DEFAULT 0,
  notes text,
  applied_at date NOT NULL DEFAULT CURRENT_DATE,
  hired_at date,
  rejected_at date,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read applications" ON public.applications FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write applications" ON public.applications FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL,
  interviewer_id uuid,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  location text,
  meeting_link text,
  interview_type text DEFAULT 'in_person',
  feedback text,
  rating integer DEFAULT 0,
  recommendation text,
  status interview_status NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interviews TO authenticated;
GRANT ALL ON public.interviews TO service_role;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read interviews" ON public.interviews FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write interviews" ON public.interviews FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

-- ============== TRAINING ==============
CREATE TABLE public.training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text,
  provider text,
  duration_hours numeric NOT NULL DEFAULT 0,
  cost_per_person numeric NOT NULL DEFAULT 0,
  is_mandatory boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_programs TO authenticated;
GRANT ALL ON public.training_programs TO service_role;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read programs" ON public.training_programs FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write programs" ON public.training_programs FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  session_code text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  location text,
  trainer text,
  max_participants integer DEFAULT 0,
  status training_status NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_sessions TO authenticated;
GRANT ALL ON public.training_sessions TO service_role;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read sessions" ON public.training_sessions FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write sessions" ON public.training_sessions FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.training_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  score numeric,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  certificate_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, employee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_enrollments TO authenticated;
GRANT ALL ON public.training_enrollments TO service_role;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read enrollments" ON public.training_enrollments FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write enrollments" ON public.training_enrollments FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  name text NOT NULL,
  issuing_org text,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  credential_id text,
  credential_url text,
  file_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr read certs" ON public.certifications FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "hr write certs" ON public.certifications FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

-- ============== TRIGGERS ==============
CREATE TRIGGER trg_kpi_categories_updated BEFORE UPDATE ON public.kpi_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_performance_reviews_updated BEFORE UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_performance_goals_updated BEFORE UPDATE ON public.performance_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_recognitions_updated BEFORE UPDATE ON public.recognitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_job_postings_updated BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_applicants_updated BEFORE UPDATE ON public.applicants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_interviews_updated BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_training_programs_updated BEFORE UPDATE ON public.training_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_training_sessions_updated BEFORE UPDATE ON public.training_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_training_enrollments_updated BEFORE UPDATE ON public.training_enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_certifications_updated BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
