-- Public service-queue lookup for the customer lounge display (no login required —
-- a tablet/TV in the waiting area shows this so customers can follow their
-- vehicle's progress live). Exposed only through this narrow, read-only function:
-- it deliberately leaves out phone/email/cost/financial data and shows only the
-- customer's first name — the underlying tables stay locked behind their existing
-- authenticated-only RLS.
CREATE OR REPLACE FUNCTION public.public_service_queue()
RETURNS TABLE (
  id UUID,
  job_number TEXT,
  status TEXT,
  vehicle_label TEXT,
  customer_name TEXT,
  technician_name TEXT,
  queued_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    j.id,
    j.job_number,
    j.status::text,
    NULLIF(BTRIM(CONCAT_WS(' · ', NULLIF(BTRIM(CONCAT_WS(' ', v.make, v.model)), ''), v.plate_number)), '') AS vehicle_label,
    NULLIF(SPLIT_PART(BTRIM(c.full_name), ' ', 1), '') AS customer_name,
    NULLIF(BTRIM(p.display_name), '') AS technician_name,
    COALESCE(j.started_at, j.created_at) AS queued_at
  FROM public.job_orders j
  LEFT JOIN public.vehicles v ON v.id = j.vehicle_id
  LEFT JOIN public.customers c ON c.id = j.customer_id
  LEFT JOIN public.profiles p ON p.id = j.technician_id
  WHERE j.status IN ('pending', 'in_progress', 'awaiting_parts')
  ORDER BY
    CASE j.status WHEN 'in_progress' THEN 0 WHEN 'awaiting_parts' THEN 1 ELSE 2 END,
    COALESCE(j.started_at, j.created_at) ASC
  LIMIT 30;
$$;

REVOKE ALL ON FUNCTION public.public_service_queue() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_service_queue() TO anon, authenticated;
