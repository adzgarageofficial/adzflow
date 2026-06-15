import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SubNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export function SubNav({ items, label }: { items: SubNavItem[]; label?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative mb-5">
      <div className="rounded-xl border border-border bg-card/50 shadow-soft p-1 flex items-center gap-0.5 overflow-x-auto scrollbar-none backdrop-blur-sm">
        {label && (
          <span className="px-3 text-[10px] uppercase tracking-[0.20em] text-muted-foreground/60 font-semibold shrink-0">
            {label}
          </span>
        )}
        {items.map((item) => {
          const active = pathname === item.url || pathname.startsWith(item.url + "/");
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 h-8 text-[13px] font-semibold transition-all duration-150",
                active
                  ? "bg-gradient-red text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.icon && <item.icon className={cn("h-3.5 w-3.5", active ? "text-white" : "")} />}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 rounded-r-xl bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

// Predefined sibling groups used across the app
import {
  Truck, ClipboardList, ArrowLeftRight,
  Clock, CalendarClock, Timer, Plane,
  Target, Briefcase, GraduationCap,
  Gift, MessageSquare, Star, History,
  CalendarCheck, Banknote, UserCircle,
  Package, Boxes, Wrench, PackageCheck,
} from "lucide-react";

export const PROCUREMENT_NAV: SubNavItem[] = [
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList },
  { title: "Deliveries", url: "/deliveries", icon: PackageCheck },
  { title: "Stock Transfers", url: "/stock-transfers", icon: ArrowLeftRight },
];

export const TIME_NAV: SubNavItem[] = [
  { title: "Attendance", url: "/attendance", icon: Clock },
  { title: "Shifts", url: "/shifts", icon: CalendarClock },
  { title: "Overtime", url: "/overtime", icon: Timer },
  { title: "Leaves", url: "/leaves", icon: Plane },
];

export const TALENT_NAV: SubNavItem[] = [
  { title: "Performance", url: "/performance", icon: Target },
  { title: "Recruitment", url: "/recruitment", icon: Briefcase },
  { title: "Training", url: "/training", icon: GraduationCap },
];

export const ENGAGEMENT_NAV: SubNavItem[] = [
  { title: "Loyalty", url: "/loyalty", icon: Gift },
  { title: "CRM", url: "/crm", icon: MessageSquare },
  { title: "Feedback", url: "/feedback", icon: Star },
  { title: "Customer History", url: "/customer-history", icon: History },
];

export const MY_NAV: SubNavItem[] = [
  { title: "Overview", url: "/my", icon: UserCircle },
  { title: "My Queue", url: "/my/queue", icon: Wrench },
  { title: "My Attendance", url: "/my/attendance", icon: CalendarCheck },
  { title: "My Leaves", url: "/my/leaves", icon: Plane },
  { title: "My Payslips", url: "/my/payslips", icon: Banknote },
  { title: "My Performance", url: "/my/performance", icon: Target },
];

export const CATALOG_NAV: SubNavItem[] = [
  { title: "Products", url: "/products", icon: Package },
  { title: "Stock & Inventory", url: "/inventory", icon: Boxes },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList },
  { title: "Deliveries", url: "/deliveries", icon: PackageCheck },
  { title: "Stock Transfers", url: "/stock-transfers", icon: ArrowLeftRight },
];