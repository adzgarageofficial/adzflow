-- Allow any authenticated user to INSERT notifications (e.g. cashier notifying owner of a sale).
-- UPDATE and DELETE remain staff-only.

DROP POLICY IF EXISTS "staff write notifications" ON public.notifications;

CREATE POLICY "any insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "staff update notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "staff delete notifications" ON public.notifications
  FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));
