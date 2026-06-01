-- Wipe all data from every public table, then clear auth users.
-- Next signup becomes the Owner via handle_new_user() trigger.
DO $$
DECLARE
  r RECORD;
  stmt TEXT := '';
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    stmt := stmt || format('TRUNCATE TABLE public.%I RESTART IDENTITY CASCADE; ', r.tablename);
  END LOOP;
  IF length(stmt) > 0 THEN
    EXECUTE stmt;
  END IF;
END $$;

-- Clear all auth users so AdzAdminOfficial@gmail.com becomes the first (Owner).
DELETE FROM auth.users;
