-- Add walk-in contact fields to bookings so public/anonymous bookings
-- (from the oil-history page) can store a name + phone + plate without
-- needing an existing customer or vehicle record.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS walk_in_name  TEXT,
  ADD COLUMN IF NOT EXISTS walk_in_phone TEXT,
  ADD COLUMN IF NOT EXISTS walk_in_plate TEXT;

-- Public RPC: book an appointment with just a name/phone/plate.
-- Called from /oil-history when the customer has no existing record,
-- or just wants to book directly without looking up oil history first.
CREATE OR REPLACE FUNCTION public.public_book_appointment_direct(
  p_name         TEXT,
  p_phone        TEXT       DEFAULT NULL,
  p_plate        TEXT       DEFAULT NULL,
  p_scheduled_at TIMESTAMPTZ DEFAULT NULL,
  p_notes        TEXT       DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_num TEXT;
BEGIN
  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  IF p_scheduled_at IS NULL THEN
    RAISE EXCEPTION 'Preferred date and time is required';
  END IF;

  v_num := 'BK-' || to_char(now(), 'YYYYMMDDHH24MISS');

  INSERT INTO public.bookings (
    booking_number,
    walk_in_name, walk_in_phone, walk_in_plate,
    scheduled_at, duration_minutes,
    notes, status
  ) VALUES (
    v_num,
    btrim(p_name),
    NULLIF(btrim(coalesce(p_phone, '')), ''),
    NULLIF(btrim(coalesce(p_plate, '')), ''),
    p_scheduled_at, 60,
    p_notes, 'scheduled'
  );

  RETURN v_num;
END;
$$;

REVOKE ALL ON FUNCTION public.public_book_appointment_direct(TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_book_appointment_direct(TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT) TO anon, authenticated;
