-- Add discount_chain column to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS discount_chain numeric[] DEFAULT '{}';

-- Seed known brand discount chains based on supplier terms
UPDATE brands SET discount_chain = '{20,5,5,5}'   WHERE LOWER(name) LIKE '%arivo%';
UPDATE brands SET discount_chain = '{20,5,5,5}'   WHERE LOWER(name) LIKE '%venom%';
UPDATE brands SET discount_chain = '{20,5,5,5,5}' WHERE LOWER(name) LIKE '%apollo%';
UPDATE brands SET discount_chain = '{20,5,5}'     WHERE LOWER(name) LIKE '%michelin%';
UPDATE brands SET discount_chain = '{5,5,5}'      WHERE LOWER(name) LIKE '%bfg%';
UPDATE brands SET discount_chain = '{15,10,5}'    WHERE LOWER(name) LIKE '%workwheels%';
UPDATE brands SET discount_chain = '{20,10,5}'    WHERE LOWER(name) LIKE '%profender%';
UPDATE brands SET discount_chain = '{20,10,10,5}' WHERE LOWER(name) LIKE '%king spring%';
UPDATE brands SET discount_chain = '{20,10,10,5}' WHERE LOWER(name) LIKE '%ridemax%';
UPDATE brands SET discount_chain = '{15,5,5}'     WHERE LOWER(name) LIKE '%arb%';
UPDATE brands SET discount_chain = '{20,10,5,5}'  WHERE LOWER(name) LIKE '%vlf%';
UPDATE brands SET discount_chain = '{20,5,5,5}'   WHERE LOWER(name) LIKE '%cooper%';
UPDATE brands SET discount_chain = '{20,5,5,5}'   WHERE LOWER(name) LIKE '%atlander%';
UPDATE brands SET discount_chain = '{20,10,10,5}' WHERE LOWER(name) LIKE '%icooh%';
UPDATE brands SET discount_chain = '{20,5,5,10,5}'WHERE LOWER(name) LIKE '%fuel%';
UPDATE brands SET discount_chain = '{20,10,5}'    WHERE LOWER(name) LIKE '%hamer%';
-- TRX: accessories vs mags are separate brands, match by exact name if possible
UPDATE brands SET discount_chain = '{20,10,5}'    WHERE LOWER(name) = 'trx accessories' OR LOWER(name) = 'trx acc';
UPDATE brands SET discount_chain = '{20,10,5,5}'  WHERE LOWER(name) = 'trx mags' OR LOWER(name) = 'trx wheels';
-- Fallback: any remaining TRX brand
UPDATE brands SET discount_chain = '{20,10,5}'    WHERE LOWER(name) LIKE '%trx%' AND (discount_chain IS NULL OR discount_chain = '{}');
