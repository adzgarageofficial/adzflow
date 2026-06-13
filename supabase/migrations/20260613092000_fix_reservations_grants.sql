-- Fix reservations: explicit grants for authenticated role + make vehicle/plate nullable

-- Grant table-level permissions so RLS policies can actually execute
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO anon;

-- Also ensure service_queue has proper grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_queue TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_queue TO anon;

-- Make vehicle and plate_number nullable (walk-in may not have these)
ALTER TABLE public.reservations ALTER COLUMN vehicle DROP NOT NULL;
ALTER TABLE public.reservations ALTER COLUMN plate_number DROP NOT NULL;
