-- Fix notification visibility: users only see notifications meant for them.
-- broadcast (null) = everyone, audience_role set = only that role sees it.

DROP POLICY IF EXISTS "auth read notifications" ON public.notifications;

CREATE POLICY "auth read notifications" ON public.notifications
  FOR SELECT TO authenticated USING (
    audience_role IS NULL
    OR public.has_any_role(auth.uid(), ARRAY[audience_role::public.app_role])
  );
