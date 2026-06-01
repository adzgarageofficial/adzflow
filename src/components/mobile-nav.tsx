import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const MobileNavCtx = createContext<Ctx | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <MobileNavCtx.Provider value={{ open, setOpen }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[280px] max-w-[85vw] border-r border-sidebar-border bg-sidebar [&>button]:hidden">
          <AppSidebar collapsed={false} onToggle={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </MobileNavCtx.Provider>
  );
}

export function useMobileNav() {
  const ctx = useContext(MobileNavCtx);
  return ctx ?? { open: false, setOpen: () => {} };
}

export function MobileNavTrigger({ className = "" }: { className?: string }) {
  const { setOpen } = useMobileNav();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open menu"
      className={`md:hidden h-10 w-10 rounded-xl border border-border bg-card/60 grid place-items-center shadow-soft hover:bg-secondary transition ${className}`}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}