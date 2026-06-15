import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, ENGAGEMENT_NAV } from "@/components/sub-nav";
import {
  useCustomers, useCustomerOrders, useCustomerJobOrders,
  useCustomerInteractions, useCustomerQuotations, peso,
} from "@/lib/db";
import { useMemo, useState } from "react";
import {
  Search, User, ShoppingBag, Wrench, MessageSquare, FileText,
  Phone, Mail, MapPin, Gift, TrendingUp, Calendar, Clock,
  ChevronRight, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customer-history")({ component: CustomerHistoryPage });

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-600",
  completed: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  draft: "bg-secondary text-muted-foreground",
  cancelled: "bg-rose-500/10 text-rose-600",
  void: "bg-rose-500/10 text-rose-600",
  open: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-violet-500/10 text-violet-600",
};

const tabs = [
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "workshop", label: "Workshop", icon: Wrench },
  { id: "quotations", label: "Quotations", icon: FileText },
  { id: "crm", label: "CRM", icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

function CustomerHistoryPage() {
  const { data: customers = [], isLoading: loadingCx } = useCustomers();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("orders");

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return (customers as any[]).filter(
      (c) =>
        !q ||
        c.full_name?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.phone?.includes(s),
    );
  }, [customers, q]);

  const selected = (customers as any[]).find((c) => c.id === selectedId) ?? null;

  return (
    <PageShell
      title="Customer History"
      subtitle="View purchase, service, and interaction history per customer."
    >
      <SubNav items={ENGAGEMENT_NAV} label="Customers" />

      <div className="flex gap-5 min-h-[600px]">
        {/* ── Left: customer list ── */}
        <div className="w-72 shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customers…"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden flex-1">
            {loadingCx ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">No customers found.</div>
            ) : (
              <ul className="divide-y divide-border max-h-[calc(100vh-280px)] overflow-y-auto">
                {filtered.map((c: any) => (
                  <li key={c.id}>
                    <button
                      onClick={() => { setSelectedId(c.id); setTab("orders"); }}
                      className={cn(
                        "w-full text-left px-4 py-3 flex items-center gap-3 transition hover:bg-secondary/50",
                        selectedId === c.id && "bg-accent",
                      )}
                    >
                      <div className="h-9 w-9 rounded-full bg-gradient-red text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
                        {c.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{c.full_name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {c.phone ?? c.email ?? "No contact"}
                        </div>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 text-muted-foreground shrink-0 transition", selectedId === c.id && "text-primary")} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Right: history panel ── */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="h-full rounded-2xl bg-card border border-border shadow-soft flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <User className="h-12 w-12 opacity-20" />
              <p className="text-sm">Select a customer to view their history.</p>
            </div>
          ) : (
            <CustomerDetail customer={selected} tab={tab} onTabChange={setTab} />
          )}
        </div>
      </div>
    </PageShell>
  );
}

function CustomerDetail({ customer, tab, onTabChange }: { customer: any; tab: TabId; onTabChange: (t: TabId) => void }) {
  const { data: orders = [], isLoading: lo } = useCustomerOrders(customer.id);
  const { data: jobOrders = [], isLoading: lj } = useCustomerJobOrders(customer.id);
  const { data: quotations = [], isLoading: lq } = useCustomerQuotations(customer.id);
  const { data: interactions = [], isLoading: li } = useCustomerInteractions(customer.id);

  const stats = [
    { label: "Orders", value: (orders as any[]).length, icon: ShoppingBag },
    { label: "Workshop", value: (jobOrders as any[]).length, icon: Wrench },
    { label: "Lifetime Value", value: peso(Number(customer.lifetime_value || 0)), icon: TrendingUp },
    { label: "Loyalty Pts", value: `${customer.loyalty_points ?? 0} pts`, icon: Gift },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Profile card */}
      <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-red text-primary-foreground grid place-items-center text-lg font-bold shrink-0">
            {customer.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold">{customer.full_name}</div>
            <div className="flex flex-wrap gap-3 mt-1 text-[12px] text-muted-foreground">
              {customer.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span>}
              {customer.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span>}
              {customer.address && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{customer.address}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="text-base font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-border bg-card shadow-soft p-1.5 flex items-center gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 h-9 text-sm font-medium transition-all",
              tab === t.id
                ? "bg-accent text-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <t.icon className={cn("h-4 w-4", tab === t.id && "text-primary")} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        {tab === "orders" && <OrdersTab orders={orders as any[]} loading={lo} />}
        {tab === "workshop" && <WorkshopTab jobOrders={jobOrders as any[]} loading={lj} />}
        {tab === "quotations" && <QuotationsTab quotations={quotations as any[]} loading={lq} />}
        {tab === "crm" && <CrmTab interactions={interactions as any[]} loading={li} />}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="px-6 py-14 text-center text-muted-foreground text-sm">{label}</div>;
}

function LoadingState() {
  return <div className="px-6 py-10 text-center text-muted-foreground text-sm">Loading…</div>;
}

function OrdersTab({ orders, loading }: { orders: any[]; loading: boolean }) {
  if (loading) return <LoadingState />;
  if (!orders.length) return <EmptyState label="No orders found for this customer." />;
  return (
    <ul className="divide-y divide-border">
      {orders.map((o) => (
        <li key={o.id} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/30 transition">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 grid place-items-center shrink-0">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Order #{o.order_number ?? o.id.slice(0, 8)}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              <span className="capitalize">{o.channel ?? "walk-in"}</span>
              {o.status && (
                <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold", STATUS_COLOR[o.status] ?? "bg-secondary text-muted-foreground")}>
                  {o.status}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-semibold text-sm">{peso(Number(o.total || 0))}</div>
            <div className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WorkshopTab({ jobOrders, loading }: { jobOrders: any[]; loading: boolean }) {
  if (loading) return <LoadingState />;
  if (!jobOrders.length) return <EmptyState label="No workshop jobs found for this customer." />;
  return (
    <ul className="divide-y divide-border">
      {jobOrders.map((j) => (
        <li key={j.id} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/30 transition">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-500 grid place-items-center shrink-0">
            <Wrench className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{j.description ?? `Job #${j.id.slice(0, 8)}`}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {j.vehicle && <span>{j.vehicle.make} {j.vehicle.model} · {j.vehicle.plate_number}</span>}
              {j.status && (
                <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold", STATUS_COLOR[j.status] ?? "bg-secondary text-muted-foreground")}>
                  {j.status}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            {j.total_cost != null && <div className="font-semibold text-sm">{peso(Number(j.total_cost))}</div>}
            <div className="text-[11px] text-muted-foreground">{new Date(j.created_at).toLocaleDateString()}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function QuotationsTab({ quotations, loading }: { quotations: any[]; loading: boolean }) {
  if (loading) return <LoadingState />;
  if (!quotations.length) return <EmptyState label="No quotations found for this customer." />;
  return (
    <ul className="divide-y divide-border">
      {quotations.map((qt) => (
        <li key={qt.id} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/30 transition">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 grid place-items-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{qt.title ?? `Quote #${qt.id.slice(0, 8)}`}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {qt.vehicle && <span>{qt.vehicle.make} {qt.vehicle.model}</span>}
              {qt.status && (
                <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold", STATUS_COLOR[qt.status] ?? "bg-secondary text-muted-foreground")}>
                  {qt.status}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            {qt.total != null && <div className="font-semibold text-sm">{peso(Number(qt.total))}</div>}
            <div className="text-[11px] text-muted-foreground">{new Date(qt.created_at).toLocaleDateString()}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CrmTab({ interactions, loading }: { interactions: any[]; loading: boolean }) {
  if (loading) return <LoadingState />;
  if (!interactions.length) return <EmptyState label="No CRM interactions found for this customer." />;
  return (
    <ul className="divide-y divide-border">
      {interactions.map((i) => (
        <li key={i.id} className="px-5 py-4 flex items-start gap-4 hover:bg-secondary/30 transition">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 grid place-items-center shrink-0 mt-0.5">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{i.subject}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 capitalize">{i.type}{i.channel && ` · ${i.channel}`}</div>
            {i.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{i.body}</p>}
            {i.outcome && <div className="text-[11px] text-muted-foreground mt-1"><b>Outcome:</b> {i.outcome}</div>}
          </div>
          <div className="text-[11px] text-muted-foreground shrink-0 text-right">
            {new Date(i.created_at).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
