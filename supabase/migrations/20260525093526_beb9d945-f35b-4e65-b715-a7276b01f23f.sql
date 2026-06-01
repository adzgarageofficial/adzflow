
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'cashier', 'inventory', 'mechanic', 'marketing', 'finance');
CREATE TYPE public.user_status AS ENUM ('active', 'suspended', 'disabled');
CREATE TYPE public.product_status AS ENUM ('active', 'draft', 'archived', 'out_of_stock');
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'partial', 'refunded', 'cancelled', 'completed');
CREATE TYPE public.order_channel AS ENUM ('pos', 'ecommerce', 'phone', 'walk_in');
CREATE TYPE public.payment_method AS ENUM ('cash', 'gcash', 'card', 'bank_transfer', 'maya', 'other');
CREATE TYPE public.po_status AS ENUM ('draft', 'sent', 'received', 'partial', 'cancelled');
CREATE TYPE public.movement_type AS ENUM ('purchase', 'sale', 'adjustment', 'transfer_in', 'transfer_out', 'return');
CREATE TYPE public.job_status AS ENUM ('pending', 'in_progress', 'awaiting_parts', 'completed', 'cancelled');
CREATE TYPE public.quotation_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'converted', 'expired');
CREATE TYPE public.booking_status AS ENUM ('scheduled', 'confirmed', 'in_service', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.txn_direction AS ENUM ('in', 'out');

-- ============================================================
-- TIMESTAMP TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============================================================
-- BRANCHES
-- ============================================================
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.branches (name, address) VALUES
  ('Quezon City', 'Main branch — Quezon City'),
  ('Manila', 'Branch — Manila'),
  ('Warehouse', 'Central warehouse');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  status public.user_status NOT NULL DEFAULT 'active',
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- USER ROLES (separate table — never store role on profiles)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Security-definer role check (no recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles))
$$;

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  default_role public.app_role := 'cashier';
  is_first BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM auth.users WHERE id <> NEW.id) INTO is_first;
  IF is_first THEN default_role := 'owner'; END IF;

  INSERT INTO public.profiles (id, display_name, email, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, default_role);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- CATEGORIES, BRANDS, SUPPLIERS, WAREHOUSES
-- ============================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, slug TEXT UNIQUE, description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, logo_url TEXT, description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, contact_person TEXT, email TEXT, phone TEXT,
  address TEXT, payment_terms TEXT, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  address TEXT, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCTS + VARIANTS + INVENTORY
-- ============================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, description TEXT,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  base_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  retail_price NUMERIC(12,2),
  wholesale_price NUMERIC(12,2),
  reseller_price NUMERIC(12,2),
  status public.product_status NOT NULL DEFAULT 'active',
  image_url TEXT, gallery JSONB DEFAULT '[]'::jsonb,
  tags TEXT[], specs JSONB DEFAULT '{}'::jsonb,
  is_service BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, attributes JSONB DEFAULT '{}'::jsonb,
  price_override NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.inventory_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, variant_id, warehouse_id)
);
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  movement_type public.movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type TEXT, reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  status public.po_status NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  expected_at DATE, received_at DATE, notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL, received_quantity INTEGER NOT NULL DEFAULT 0,
  unit_cost NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CUSTOMERS + VEHICLES
-- ============================================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL, email TEXT, phone TEXT, address TEXT,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  lifetime_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  tags TEXT[], notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  make TEXT NOT NULL, model TEXT NOT NULL, year INTEGER,
  plate_number TEXT, vin TEXT, engine TEXT, color TEXT,
  mileage INTEGER, notes TEXT, image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.vehicle_service_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL, description TEXT,
  mileage INTEGER, cost NUMERIC(12,2),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ORDERS (POS + Ecommerce)
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  channel public.order_channel NOT NULL DEFAULT 'pos',
  status public.order_status NOT NULL DEFAULT 'pending',
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  cashier_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  name TEXT NOT NULL, sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL,
  is_service BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.order_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  reference TEXT, paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SERVICES + JOB ORDERS
-- ============================================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.job_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.job_status NOT NULL DEFAULT 'pending',
  description TEXT,
  labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  parts_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMPTZ, started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.job_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_order_id UUID NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  is_labor BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- QUOTATIONS
-- ============================================================
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  status public.quotation_status NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  downpayment NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  valid_until DATE, notes TEXT,
  converted_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  is_labor BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- FITMENTS + BOOKINGS
-- ============================================================
CREATE TABLE public.fitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  make TEXT NOT NULL, model TEXT NOT NULL,
  year_from INTEGER, year_to INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  status public.booking_status NOT NULL DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- MARKETING + DISCOUNTS + FINANCE
-- ============================================================
CREATE TABLE public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, channel TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  starts_at DATE, ends_at DATE,
  budget NUMERIC(12,2), spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  reach INTEGER NOT NULL DEFAULT 0, conversions INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  value NUMERIC(12,2) NOT NULL,
  starts_at DATE, ends_at DATE,
  usage_limit INTEGER, usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  direction public.txn_direction NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  method public.payment_method,
  reference_type TEXT, reference_id UUID,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TIMESTAMP TRIGGERS
-- ============================================================
DO $$ DECLARE t TEXT; BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'branches','profiles','categories','brands','suppliers','warehouses',
    'products','product_variants','purchase_orders','customers','vehicles',
    'orders','services','job_orders','quotations','bookings',
    'marketing_campaigns','discounts','finance_transactions'
  ]) LOOP
    EXECUTE format('CREATE TRIGGER trg_%I_updated BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t, t);
  END LOOP;
END $$;

-- ============================================================
-- RLS ENABLE
-- ============================================================
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: any authenticated, any staff (owner/admin)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_staff(_uid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_uid, ARRAY['owner','admin']::public.app_role[])
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================
-- Branches: everyone authenticated can read; staff can write
CREATE POLICY "auth read branches" ON public.branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write branches" ON public.branches FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Profiles: own profile + staff sees all
CREATE POLICY "view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "staff insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete profiles" ON public.profiles FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- User roles: users see own; staff manages
CREATE POLICY "view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Generic helper for "authenticated read, role-based write"
-- Categories, brands
CREATE POLICY "auth read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv staff write categories" ON public.categories FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));
CREATE POLICY "auth read brands" ON public.brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv staff write brands" ON public.brands FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));

-- Suppliers & warehouses (inventory + staff)
CREATE POLICY "inv read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory','finance']::public.app_role[]));
CREATE POLICY "inv write suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));
CREATE POLICY "auth read warehouses" ON public.warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write warehouses" ON public.warehouses FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));

-- Products / variants: auth read; inv staff write
CREATE POLICY "auth read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write products" ON public.products FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));
CREATE POLICY "auth read variants" ON public.product_variants FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write variants" ON public.product_variants FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));

-- Inventory levels & movements
CREATE POLICY "auth read inventory" ON public.inventory_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write inventory" ON public.inventory_levels FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));
CREATE POLICY "auth read movements" ON public.stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv create movements" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory','cashier']::public.app_role[]));

-- Purchase orders
CREATE POLICY "inv read POs" ON public.purchase_orders FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory','finance']::public.app_role[]));
CREATE POLICY "inv write POs" ON public.purchase_orders FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));
CREATE POLICY "inv read PO items" ON public.purchase_order_items FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory','finance']::public.app_role[]));
CREATE POLICY "inv write PO items" ON public.purchase_order_items FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));

-- Customers & vehicles (all operational roles)
CREATE POLICY "ops read customers" ON public.customers FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','marketing','mechanic','finance']::public.app_role[]));
CREATE POLICY "ops write customers" ON public.customers FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','marketing']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','marketing']::public.app_role[]));
CREATE POLICY "ops read vehicles" ON public.vehicles FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','marketing','mechanic']::public.app_role[]));
CREATE POLICY "ops write vehicles" ON public.vehicles FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));
CREATE POLICY "ops read service logs" ON public.vehicle_service_logs FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));
CREATE POLICY "ops write service logs" ON public.vehicle_service_logs FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','mechanic']::public.app_role[]));

-- Orders
CREATE POLICY "ops read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance','marketing']::public.app_role[]));
CREATE POLICY "ops write orders" ON public.orders FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier']::public.app_role[]));
CREATE POLICY "ops read order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance','marketing']::public.app_role[]));
CREATE POLICY "ops write order items" ON public.order_items FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier']::public.app_role[]));
CREATE POLICY "ops read payments" ON public.order_payments FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::public.app_role[]));
CREATE POLICY "ops write payments" ON public.order_payments FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','finance']::public.app_role[]));

-- Services / Job orders / Quotations / Fitments / Bookings
CREATE POLICY "auth read services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write services" ON public.services FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "ops read jobs" ON public.job_orders FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic','finance']::public.app_role[]));
CREATE POLICY "ops write jobs" ON public.job_orders FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));
CREATE POLICY "ops read job items" ON public.job_order_items FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic','finance']::public.app_role[]));
CREATE POLICY "ops write job items" ON public.job_order_items FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));

CREATE POLICY "ops read quotations" ON public.quotations FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic','finance']::public.app_role[]));
CREATE POLICY "ops write quotations" ON public.quotations FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));
CREATE POLICY "ops read quotation items" ON public.quotation_items FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic','finance']::public.app_role[]));
CREATE POLICY "ops write quotation items" ON public.quotation_items FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));

CREATE POLICY "auth read fitments" ON public.fitments FOR SELECT TO authenticated USING (true);
CREATE POLICY "inv write fitments" ON public.fitments FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));

CREATE POLICY "ops read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic','marketing']::public.app_role[]));
CREATE POLICY "ops write bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','cashier','mechanic']::public.app_role[]));

-- Marketing, discounts, finance
CREATE POLICY "mkt read campaigns" ON public.marketing_campaigns FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','marketing','finance']::public.app_role[]));
CREATE POLICY "mkt write campaigns" ON public.marketing_campaigns FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','marketing']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','marketing']::public.app_role[]));

CREATE POLICY "auth read discounts" ON public.discounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "mkt write discounts" ON public.discounts FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','marketing']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','marketing']::public.app_role[]));

CREATE POLICY "fin read txns" ON public.finance_transactions FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]));
CREATE POLICY "fin write txns" ON public.finance_transactions FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','finance']::public.app_role[]));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_inventory_product ON public.inventory_levels(product_id);
CREATE INDEX idx_movements_product ON public.stock_movements(product_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_job_orders_status ON public.job_orders(status);
CREATE INDEX idx_bookings_scheduled ON public.bookings(scheduled_at);
CREATE INDEX idx_vehicles_customer ON public.vehicles(customer_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
