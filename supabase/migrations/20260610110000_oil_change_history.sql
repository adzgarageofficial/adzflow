-- Add oil_used field to vehicle_service_logs so staff can record which oil was used
-- during each service. Nullable so existing rows are unaffected.
ALTER TABLE public.vehicle_service_logs
  ADD COLUMN oil_used TEXT;
