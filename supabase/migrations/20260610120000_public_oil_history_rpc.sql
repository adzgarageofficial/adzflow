-- Public RPC: lookup a customer's oil change history by surname + plate number.
-- No login required — exposed only through this narrow read-only function.
-- The underlying tables stay locked behind their existing authenticated-only RLS.
CREATE OR REPLACE FUNCTION public.public_oil_history_lookup(
  p_surname TEXT,
  p_plate   TEXT
)
RETURNS TABLE (
  vehicle_id        UUID,
  customer_id       UUID,
  customer_name     TEXT,
  customer_phone    TEXT,
  make              TEXT,
  model             TEXT,
  year_made         INTEGER,
  plate_number      TEXT,
  current_mileage   INTEGER,
  last_service_date DATE,
  last_service_mileage INTEGER,
  last_oil_used     TEXT,
  next_service_date DATE,
  next_service_mileage INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    v.id                          AS vehicle_id,
    c.id                          AS customer_id,
    c.full_name                   AS customer_name,
    c.phone                       AS customer_phone,
    v.make,
    v.model,
    v.year                        AS year_made,
    v.plate_number,
    v.mileage                     AS current_mileage,
    log.service_date              AS last_service_date,
    log.mileage                   AS last_service_mileage,
    log.oil_used                  AS last_oil_used,
    log.next_service_date,
    log.next_service_mileage
  FROM public.vehicles v
  JOIN public.customers c ON c.id = v.customer_id
  LEFT JOIN LATERAL (
    SELECT service_date, mileage, oil_used, next_service_date, next_service_mileage
    FROM public.vehicle_service_logs
    WHERE vehicle_id = v.id
    ORDER BY service_date DESC
    LIMIT 1
  ) log ON true
  WHERE
    v.plate_number ILIKE '%' || btrim(p_plate) || '%'
    AND c.full_name ILIKE '%' || btrim(p_surname) || '%'
  ORDER BY c.full_name ASC
  LIMIT 20;
$$;

REVOKE ALL ON FUNCTION public.public_oil_history_lookup(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_oil_history_lookup(TEXT, TEXT) TO anon, authenticated;

-- Public RPC: create a booking request from the public oil-history page.
-- Accepts only the minimum needed; garage staff handles assignment/confirmation.
CREATE OR REPLACE FUNCTION public.public_book_appointment(
  p_customer_id  UUID,
  p_vehicle_id   UUID,
  p_scheduled_at TIMESTAMPTZ,
  p_notes        TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_num TEXT;
BEGIN
  v_num := 'BK-' || to_char(now(), 'YYYYMMDDHH24MISS');
  INSERT INTO public.bookings (
    booking_number, customer_id, vehicle_id,
    scheduled_at, duration_minutes, notes, status
  ) VALUES (
    v_num, p_customer_id, p_vehicle_id,
    p_scheduled_at, 60, p_notes, 'scheduled'
  );
  RETURN v_num;
END;
$$;

REVOKE ALL ON FUNCTION public.public_book_appointment(UUID, UUID, TIMESTAMPTZ, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_book_appointment(UUID, UUID, TIMESTAMPTZ, TEXT) TO anon, authenticated;
