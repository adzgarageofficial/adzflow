-- Supplier delivery receipt system.
-- Supplier submits via magic link → owner/staff confirms → inventory updates.
-- Server-side admin client handles public submissions (no anon RLS needed).

CREATE TYPE public.delivery_receipt_status AS ENUM ('pending', 'confirmed', 'rejected');

-- One receipt per supplier submission per PO
CREATE TABLE public.po_delivery_receipts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id   UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  supplier_name       TEXT NOT NULL,
  delivery_date       DATE NOT NULL,
  notes               TEXT,
  status              public.delivery_receipt_status NOT NULL DEFAULT 'pending',
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at        TIMESTAMPTZ,
  confirmed_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejection_note      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- What was actually delivered per PO line item
CREATE TABLE public.po_delivery_receipt_items (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_receipt_id     UUID NOT NULL REFERENCES public.po_delivery_receipts(id) ON DELETE CASCADE,
  purchase_order_item_id  UUID NOT NULL REFERENCES public.purchase_order_items(id) ON DELETE CASCADE,
  product_id              UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity_delivered      INTEGER NOT NULL CHECK (quantity_delivered > 0),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_po_delivery_receipts_updated
  BEFORE UPDATE ON public.po_delivery_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_delivery_receipts_po     ON public.po_delivery_receipts(purchase_order_id);
CREATE INDEX idx_delivery_receipts_status ON public.po_delivery_receipts(status);
CREATE INDEX idx_delivery_receipt_items   ON public.po_delivery_receipt_items(delivery_receipt_id);

ALTER TABLE public.po_delivery_receipts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_delivery_receipt_items  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv read delivery receipts" ON public.po_delivery_receipts
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory','finance']::public.app_role[]));

CREATE POLICY "inv write delivery receipts" ON public.po_delivery_receipts
  FOR ALL TO authenticated
  USING  (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));

CREATE POLICY "inv read delivery receipt items" ON public.po_delivery_receipt_items
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory','finance']::public.app_role[]));

CREATE POLICY "inv write delivery receipt items" ON public.po_delivery_receipt_items
  FOR ALL TO authenticated
  USING  (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin','inventory']::public.app_role[]));
