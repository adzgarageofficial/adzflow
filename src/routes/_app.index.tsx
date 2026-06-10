import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart,
} from "recharts";
import {
  TrendingUp, Package, ArrowUpRight, Wrench, Car, Boxes, Trophy,
  Wallet, Activity, Sparkles, Crown, Flame, TrendingDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { PesoSign } from "@/components/peso-sign";
import { useEffect, useMemo, useState } from "react";
import {
  peso, useOrders, useProducts, useJobOrders, useInventoryLevels, useServices,
  useEmployees, usePayslips, useAllOrderItems,
} from "@/lib/db";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";
import { useRbac } from "@/lib/rbac";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const CHART_GRID = "oklch(1 0 0 / 0.06)";
const CHART_AXIS = "oklch(0.65 0.01 60)";
const CHART_RED = "oklch(0.65 0.24 27)";
const TOOLTIP_STYLE = {
  background: "oklch(0.18 0.014 25)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  boxShadow: "0 8px 24px oklch(0 0 0 / 0.5)",
  color: "oklch(0.96 0.005 60)",
} as const;

function Dashboard() {
  const { can, currentUser } = useRbac();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-dashboard roles to POS once auth is resolved (id="" = fallback/loading)
    if (currentUser.id !== "" && !can("dashboard", "view")) {
      navigate({ to: "/pos" });
    }
  }, [currentUser.id, can, navigate]);

  const { data: orders = [] } = useOrders();
  const { data: products = [] } = useProducts();
  const { data: orderItems = [] } = useAllOrderItems();
  const { data: jobs = [] } = useJobOrders();
  const { data: inv = [] } = useInventoryLevels();
  const { data: services = [] } = useServices();
  const { data: employees = [] } = useEmployees();
  const { data: payslips = [] } = usePayslips();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showAllKpis, setShowAllKpis] = useState(false);

  const m = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);

    let dailyRev = 0, monthlyRev = 0, prevMonthRev = 0, productRev = 0, laborRev = 0;
    const byDay = new Map<string, number>();

    for (const o of orders as any[]) {
      if (o.status === "cancelled") continue;
      const d = (o.created_at ?? "").slice(0, 10);
      const total = Number(o.total) || 0;
      if (d === today) dailyRev += total;
      if (d >= monthStart) { monthlyRev += total; productRev += total; }
      else if (d >= prevMonthStart && d <= prevMonthEnd) prevMonthRev += total;
      byDay.set(d, (byDay.get(d) ?? 0) + total);
    }

    const momPct = prevMonthRev > 0
      ? ((monthlyRev - prevMonthRev) / prevMonthRev) * 100
      : (monthlyRev > 0 ? 100 : 0);

    let activeJobs = 0, vehiclesToday = 0;
    const techStats = new Map<string, { jobs: number; revenue: number }>();
    for (const j of jobs as any[]) {
      const d = (j.created_at ?? "").slice(0, 10);
      if (j.status === "pending" || j.status === "in_progress" || j.status === "awaiting_parts") activeJobs++;
      if (d === today) vehiclesToday++;
      if (d >= monthStart) {
        laborRev += Number(j.labor_cost) || 0;
        if (j.technician_id && j.status === "completed") {
          const cur = techStats.get(j.technician_id) ?? { jobs: 0, revenue: 0 };
          cur.jobs += 1;
          cur.revenue += Number(j.labor_cost) || 0;
          techStats.set(j.technician_id, cur);
        }
      }
    }

    let topTechnician = "—";
    let topTechnicianJobs = 0;
    for (const [techId, stats] of techStats) {
      if (stats.jobs > topTechnicianJobs) {
        topTechnicianJobs = stats.jobs;
        const emp = (employees as any[]).find((e) => e.id === techId);
        topTechnician = emp ? `${emp.first_name} ${emp.last_name}` : "—";
      }
    }

    // Build a 14-day series (zero-fills missing days)
    const series: { d: string; revenue: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const dt = new Date(now);
      dt.setDate(dt.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      series.push({ d: key.slice(5), revenue: byDay.get(key) ?? 0 });
    }

    // Product movement: units sold per day, bucketed for the day/week/month/year breakdown
    const dow = now.getDay();
    const weekStartDate = new Date(now);
    weekStartDate.setDate(now.getDate() - ((dow + 6) % 7));
    const weekStart = weekStartDate.toISOString().slice(0, 10);
    const yearStart = `${now.getFullYear()}-01-01`;

    type ProductSales = {
      id: string; name: string; category: string;
      byDate: Map<string, number>; totalQty: number; totalRevenue: number;
    };
    const salesByProduct = new Map<string, ProductSales>();
    for (const it of orderItems as any[]) {
      const o = it.order;
      if (!o || o.status === "cancelled" || it.is_service) continue;
      const pid = it.product_id ?? it.product?.id;
      if (!pid) continue;
      const d = (o.created_at ?? "").slice(0, 10);
      const qty = Number(it.quantity) || 0;
      const cur = salesByProduct.get(pid) ?? {
        id: pid,
        name: it.product?.name ?? it.name ?? "Unknown product",
        category: it.product?.category?.name ?? "Uncategorized",
        byDate: new Map<string, number>(),
        totalQty: 0,
        totalRevenue: 0,
      };
      cur.byDate.set(d, (cur.byDate.get(d) ?? 0) + qty);
      cur.totalQty += qty;
      cur.totalRevenue += Number(it.line_total) || 0;
      salesByProduct.set(pid, cur);
    }

    const topProducts = [...salesByProduct.entries()]
      .sort((a, b) => b[1].totalQty - a[1].totalQty)
      .slice(0, 6)
      .map(([, v]) => ({ name: v.name, value: v.totalQty }));

    const sumSince = (byDate: Map<string, number>, sinceKey: string) => {
      let sum = 0;
      for (const [d, q] of byDate) if (d >= sinceKey) sum += q;
      return sum;
    };

    const movement = (products as any[])
      .filter((p) => p.status === "active")
      .map((p) => {
        const sales = salesByProduct.get(p.id);
        const byDate = sales?.byDate ?? new Map<string, number>();
        return {
          id: p.id,
          name: p.name,
          category: p.category?.name ?? "Uncategorized",
          totalQty: sales?.totalQty ?? 0,
          totalRevenue: sales?.totalRevenue ?? 0,
          day: byDate.get(today) ?? 0,
          week: sumSince(byDate, weekStart),
          month: sumSince(byDate, monthStart),
          year: sumSince(byDate, yearStart),
        };
      });

    const fastMoving = [...movement].sort((a, b) => b.totalQty - a.totalQty).slice(0, 10);
    const fastIds = new Set(fastMoving.map((p) => p.id));
    const slowMoving = [...movement]
      .filter((p) => !fastIds.has(p.id))
      .sort((a, b) => a.totalQty - b.totalQty)
      .slice(0, 10);

    let invValue = 0;
    for (const lvl of inv as any[]) {
      const qty = Number(lvl.quantity) || 0;
      const cost = Number(lvl.product?.cost_price) || 0;
      invValue += qty * cost;
    }

    // Payroll cost: sum gross pay of payslips whose period overlaps the current month
    let payroll = 0;
    for (const slip of payslips as any[]) {
      const period = slip.period;
      if (!period) continue;
      const start = (period.period_start ?? "").slice(0, 10);
      const end = (period.period_end ?? "").slice(0, 10);
      if (end >= monthStart && start <= today) payroll += Number(slip.gross_pay) || 0;
    }
    const netProfit = monthlyRev - payroll;

    const recent = (orders as any[]).slice(0, 8);
    const activeProducts = (products as any[]).filter((p) => p.status === "active").length;

    return {
      dailyRev, monthlyRev, momPct, productRev, laborRev, payroll, netProfit,
      activeJobs, vehiclesToday, invValue, activeProducts,
      revenueSeries: series, topProducts, recent,
      topService: (services as any[])[0]?.name ?? "—",
      topTechnician, topTechnicianJobs,
      fastMoving, slowMoving,
    };
  }, [orders, products, orderItems, jobs, inv, services, employees, payslips]);

  return (
    <PageShell title="Dashboard" subtitle="Real-time operations across ADZ Garage.">
      {/* HERO STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-6 md:p-8 mb-6"
      >
        <div className="absolute inset-0 bg-gradient-surface opacity-60 pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
              <Sparkles className="h-3 w-3" /> Live · {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
              {peso(m.dailyRev)}
              <span className="ml-3 text-sm font-medium text-muted-foreground">revenue today</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {m.activeJobs} active work order{m.activeJobs === 1 ? "" : "s"} · {m.vehiclesToday} vehicle{m.vehiclesToday === 1 ? "" : "s"} serviced today
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${
              m.momPct >= 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              <ArrowUpRight className={`h-3 w-3 ${m.momPct < 0 ? "rotate-90" : ""}`} />
              {m.momPct >= 0 ? "+" : ""}{m.momPct.toFixed(1)}% MoM
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5">
              <Activity className="h-3 w-3" /> All systems normal
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-2">
        <Kpi label="Today" value={peso(m.dailyRev)} icon={PesoSign} accent />
        <Kpi label="Monthly Revenue" value={peso(m.monthlyRev)} icon={PesoSign} />
        <Kpi label="Net Profit" value={peso(m.netProfit)} icon={PesoSign} accent />
        <Kpi label="Active Work Orders" value={String(m.activeJobs)} icon={Activity} />
        <Kpi label="Vehicles Today" value={String(m.vehiclesToday)} icon={Car} />
        <Kpi label="Top Technician" value={m.topTechnician} icon={Trophy} muted={m.topTechnician === "—"} sub={m.topTechnicianJobs > 0 ? `${m.topTechnicianJobs} jobs` : undefined} />
        {showAllKpis && (
          <>
            <Kpi label="Labor Revenue" value={peso(m.laborRev)} icon={PesoSign} />
            <Kpi label="Product Revenue" value={peso(m.productRev)} icon={PesoSign} />
            <Kpi label="Payroll Cost" value={peso(m.payroll)} icon={PesoSign} muted />
            <Kpi label="Inventory Value" value={peso(m.invValue)} icon={PesoSign} />
            <Kpi label="Best Seller" value={m.topProducts[0]?.name ?? "—"} icon={Package} muted />
            <Kpi label="Top Service" value={m.topService} icon={Wrench} muted />
          </>
        )}
      </div>
      <button
        onClick={() => setShowAllKpis((v) => !v)}
        className="mb-6 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        {showAllKpis ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showAllKpis ? "Show fewer metrics" : "Show 6 more metrics"}
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 rounded-2xl bg-card border border-border shadow-elevated p-6 glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold tracking-tight">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${m.momPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              <ArrowUpRight className={`h-3 w-3 ${m.momPct < 0 ? "rotate-90" : ""}`} />
              {m.momPct >= 0 ? "+" : ""}{m.momPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-[280px]">
            {m.revenueSeries.every((s) => s.revenue === 0) ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">No sales yet.</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.revenueSeries} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_RED} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CHART_RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_GRID} vertical={false} />
                <XAxis dataKey="d" stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART_AXIS} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => peso(v)} />
                <Area type="monotone" dataKey="revenue" stroke={CHART_RED} strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <div className="rounded-2xl bg-card border border-border shadow-elevated p-6 glass-card">
          <h3 className="font-semibold tracking-tight">Best Selling Products</h3>
          <p className="text-xs text-muted-foreground mb-4">By units sold</p>
          <div className="h-[280px]">
            {m.topProducts.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">No products yet.</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.topProducts} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} fontSize={11} stroke={CHART_AXIS} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} units`, "Qty Sold"]} />
                <Bar dataKey="value" fill={CHART_RED} radius={[0, 8, 8, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT MOVEMENT — fast vs slow sellers (click a product for the day/week/month/year breakdown) */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ProductMovementCard
          title="Top 10 Fast-Moving Products"
          subtitle="Highest units sold · click a product for details"
          icon={Flame}
          accent
          items={m.fastMoving}
          emptyLabel="No sales recorded yet."
          onSelect={setSelectedProduct}
        />
        <ProductMovementCard
          title="Slow-Moving Products"
          subtitle="Lowest units sold · candidates for promos or restock review"
          icon={TrendingDown}
          items={m.slowMoving}
          emptyLabel="Not enough data to flag slow movers yet."
          onSelect={setSelectedProduct}
        />
      </div>

      <ProductDetailsDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-elevated overflow-hidden glass-card">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h3 className="font-semibold tracking-tight">Recent Transactions</h3>
            <p className="text-xs text-muted-foreground">Latest activity across all channels</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
              <tr>
                <th className="text-left font-medium px-6 py-3">Order #</th>
                <th className="text-left font-medium px-6 py-3">Customer</th>
                <th className="text-left font-medium px-6 py-3">Channel</th>
                <th className="text-left font-medium px-6 py-3">Date</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-right font-medium px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {m.recent.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No orders yet.</td></tr>
              ) : m.recent.map((s: any) => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-medium">{s.order_number}</td>
                  <td className="px-6 py-4">{s.customer?.full_name ?? "Walk-in"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.channel}</td>
                  <td className="px-6 py-4 text-muted-foreground">{(s.created_at ?? "").slice(0, 10)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        s.status === "paid" || s.status === "completed"
                          ? "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">{peso(Number(s.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

function Kpi({
  label, value, icon: Icon, accent, muted, sub,
}: {
  label: string; value: string; icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  accent?: boolean; muted?: boolean; sub?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative overflow-hidden rounded-2xl border p-4 glass-card ${
        accent ? "border-primary/30 shadow-glow" : "border-border shadow-soft"
      }`}
    >
      {accent && (
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      )}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : muted ? "text-muted-foreground" : "text-foreground/70"}`} />
      </div>
      <p className={`mt-2 text-lg font-bold tracking-tight truncate ${muted ? "text-muted-foreground" : ""}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

type ProductMovement = {
  id: string; name: string; category: string;
  totalQty: number; totalRevenue: number;
  day: number; week: number; month: number; year: number;
};

function ProductMovementCard({
  title, subtitle, icon: Icon, items, emptyLabel, onSelect, accent,
}: {
  title: string; subtitle: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  items: ProductMovement[]; emptyLabel: string;
  onSelect: (p: ProductMovement) => void; accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border shadow-elevated p-6 glass-card"
    >
      <div className="flex items-center gap-2.5 mb-1">
        <span className={`grid place-items-center h-8 w-8 rounded-xl ${accent ? "bg-primary/10 text-primary" : "bg-secondary text-foreground/70"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>

      {items.length === 0 ? (
        <div className="h-[220px] grid place-items-center text-sm text-muted-foreground">{emptyLabel}</div>
      ) : (
        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left hover:bg-secondary/40 hover:border-border transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`shrink-0 grid place-items-center h-7 w-7 rounded-full text-[11px] font-bold ${
                  accent ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.category}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{p.totalQty} sold</p>
                <p className="text-[11px] text-muted-foreground">{peso(p.totalRevenue)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProductDetailsDialog({ product, onClose }: { product: ProductMovement | null; onClose: () => void }) {
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product?.name}</DialogTitle>
          <DialogDescription>
            {product?.category} · {product?.totalQty} unit{product?.totalQty === 1 ? "" : "s"} sold all-time · {peso(product?.totalRevenue ?? 0)} revenue
          </DialogDescription>
        </DialogHeader>
        {product && (
          <div className="grid grid-cols-2 gap-3 mt-1">
            <StatTile label="Today" value={product.day} />
            <StatTile label="This Week" value={product.week} />
            <StatTile label="This Month" value={product.month} />
            <StatTile label="This Year" value={product.year} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight">
        {value} <span className="text-xs font-medium text-muted-foreground">unit{value === 1 ? "" : "s"} sold</span>
      </p>
    </div>
  );
}
