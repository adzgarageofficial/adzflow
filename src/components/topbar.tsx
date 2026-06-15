import { Search, Bell, Wifi, WifiOff, Command, Plus, Sun, Moon, Info, CheckCircle2, AlertTriangle, AlertCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { MobileNavTrigger } from "@/components/mobile-nav";
import { GlobalSearch } from "@/components/global-search";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, useUpdate } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

const SEVERITY_META: Record<string, { color: string; Icon: any }> = {
  info: { color: "text-blue-500", Icon: Info },
  success: { color: "text-emerald-500", Icon: CheckCircle2 },
  warning: { color: "text-amber-500", Icon: AlertTriangle },
  error: { color: "text-rose-500", Icon: AlertCircle },
};

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [online, setOnline] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
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
      <div className="flex items-center gap-3 px-4 md:px-6 h-[60px] md:h-[66px]">
        <MobileNavTrigger />
        <div className="min-w-0">
          <h1 className="text-[15px] md:text-[16px] font-bold tracking-tight truncate">{title}</h1>
          {subtitle && (
            <p className="hidden sm:block text-[11px] text-muted-foreground/70 truncate mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 h-9 w-[280px] rounded-xl border border-border bg-secondary/40 px-3 shadow-soft text-left hover:bg-secondary/70 transition-all"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="flex-1 text-[13px] text-muted-foreground/60 truncate">Search…</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/40 border border-border/60 rounded px-1.5 py-0.5 font-mono">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="md:hidden h-9 w-9 rounded-xl border border-border bg-secondary/40 grid place-items-center hover:bg-secondary/70 transition"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1 border",
              online
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20",
            )}
          >
            {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {online ? "Online" : "Offline"}
          </span>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            className="h-9 w-9 rounded-xl border border-border bg-secondary/40 grid place-items-center hover:bg-secondary/70 transition text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          <NotificationBell />

          <Link
            to="/pos"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("pos:new-sale"));
              }
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-red text-primary-foreground text-[13px] font-bold shadow-glow hover:opacity-90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:inline">New Sale</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function NotificationBell() {
  const navigate = useNavigate();
  const { data: notifs = [] } = useNotifications();
  const update = useUpdate<any>("notifications");
  const [open, setOpen] = useState(false);

  const list = (notifs as any[]).slice(0, 8);
  const unreadCount = (notifs as any[]).filter((n) => !n.read_at).length;

  const markRead = (id: string) => update.mutate({ id, patch: { read_at: new Date().toISOString() } });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative h-10 w-10 rounded-xl border border-border bg-card/60 grid place-items-center shadow-soft hover:bg-secondary transition">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                const now = new Date().toISOString();
                (notifs as any[]).filter((n) => !n.read_at).forEach((n) => update.mutate({ id: n.id, patch: { read_at: now } }));
              }}
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
          ) : (
            list.map((n) => {
              const meta = SEVERITY_META[n.severity] ?? SEVERITY_META.info;
              const Icon = meta.Icon;
              const unread = !n.read_at;
              return (
                <div key={n.id} className={cn("flex items-start gap-2.5 px-4 py-3 text-sm", unread && "bg-primary/5")}>
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", meta.color)} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate", unread && "font-semibold")}>{n.title}</p>
                    {n.body && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                  </div>
                  {unread && (
                    <button onClick={() => markRead(n.id)} title="Mark read" className="h-6 w-6 rounded-lg hover:bg-secondary grid place-items-center shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
        <button
          onClick={() => { setOpen(false); navigate({ to: "/notifications" }); }}
          className="w-full text-center text-xs font-semibold text-primary py-2.5 border-t border-border hover:bg-secondary/50 transition"
        >
          View all notifications
        </button>
      </PopoverContent>
    </Popover>
  );
}
