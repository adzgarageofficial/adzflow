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
  ShieldCheck,
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
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "@/assets/adz-logo.png";
import { cn } from "@/lib/utils";
import { useRbac, type ModuleKey } from "@/lib/rbac";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export type Item = { title: string; url: string; icon: typeof LayoutDashboard; mod: ModuleKey };
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
    ],
  },
  {
    id: "inventory", title: "Inventory", icon: InventoryGroup,
    items: [
      { title: "Products & Stock", url: "/products", icon: Package, mod: "products" },
      { title: "Suppliers", url: "/suppliers", icon: Truck, mod: "suppliers" },
      { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList, mod: "purchaseOrders" },
      { title: "Stock Transfers", url: "/stock-transfers", icon: ArrowLeftRight, mod: "stockTransfers" },
    ],
  },
  {
    id: "customers", title: "Customers", icon: HeartHandshake,
    items: [
      { title: "Customers", url: "/customers", icon: Users, mod: "customers" },
      { title: "Loyalty", url: "/loyalty", icon: Gift, mod: "loyalty" },
      { title: "CRM", url: "/crm", icon: MessageSquare, mod: "crm" },
      { title: "Feedback", url: "/feedback", icon: Star, mod: "feedback" },
    ],
  },
  {
    id: "marketing", title: "Marketing", icon: TrendingUp,
    items: [
      { title: "Promotions", url: "/promos", icon: Tag, mod: "promos" },
      { title: "Ecommerce", url: "/ecommerce", icon: Store, mod: "ecommerce" },
      { title: "Marketing", url: "/marketing", icon: Megaphone, mod: "marketing" },
      { title: "Analytics", url: "/analytics", icon: BarChart3, mod: "analytics" },
    ],
  },
  {
    id: "finance", title: "Finance", icon: CircleDollarSign,
    items: [
      { title: "Finance", url: "/finance", icon: Wallet, mod: "finance" },
      { title: "Reports", url: "/reports", icon: FileBarChart, mod: "reports" },
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
      { title: "Users", url: "/users", icon: UserCog, mod: "users" },
      { title: "Roles", url: "/roles", icon: ShieldCheck, mod: "roles" },
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
    .map((g) => ({ ...g, items: g.items.filter((i) => can(i.mod, "view")) }))
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
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="sticky top-0 h-screen shrink-0 border-r border-sidebar-border bg-sidebar shadow-soft z-30"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 px-4 h-[68px] border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-xl bg-black shadow-glow flex items-center justify-center overflow-hidden ring-1 ring-primary/40 shrink-0">
            <img src={logo} alt="ADZ Garage" className="h-9 w-9 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold tracking-tight text-[15px]">ADZ GARAGE</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Enterprise Suite
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "ml-auto h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition",
              collapsed && "absolute left-1/2 -translate-x-1/2 top-[76px] bg-card border border-border shadow-soft",
            )}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {can(DASHBOARD.mod, "view") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={DASHBOARD.url}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-all",
                    "text-sidebar-foreground/80 hover:bg-secondary hover:text-foreground",
                    isItemActive(DASHBOARD.url) && "bg-accent text-accent-foreground hover:bg-accent shadow-soft",
                  )}
                >
                  {isItemActive(DASHBOARD.url) && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary shadow-glow"
                    />
                  )}
                  <DASHBOARD.icon className={cn("h-[18px] w-[18px] shrink-0", isItemActive(DASHBOARD.url) && "text-primary")} />
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
                  "group relative flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-all",
                  "text-sidebar-foreground/80 hover:bg-secondary hover:text-foreground",
                  pathname.startsWith("/my") && "bg-accent text-accent-foreground hover:bg-accent shadow-soft",
                )}
              >
                <MY_WORKSPACE.icon className={cn("h-[18px] w-[18px] shrink-0", pathname.startsWith("/my") && "text-primary")} />
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
                <div key={group.id} className="pt-3 first:pt-0">
                  {group.items.map((item) => {
                    const active = isItemActive(item.url);
                    return (
                      <Tooltip key={item.url}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.url}
                            className={cn(
                              "group relative flex items-center justify-center rounded-xl h-10 mb-1 transition-all",
                              "text-sidebar-foreground/80 hover:bg-secondary hover:text-foreground",
                              active && "bg-accent text-accent-foreground hover:bg-accent shadow-soft",
                            )}
                          >
                            <item.icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
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
              <div key={group.id} className="pt-2">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-all",
                    "text-sidebar-foreground/80 hover:bg-secondary hover:text-foreground",
                    groupHasActive && "text-foreground",
                  )}
                >
                  <group.icon className={cn("h-[18px] w-[18px] shrink-0", groupHasActive && "text-primary")} />
                  <span className="truncate flex-1 text-left">{group.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l border-sidebar-border space-y-0.5">
                    {group.items.map((item) => {
                      const active = isItemActive(item.url);
                      return (
                        <Link
                          key={item.url}
                          to={item.url}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg px-3 h-9 text-[13px] font-medium transition-all",
                            "text-sidebar-foreground/70 hover:bg-secondary hover:text-foreground",
                            active && "bg-accent text-accent-foreground hover:bg-accent shadow-soft",
                          )}
                        >
                          <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
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
              <button className="m-3 rounded-2xl bg-gradient-surface border border-border p-3 shadow-soft text-left hover:bg-secondary/40 transition">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold text-xs shrink-0">
                    {currentUser.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{currentRole.name} · {currentUser.branch}</div>
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
                  <button className="mx-auto mb-3 h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold text-xs hover:bg-primary/20 transition">
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
