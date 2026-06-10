-- Reservations table: down-payment / hold transactions from POS
CREATE TABLE IF NOT EXISTS public.reservations (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_number        text UNIQUE NOT NULL,
  customer_name             text NOT NULL,
  vehicle                   text NOT NULL,
  plate_number              text NOT NULL,
  items                     jsonb NOT NULL DEFAULT '[]',
  down_payment_amount       numeric(12,2) NOT NULL DEFAULT 0,
  down_payment_receipt_url  text,
  status                    text NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','completed','cancelled')),
  notes                     text,
  reserved_by               uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reserved_by_name          text,
  completed_order_id        uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  reserved_at               timestamptz NOT NULL DEFAULT now(),
  completed_at              timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage reservations"
  ON public.reservations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_reservations_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_reservations_updated_at();

-- Storage bucket for down-payment receipt images
INSERT INTO storage.buckets (id, name, public)
  VALUES ('reservation-receipts', 'reservation-receipts', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated uploads to reservation-receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'reservation-receipts');

CREATE POLICY "Allow public read of reservation-receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reservation-receipts');
