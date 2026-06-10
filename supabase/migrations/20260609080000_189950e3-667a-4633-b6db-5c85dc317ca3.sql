-- Order fulfillment type: how the customer receives their purchase.
-- "takeout"      — customer carries it out (default, most common)
-- "shipping"     — to be delivered / shipped
-- "installation" — "ikakabit" — parts stay in-shop to be fitted on the vehicle
-- Nullable-safe: existing rows get the 'takeout' default so nothing breaks.
CREATE TYPE public.fulfillment_type AS ENUM ('takeout', 'shipping', 'installation');

ALTER TABLE public.orders
  ADD COLUMN fulfillment_type public.fulfillment_type NOT NULL DEFAULT 'takeout';
