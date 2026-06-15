import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanLine,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  Store,
  BarChart3,
  Megaphone,
  Wallet,
  ChevronLeft,
  UserCog,
  Car,
  Wrench,
  FileText,
  CalendarDays,
  LayoutGrid,
  Users2,
  Building2,
  Clock,
  Timer,
  CalendarClock,
  Plane,
  Banknote,
  Target,
  Briefcase,
  GraduationCap,
  Truck,
  ClipboardList,
  ArrowLeftRight,
  Wallet as WalletIcon,
  Undo2,
  Gift,
  Tag,
  MessageSquare,
  Star,
  Bell,
  FileBarChart,
  ShieldAlert,
  Settings as SettingsIcon,
  ChevronDown,
  ShoppingCart,
  Wrench as WrenchGroup,
  Boxes as InventoryGroup,
  HeartHandshake,
  TrendingUp,
  CircleDollarSign,
  Users as HRGroup,
  ShieldAlert as AdminGroup,
  UserCircle,
  LogOut,
  Percent,
  History,
  PackageCheck,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "@/assets/adz-logo.png";
import { cn } from "@/lib/utils";
import { useRbac, type ModuleKey } from "@/lib/rbac";
import { useIsOwner } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export type Item = { title: string; url: string; icon: typeof LayoutDashboard; mod: ModuleKey; ownerOnly?: boolean };
export type Group = { id: string; title: string; icon: typeof LayoutDashboard; items: Item[] };

export const DASHBOARD: Item = { title: "Dashboard", url: "/", icon: LayoutDashboard, mod: "dashboard" };
export const MY_WORKSPACE: Item = { title: "My Workspace", url: "/my", icon: UserCircle, mod: "dashboard" };

export const GROUPS: Group[] = [
  {
    id: "sales", title: "Sales", icon: ShoppingCart,
    items: [
      { title: "POS", url: "/pos", icon: ScanLine, mod: "pos" },
      { title: "Reservations", url: "/reservations", icon: CalendarClock, mod: "reservations" },
      { title: "Orders", url: "/orders", icon: ShoppingBag, mod: "orders" },
{ title: "Refunds & Voids", url: "/refunds", icon: Undo2, mod: "refunds" },
    ],
  },
  {
    id: "service", title: "Service", icon: WrenchGroup,
    items: [
      { title: "Workshop", url: "/bays", icon: Wrench, mod: "garage" },
      { title: "Quotations", url: "/quotations", icon: FileText, mod: "quotations" },
      { title: "Bookings", url: "/bookings", icon: CalendarDays, mod: "bookings" },
      { title: "Oil Records", url: "/oil-records", icon: History, mod: "bookings" },
    ],
  },
  {
    id: "inventory", title: "Inventory", icon: InventoryGroup,
    items: [
      { title: "Products & Stock", url: "/products", icon: Package, mod: "products" },
      { title: "Brands & Costing", url: "/brands", icon: Percent, mod: "products", ownerOnly: true },
      { title: "Suppliers", url: "/suppliers", icon: Truck, mod: "suppliers" },
      { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList, mod: "purchaseOrders" },
      { title: "Deliveries", url: "/deliveries", icon: PackageCheck, mod: "deliveries" },
      { title: "Stock Transfers", url: "/stock-transfers", icon: ArrowLeftRight, mod: "stockTransfers" },
    ],
  },
  {
    id: "customers", title: "Customers", icon: HeartHandshake,
    items: [
      { title: "Customers", url: "/customers", icon: Users, mod: "customers" },
      { title: "Customer History", url: "/customer-history", icon: History, mod: "customers" },
      { title: "Loyalty", url: "/loyalty", icon: Gift, mod: "loyalty" },
      { title: "CRM", url: "/crm", icon: MessageSquare, mod: "crm" },
      { title: "Feedback", url: "/feedback", icon: Star, mod: "feedback" },
    ],
  },
  {
    id: "marketing", title: "Marketing", icon: TrendingUp,
    items: [
      { title: "Promotions", url: "/promos", icon: Tag, mod: "promos" },
      { title: "Discounts", url: "/discounts", icon: Percent, mod: "discounts" },
      { title: "Ecommerce", url: "/ecommerce", icon: Store, mod: "ecommerce" },
      { title: "Marketing", url: "/marketing", icon: Megaphone, mod: "marketing" },
      { title: "Analytics", url: "/analytics", icon: BarChart3, mod: "analytics" },
    ],
  },
  {
    id: "finance", title: "Finance", icon: CircleDollarSign,
    items: [
      { title: "Finance & Reports", url: "/finance", icon: FileBarChart, mod: "finance" },
      { title: "Cash Flow", url: "/cash-flow", icon: WalletIcon, mod: "cashFlow" },
      { title: "Payments", url: "/payments", icon: CreditCard, mod: "payments" },
    ],
  },
  {
    id: "hr", title: "Human Resources", icon: HRGroup,
    items: [
      { title: "Employees", url: "/employees", icon: Users2, mod: "employees" },
      { title: "Departments", url: "/departments", icon: Building2, mod: "departments" },
      { title: "Attendance", url: "/attendance", icon: Clock, mod: "attendance" },
      { title: "Shifts", url: "/shifts", icon: CalendarClock, mod: "shifts" },
      { title: "Overtime", url: "/overtime", icon: Timer, mod: "overtime" },
      { title: "Leaves", url: "/leaves", icon: Plane, mod: "leaves" },
      { title: "Payroll", url: "/payroll", icon: Banknote, mod: "payroll" },
      { title: "Performance", url: "/performance", icon: Target, mod: "performance" },
      { title: "Recruitment", url: "/recruitment", icon: Briefcase, mod: "recruitment" },
      { title: "Training", url: "/training", icon: GraduationCap, mod: "training" },
    ],
  },
  {
    id: "admin", title: "Administration", icon: AdminGroup,
    items: [
      { title: "Users & Roles", url: "/users", icon: UserCog, mod: "users" },
      { title: "Notifications", url: "/notifications", icon: Bell, mod: "notifications" },
      { title: "Audit Log", url: "/audit-log", icon: ShieldAlert, mod: "auditLog" },
      { title: "Settings", url: "/settings", icon: SettingsIcon, mod: "settings" },
    ],
  },
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { can, currentUser, currentRole } = useRbac();
  const isOwner = useIsOwner();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Failed to log out");
      return;
    }
    toast.success("Logged out");
    navigate({ to: "/login" });
  };

  const visibleGroups = GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => can(i.mod, "view") && (!i.ownerOnly || isOwner)) }))
    .filter((g) => g.items.length > 0);

  const isItemActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(url + "/");

  const activeGroupId = visibleGroups.find((g) => g.items.some((i) => isItemActive(i.url)))?.id;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (activeGroupId) {
      setOpenGroups((prev) => (prev[activeGroupId] ? prev : { ...prev, [activeGroupId]: true }));
    }
  }, [activeGroupId]);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <TooltipProvider delayDuration={300}>
    <motion.aside
      animate={{ width: collapsed ? 72 : 252 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="sticky top-0 h-screen shrink-0 border-r border-sidebar-border bg-sidebar z-30"
      style={{ boxShadow: "4px 0 20px oklch(0 0 0 / 0.08)" }}
    >
      <div className="flex h-full flex-col">
        {/* Logo header */}
        <div className="flex items-center gap-2.5 px-4 h-[68px] border-b border-sidebar-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
          <div className="h-10 w-10 rounded-xl bg-gradient-red flex items-center justify-center overflow-hidden shrink-0 shadow-glow">
            <img src={logo} alt="ADZ Garage" className="h-9 w-9 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold tracking-tight text-[15px] text-sidebar-foreground">ADZ GARAGE</span>
              <span className="text-[10px] uppercase tracking-[0.20em] text-sidebar-foreground/40 font-medium">
                Enterprise Suite
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "ml-auto h-7 w-7 rounded-lg flex items-center justify-center text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all",
              collapsed && "absolute left-1/2 -translate-x-1/2 top-[76px] bg-card border border-border shadow-soft",
            )}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2.5 py-3 space-y-0.5">
          {can(DASHBOARD.mod, "view") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={DASHBOARD.url}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 h-10 text-[13px] font-semibold transition-all duration-150",
                    "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                    isItemActive(DASHBOARD.url) && "nav-active text-sidebar-foreground",
                  )}
                >
                  {isItemActive(DASHBOARD.url) && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px oklch(0.65 0.27 25 / 0.8)" }}
                    />
                  )}
                  <DASHBOARD.icon className={cn("h-[17px] w-[17px] shrink-0 transition-colors", isItemActive(DASHBOARD.url) ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70")} />
                  {!collapsed && <span className="truncate">{DASHBOARD.title}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{DASHBOARD.title}</TooltipContent>}
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={MY_WORKSPACE.url}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 h-10 text-[13px] font-semibold transition-all duration-150",
                  "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                  pathname.startsWith("/my") && "nav-active text-sidebar-foreground",
                )}
              >
                {pathname.startsWith("/my") && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary"
                    style={{ boxShadow: "0 0 8px oklch(0.65 0.27 25 / 0.8)" }}
                  />
                )}
                <MY_WORKSPACE.icon className={cn("h-[17px] w-[17px] shrink-0 transition-colors", pathname.startsWith("/my") ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70")} />
                {!collapsed && <span className="truncate">{MY_WORKSPACE.title}</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{MY_WORKSPACE.title}</TooltipContent>}
          </Tooltip>

          {visibleGroups.map((group) => {
            const isOpen = openGroups[group.id] ?? group.id === activeGroupId;
            const groupHasActive = group.id === activeGroupId;

            if (collapsed) {
              return (
                <div key={group.id} className="pt-2.5 first:pt-0">
                  <div className="w-full h-px bg-sidebar-border mb-2" />
                  {group.items.map((item) => {
                    const active = isItemActive(item.url);
                    return (
                      <Tooltip key={item.url}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.url}
                            className={cn(
                              "group relative flex items-center justify-center rounded-xl h-9 w-9 mx-auto mb-0.5 transition-all duration-150",
                              "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                              active && "nav-active text-sidebar-foreground",
                            )}
                          >
                            <item.icon className={cn("h-[17px] w-[17px]", active && "text-primary")} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            }

            return (
              <div key={group.id} className="pt-3 first:pt-1">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-xl px-3 h-9 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-150",
                    "text-sidebar-foreground/35 hover:text-sidebar-foreground/60 hover:bg-sidebar-accent/40",
                    groupHasActive && "text-sidebar-foreground/55",
                  )}
                >
                  <group.icon className={cn("h-[15px] w-[15px] shrink-0", groupHasActive ? "text-primary/70" : "text-sidebar-foreground/30")} />
                  <span className="truncate flex-1 text-left">{group.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-sidebar-foreground/25 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="mt-0.5 ml-2.5 pl-3 border-l border-sidebar-border/60 space-y-0.5">
                    {group.items.map((item) => {
                      const active = isItemActive(item.url);
                      return (
                        <Link
                          key={item.url}
                          to={item.url}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-lg px-2.5 h-[34px] text-[13px] font-medium transition-all duration-150",
                            "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                            active && "nav-active text-sidebar-foreground",
                          )}
                        >
                          {active && (
                            <span
                              className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary"
                              style={{ boxShadow: "0 0 6px oklch(0.65 0.27 25 / 0.7)" }}
                            />
                          )}
                          <item.icon className={cn("h-[15px] w-[15px] shrink-0 transition-colors", active ? "text-primary" : "text-sidebar-foreground/35 group-hover:text-sidebar-foreground/60")} />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {!collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="m-3 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/30 p-3 text-left hover:bg-sidebar-accent/50 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-red text-white grid place-items-center font-bold text-[11px] shrink-0 shadow-glow">
                    {currentUser.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-semibold truncate text-sidebar-foreground">{currentUser.name}</div>
                    <div className="text-[10px] text-sidebar-foreground/40 truncate">{currentRole.name} · {currentUser.branch}</div>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-[210px]">
              <DropdownMenuItem onClick={handleLogout} className="text-rose-500 focus:text-rose-500">
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mx-auto mb-3 h-8 w-8 rounded-lg bg-gradient-red text-white grid place-items-center font-bold text-[11px] hover:opacity-90 transition shadow-glow">
                    {currentUser.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-muted-foreground text-[11px]">{currentRole.name}</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-[210px]">
              <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
                {currentUser.name} · {currentUser.branch}
              </div>
              <DropdownMenuItem onClick={handleLogout} className="text-rose-500 focus:text-rose-500">
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.aside>
    </TooltipProvider>
  );
}
