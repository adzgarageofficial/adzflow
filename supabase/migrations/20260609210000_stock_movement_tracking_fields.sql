-- Add Excel-aligned tracking fields to stock_movements
-- Maps to Excel OUT/IN sheet columns: REFERENCE #, PREPARED BY, DELIVERED BY, RECEIVED BY, REMARKS
ALTER TABLE public.stock_movements
  ADD COLUMN IF NOT EXISTS reference_number TEXT,
  ADD COLUMN IF NOT EXISTS prepared_by      TEXT,
  ADD COLUMN IF NOT EXISTS delivered_by     TEXT,
  ADD COLUMN IF NOT EXISTS received_by      TEXT;
