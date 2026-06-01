
DROP POLICY IF EXISTS "any insert audit" ON public.audit_logs;
CREATE POLICY "auth insert audit" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
