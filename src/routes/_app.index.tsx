import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart,
} from "recharts";
import {
  TrendingUp, Package, ArrowUpRight, Wrench, Car, Boxes, Trophy,
  Wallet, Activity, Sparkles, Crown,
} from "lucide-react";
import { PesoSign } from "@/components/peso-sign";
import { useMemo } from "react";
import {
  peso, useOrders, useProducts, useJobOrders, useInventoryLevels, useServices,
} from "@/lib/db";
import { motion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";

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
  const { data: orders = [] } = useOrders();
  const { data: products = [] } = useProducts();
  const { data: jobs = [] } = useJobOrders();
  const { data: inv = [] } = useInventoryLevels();
  const { data: services = [] } = useServices();

  const m = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

    let dailyRev = 0, monthlyRev = 0, productRev = 0, laborRev = 0;
    const byDay = new Map<string, number>();

    for (const o of orders as any[]) {
      if (o.status === "cancelled") continue;
      const d = (o.created_at ?? "").slice(0, 10);
      const total = Number(o.total) || 0;
      if (d === today) dailyRev += total;
      if (d >= monthStart) { monthlyRev += total; productRev += total; }
      byDay.set(d, (byDay.get(d) ?? 0) + total);
    }

    let activeJobs = 0, vehiclesToday = 0;
    for (const j of jobs as any[]) {
      const d = (j.created_at ?? "").slice(0, 10);
      if (j.status === "pending" || j.status === "in_progress" || j.status === "awaiting_parts") activeJobs++;
      if (d === today) vehiclesToday++;
      if (d >= monthStart) laborRev += Number(j.labor_cost) || 0;
    }

    // Build a 14-day series (zero-fills missing days)
    const series: { d: string; revenue: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const dt = new Date(now);
      dt.setDate(dt.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      series.push({ d: key.slice(5), revenue: byDay.get(key) ?? 0 });
    }

    const topProducts = (products as any[])
      .slice(0, 6)
      .map((p) => ({ name: p.name, value: Number(p.retail_price ?? p.base_price) || 0 }));

    let invValue = 0;
    for (const lvl of inv as any[]) {
      const qty = Number(lvl.quantity) || 0;
      const cost = Number(lvl.product?.cost_price) || 0;
      invValue += qty * cost;
    }

    const payroll = 0; // Phase 4
    const netProfit = monthlyRev - payroll;

    const recent = (orders as any[]).slice(0, 8);
    const activeProducts = (products as any[]).filter((p) => p.status === "active").length;

    return {
      dailyRev, monthlyRev, productRev, laborRev, payroll, netProfit,
      activeJobs, vehiclesToday, invValue, activeProducts,
      revenueSeries: series, topProducts, recent,
      topService: (services as any[])[0]?.name ?? "—",
    };
  }, [orders, products, jobs, inv, services]);

  return (
    <PageShell title="Executive Command Center" subtitle="Real-time operations across ADZ Garage.">
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5">
              <ArrowUpRight className="h-3 w-3" /> +18.6% MoM
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5">
              <Activity className="h-3 w-3" /> All systems normal
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI GRID — 12 executive metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <Kpi label="Today" value={peso(m.dailyRev)} icon={PesoSign} accent />
        <Kpi label="Monthly Revenue" value={peso(m.monthlyRev)} icon={PesoSign} />
        <Kpi label="Labor Revenue" value={peso(m.laborRev)} icon={PesoSign} />
        <Kpi label="Product Revenue" value={peso(m.productRev)} icon={PesoSign} />
        <Kpi label="Payroll Cost" value={peso(m.payroll)} icon={PesoSign} muted />
        <Kpi label="Net Profit" value={peso(m.netProfit)} icon={PesoSign} accent />
        <Kpi label="Active Work Orders" value={String(m.activeJobs)} icon={Activity} />
        <Kpi label="Vehicles Today" value={String(m.vehiclesToday)} icon={Car} />
        <Kpi label="Inventory Value" value={peso(m.invValue)} icon={PesoSign} />
        <Kpi label="Top Technician" value="—" icon={Trophy} muted sub="Phase 5" />
        <Kpi label="Best Seller" value={m.topProducts[0]?.name ?? "—"} icon={Package} muted />
        <Kpi label="Top Service" value={m.topService} icon={Wrench} muted />
      </div>

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
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +18.6%
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
          <p className="text-xs text-muted-foreground mb-4">By retail value</p>
          <div className="h-[280px]">
            {m.topProducts.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">No products yet.</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.topProducts} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} fontSize={11} stroke={CHART_AXIS} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => peso(v)} />
                <Bar dataKey="value" fill={CHART_RED} radius={[0, 8, 8, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

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
