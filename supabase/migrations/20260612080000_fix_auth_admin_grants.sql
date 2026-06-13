-- Fix "permission denied for table rule" when on_auth_user_created trigger fires.
-- GoTrue uses supabase_auth_admin to insert into auth.users, which fires handle_new_user().
-- Even though handle_new_user() is SECURITY DEFINER, supabase_auth_admin still needs
-- explicit INSERT privileges on the target public schema tables.
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON public.profiles TO supabase_auth_admin;
GRANT INSERT ON public.user_roles TO supabase_auth_admin;
GRANT SELECT ON public.user_roles TO supabase_auth_admin;

-- Also re-assert function ownership so SECURITY DEFINER runs as postgres (superuser).
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
