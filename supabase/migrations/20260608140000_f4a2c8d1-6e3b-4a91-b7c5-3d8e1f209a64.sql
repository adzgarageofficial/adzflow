-- "Next service due" reminder: each service log entry can record when (date)
-- and/or at what odometer reading the *next* service should happen. Garage
-- reads the most recent log per vehicle that has either set and computes a
-- due-soon/overdue badge — no new table needed.
ALTER TABLE public.vehicle_service_logs
  ADD COLUMN next_service_date DATE,
  ADD COLUMN next_service_mileage INTEGER;
