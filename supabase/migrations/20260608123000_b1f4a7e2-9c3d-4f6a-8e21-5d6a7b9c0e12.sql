-- Public stock-availability lookup for the standalone "stock check" link
-- (no login required — sales staff use it to confirm if an item is in stock).
-- Exposed only through this narrow, read-only function: it deliberately leaves
-- out cost/wholesale/reseller prices and any customer/financial data, and the
-- underlying tables stay locked behind their existing authenticated-only RLS.
CREATE OR REPLACE FUNCTION public.public_stock_lookup(p_search text DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  sku TEXT,
  name TEXT,
  brand TEXT,
  category TEXT,
  image_url TEXT,
  quantity_available INTEGER,
  status TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.sku,
    p.name,
    b.name AS brand,
    c.name AS category,
    p.image_url,
    GREATEST(COALESCE(SUM(il.quantity - il.reserved_quantity), 0), 0)::integer AS quantity_available,
    CASE
      WHEN COALESCE(SUM(il.quantity), 0) <= 0 THEN 'out_of_stock'
      WHEN COALESCE(SUM(il.quantity), 0) <= COALESCE(MAX(il.reorder_point), 0) THEN 'low_stock'
      ELSE 'in_stock'
    END AS status
  FROM public.products p
  LEFT JOIN public.brands b ON b.id = p.brand_id
  LEFT JOIN public.categories c ON c.id = p.category_id
  LEFT JOIN public.inventory_levels il ON il.product_id = p.id
  WHERE p.is_service = false
    AND p.status = 'active'
    AND (
      p_search IS NULL OR btrim(p_search) = ''
      OR p.name ILIKE '%' || btrim(p_search) || '%'
      OR p.sku ILIKE '%' || btrim(p_search) || '%'
    )
  GROUP BY p.id, b.name, c.name
  ORDER BY p.name ASC
  LIMIT 50;
$$;

REVOKE ALL ON FUNCTION public.public_stock_lookup(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_stock_lookup(text) TO anon, authenticated;
