import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMyProfile, useCurrentUserRoles, useProfiles, useUserRoles } from "@/lib/db";

export type ModuleKey =
  | "dashboard"
  | "pos"
  | "orders"
  | "products"
  | "inventory"
  | "customers"
  | "ecommerce"
  | "analytics"
  | "marketing"
  | "finance"
  | "garage"
  | "jobOrders"
  | "quotations"
  | "fitment"
  | "bookings"
  | "employees"
  | "departments"
  | "attendance"
  | "shifts"
  | "overtime"
  | "leaves"
  | "payroll"
  | "performance"
  | "recruitment"
  | "training"
  | "suppliers"
  | "purchaseOrders"
  | "stockTransfers"
  | "refunds"
  | "loyalty"
  | "crm"
  | "feedback"
  | "auditLog"
  | "notifications"
  | "reports"
  | "users"
  | "roles"
  | "settings"
  | "reservations"
  | "promos";

export type ActionKey = "view" | "create" | "edit" | "delete" | "export" | "approve";

export type Permissions = Partial<Record<ModuleKey, ActionKey[]>>;

export interface Role {
  id: string;
  name: string;
  description: string;
  system?: boolean;
  permissions: Permissions;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  roleId: string;
  branch: string;
  status: "active" | "suspended" | "disabled";
  lastActive: string;
}

const ALL_ACTIONS: ActionKey[] = ["view", "create", "edit", "delete", "export", "approve"];
const ALL_MODULES: ModuleKey[] = [
  "dashboard", "pos", "orders", "products", "inventory",
  "customers", "ecommerce", "analytics", "marketing", "finance",
  "garage", "jobOrders", "quotations", "fitment", "bookings",
  "employees", "departments",
  "attendance", "shifts", "overtime",
  "leaves",
  "payroll",
  "performance",
  "recruitment",
  "training",
  "suppliers",
  "purchaseOrders",
  "stockTransfers",
  "refunds",
  "loyalty",
  "crm",
  "feedback",
  "auditLog",
  "notifications",
  "reports",
  "users", "roles", "settings",
  "reservations",
  "promos",
];

const fullAccess = (): Permissions =>
  Object.fromEntries(ALL_MODULES.map((m) => [m, [...ALL_ACTIONS]])) as Permissions;

export const DEFAULT_ROLES: Role[] = [
  {
    id: "owner", name: "Owner", system: true,
    description: "Full access to every module and setting.",
    permissions: fullAccess(),
  },
  {
    id: "admin", name: "Admin", system: true,
    description: "Manage operations. No owner-only settings.",
    permissions: {
      ...fullAccess(),
      settings: ["view", "edit"],
    },
  },
  {
    id: "cashier", name: "Cashier", system: true,
    description: "POS, orders and limited customer access.",
    permissions: {
      pos: ["view", "create"],
      orders: ["view", "create"],
      customers: ["view", "create"],
      refunds: ["view", "create"],
      reservations: ["view", "create", "edit"],
      notifications: ["view"],
    },
  },
  {
    id: "inventory", name: "Inventory Staff", system: true,
    description: "Stocks, products and supplier management.",
    permissions: {
      products: ["view", "create", "edit"],
      inventory: ["view", "create", "edit", "approve"],
      suppliers: ["view", "create", "edit"],
      purchaseOrders: ["view", "create", "edit", "approve"],
      stockTransfers: ["view", "create", "edit", "approve"],
      notifications: ["view"],
    },
  },
  {
    id: "mechanic", name: "Mechanic / Technician", system: true,
    description: "Assigned service jobs and installations.",
    permissions: {
      dashboard: ["view"],
      orders: ["view", "edit"],
      jobOrders: ["view", "create", "edit"],
      quotations: ["view"],
      bookings: ["view", "edit"],
      garage: ["view", "edit"],
      notifications: ["view"],
    },
  },
  {
    id: "marketing", name: "Marketing Staff", system: true,
    description: "Marketing campaigns, ecommerce and customers.",
    permissions: {
      promos: ["view", "create", "edit", "delete"],
      marketing: ["view", "create", "edit"],
      ecommerce: ["view", "create", "edit"],
      customers: ["view", "edit", "export"],
      loyalty: ["view", "create", "edit"],
      crm: ["view", "create", "edit"],
      feedback: ["view", "create", "edit"],
      notifications: ["view"],
    },
  },
  {
    id: "finance", name: "Finance Staff", system: true,
    description: "Finance, analytics and sales reports.",
    permissions: {
      finance: ["view", "edit", "export", "approve"],
      analytics: ["view", "export"],
      orders: ["view", "export"],
      refunds: ["view", "approve"],
      reports: ["view", "create", "edit", "export"],
      auditLog: ["view", "export"],
      notifications: ["view"],
    },
  },
];

interface RbacContextValue {
  currentUser: AppUser;
  currentRole: Role;
  users: AppUser[];
  roles: Role[];
  setRoles: (r: Role[]) => void;
  can: (mod: ModuleKey, action?: ActionKey) => boolean;
}

const Ctx = createContext<RbacContextValue | null>(null);

const LS_ROLES = "adz.rbac.roles.v2";

const FALLBACK_USER: AppUser = {
  id: "", name: "…", email: "", username: "", roleId: "cashier",
  branch: "—", status: "active", lastActive: "",
};

function toAppUser(profile: any, roleId: string): AppUser {
  const handle = profile.email?.split("@")[0] ?? "user";
  return {
    id: profile.id,
    name: profile.display_name ?? handle,
    email: profile.email ?? "",
    username: profile.username ?? handle,
    avatar: profile.avatar_url ?? undefined,
    roleId,
    branch: profile.branch?.name ?? "—",
    status: profile.status ?? "active",
    lastActive: profile.last_active ? new Date(profile.last_active).toLocaleString() : "—",
  };
}

/**
 * Permissions are still keyed off the editable role matrix below (and persisted
 * locally so the Roles page can customize them), but WHICH role applies to the
 * signed-in person now comes straight from Supabase `user_roles` — so each
 * employee only ever sees the modules their real, assigned role grants.
 */
export function RbacProvider({ children }: { children: ReactNode }) {
  const [roles, setRolesState] = useState<Role[]>(DEFAULT_ROLES);

  useEffect(() => {
    try {
      const r = localStorage.getItem(LS_ROLES);
      if (r) setRolesState(JSON.parse(r));
    } catch {}
  }, []);

  const setRoles = (r: Role[]) => {
    setRolesState(r);
    try { localStorage.setItem(LS_ROLES, JSON.stringify(r)); } catch {}
  };

  const { data: myProfile } = useMyProfile();
  const { data: myRoles = [] } = useCurrentUserRoles();
  const { data: profiles = [] } = useProfiles();
  const { data: userRoles = [] } = useUserRoles();

  const value = useMemo<RbacContextValue>(() => {
    const myRoleId = myRoles[0] ?? "cashier";
    const currentRole = roles.find((r) => r.id === myRoleId) ?? roles[0];
    const currentUser = myProfile ? toAppUser(myProfile, myRoleId) : FALLBACK_USER;

    const roleByUser = new Map<string, string>((userRoles as any[]).map((r) => [r.user_id, r.role]));
    const users = (profiles as any[]).map((p) => toAppUser(p, roleByUser.get(p.id) ?? "cashier"));

    const can = (mod: ModuleKey, action: ActionKey = "view") => {
      const acts = currentRole.permissions[mod];
      return !!acts && acts.includes(action);
    };
    return { currentUser, currentRole, users, roles, setRoles, can };
  }, [roles, myProfile, myRoles, profiles, userRoles]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRbac() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRbac must be used inside RbacProvider");
  return ctx;
}

export const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: "Dashboard",
  pos: "POS",
  orders: "Orders",
  products: "Products",
  inventory: "Inventory",
  customers: "Customers",
  ecommerce: "Ecommerce",
  analytics: "Analytics",
  marketing: "Marketing",
  finance: "Finance",
  garage: "Vehicle Garage",
  jobOrders: "Job Orders",
  quotations: "Quotations",
  fitment: "Fitment",
  bookings: "Bookings",
  employees: "Employees",
  departments: "Departments",
  attendance: "Attendance",
  shifts: "Shifts",
  overtime: "Overtime",
  leaves: "Leave Management",
  payroll: "Payroll",
  performance: "Performance",
  recruitment: "Recruitment",
  training: "Training",
  suppliers: "Suppliers",
  purchaseOrders: "Purchase Orders",
  stockTransfers: "Stock Transfers",
  refunds: "Refunds & Voids",
  loyalty: "Loyalty Program",
  crm: "CRM Interactions",
  feedback: "Customer Feedback",
  auditLog: "Audit Log",
  notifications: "Notifications",
  reports: "Reports",
  users: "Users",
  roles: "Roles & Permissions",
  settings: "Settings",
  reservations: "Reservations",
  promos: "Promotions",
};

export const ALL_ACTION_KEYS = ALL_ACTIONS;
export const ALL_MODULE_KEYS = ALL_MODULES;