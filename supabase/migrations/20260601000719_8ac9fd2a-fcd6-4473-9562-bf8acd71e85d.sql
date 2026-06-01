
-- Default warehouse helper
CREATE OR REPLACE FUNCTION public.ensure_default_warehouse()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wid uuid;
BEGIN
  SELECT id INTO wid FROM public.warehouses WHERE is_active = true ORDER BY created_at LIMIT 1;
  IF wid IS NULL THEN
    INSERT INTO public.warehouses (name) VALUES ('Main Warehouse')
    ON CONFLICT (name) DO UPDATE SET is_active = true
    RETURNING id INTO wid;
  END IF;
  RETURN wid;
END;
$$;

-- Adjust stock for an order: direction in ('deduct','restore')
CREATE OR REPLACE FUNCTION public.adjust_stock_for_order(p_order_id uuid, p_direction text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wid uuid;
  rec RECORD;
  mtype movement_type;
  ref_tag text;
  sign int;
  already int;
BEGIN
  IF p_direction NOT IN ('deduct','restore') THEN
    RAISE EXCEPTION 'Invalid direction %', p_direction;
  END IF;

  ref_tag := 'order:' || p_direction;
  -- Idempotency: skip if already applied
  SELECT count(*) INTO already FROM public.stock_movements
    WHERE reference_id = p_order_id AND reference_type = ref_tag;
  IF already > 0 THEN RETURN; END IF;

  IF p_direction = 'deduct' THEN
    mtype := 'sale'; sign := -1;
  ELSE
    mtype := 'return'; sign := 1;
  END IF;

  wid := public.ensure_default_warehouse();

  FOR rec IN
    SELECT oi.product_id, SUM(oi.quantity)::int AS qty
    FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = p_order_id
      AND oi.product_id IS NOT NULL
      AND COALESCE(p.is_service, false) = false
    GROUP BY oi.product_id
  LOOP
    INSERT INTO public.inventory_levels (product_id, warehouse_id, quantity)
    VALUES (rec.product_id, wid, sign * rec.qty)
    ON CONFLICT (product_id, warehouse_id) DO UPDATE
      SET quantity = public.inventory_levels.quantity + (sign * rec.qty),
          updated_at = now();

    INSERT INTO public.stock_movements (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, notes, created_by)
    VALUES (rec.product_id, wid, mtype, rec.qty, ref_tag, p_order_id,
            'Auto ' || p_direction || ' for order', auth.uid());
  END LOOP;
END;
$$;

-- Ensure inventory_levels has unique constraint for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'inventory_levels_product_warehouse_unique'
  ) THEN
    ALTER TABLE public.inventory_levels
      ADD CONSTRAINT inventory_levels_product_warehouse_unique
      UNIQUE (product_id, warehouse_id);
  END IF;
END $$;

GRANT EXECUTE ON FUNCTION public.adjust_stock_for_order(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_default_warehouse() TO authenticated;
