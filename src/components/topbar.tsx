import { Search, Bell, Wifi, WifiOff, Command, Plus, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { MobileNavTrigger } from "@/components/mobile-nav";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [online, setOnline] = useState(true);
  const { theme, toggle } = useTheme();
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 glass border-b border-border">
      <div className="flex items-center gap-3 px-4 md:px-6 h-[60px] md:h-[68px]">
        <MobileNavTrigger />
        <div className="min-w-0">
          <h1 className="text-[15px] md:text-[17px] font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 h-10 w-[320px] rounded-xl border border-border bg-card/60 px-3 shadow-soft">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search products, orders, customers…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>

          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border",
              online
                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300"
                : "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300",
            )}
          >
            {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {online ? "Online" : "Offline mode"}
          </span>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            className="relative h-10 w-10 rounded-xl border border-border bg-card/60 grid place-items-center shadow-soft hover:bg-secondary transition text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button className="relative h-10 w-10 rounded-xl border border-border bg-card/60 grid place-items-center shadow-soft hover:bg-secondary transition">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>

          <Link
            to="/pos"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("pos:new-sale"));
              }
            }}
            className="hidden md:inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-gradient-red text-primary-foreground text-sm font-semibold shadow-glow hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" /> New Sale
          </Link>
        </div>
      </div>
    </header>
  );
}
