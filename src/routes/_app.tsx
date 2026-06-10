import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AppSidebar } from "@/components/app-sidebar";
import { RbacProvider } from "@/lib/rbac";
import { supabase } from "@/integrations/supabase/client";
import { MobileNavProvider } from "@/components/mobile-nav";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        queryClient.clear();
        navigate({ to: "/login" });
      } else {
        queryClient.invalidateQueries({ queryKey: ["current_user_roles"] });
        queryClient.invalidateQueries({ queryKey: ["my_profile"] });
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/login" });
      else setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate, queryClient]);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-surface">
        <div className="text-sm text-muted-foreground">Loading workspace…</div>
      </div>
    );
  }

  return (
    <RbacProvider>
      <MobileNavProvider>
        <div className="min-h-screen w-full flex bg-surface text-foreground">
          <div className="hidden md:block">
            <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <Outlet />
          </div>
        </div>
      </MobileNavProvider>
    </RbacProvider>
  );
}
