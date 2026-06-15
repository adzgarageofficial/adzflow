-- Link vehicle_service_logs to bookings so oil changes can be traced to the appointment
ALTER TABLE public.vehicle_service_logs
  ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vsl_booking_id ON public.vehicle_service_logs (booking_id);
