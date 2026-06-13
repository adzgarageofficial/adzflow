-- Track who last updated each bay so owner can see mechanic activity
ALTER TABLE public.bay_queue ADD COLUMN IF NOT EXISTS updated_by_name text;

-- Grant access (in case not yet granted)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bay_queue TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bay_queue TO anon;
