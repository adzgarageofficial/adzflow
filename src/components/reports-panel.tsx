import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  useOrders, useJobOrders, useInventoryLevels, useCustomers,
  useFinanceTxns, useEmployees, useAllOrderItems, useMyProfile, useCompanyExpenses, peso,
  useIsOwner, computeCost,
} from "@/lib/db";
import { useRbac } from "@/lib/rbac";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Line, LineChart, Cell, Pie, PieChart, Legend,
} from "recharts";
import { Download, FileSpreadsheet, TrendingUp, ShoppingCart, Boxes, Users, Wrench, Wallet, Printer, X, BarChart2, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, formatDistanceToNow, addMonths } from "date-fns";
import { downloadExcel } from "@/lib/export-excel";
import adzLogo from "@/assets/adz-logo.png";

function useLiveSales(active: boolean) {
  const qc = useQueryClient();
  const [lastEvent, setLastEvent] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!active) { setConnected(false); return; }
    const channel = supabase
      .channel("reports-sales-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        setLastEvent(new Date());
        qc.invalidateQueries({ queryKey: ["orders"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => {
        setLastEvent(new Date());
        qc.invalidateQueries({ queryKey: ["orders"] });
      })
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => { supabase.removeChannel(channel); setConnected(false); };
  }, [active, qc]);

  return { connected, lastEvent };
}

function LiveBadge({ connected, lastEvent }: { connected: boolean; lastEvent: Date | null }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="relative flex h-2 w-2">
        {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? "bg-emerald-500" : "bg-muted-foreground"}`} />
      </span>
      {connected ? "Live" : "Connecting…"}
      {lastEvent && <span className="text-emerald-600/70 font-normal">· updated {formatDistanceToNow(lastEvent, { addSuffix: true })}</span>}
    </span>
  );
}

export type ReportType = "sales" | "inventory" | "job_orders" | "customers" | "finance" | "payroll" | "pnl";
type PeriodKey = "today" | "week" | "month" | "year" | "7d" | "30d" | "90d";

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
  "7d": "Last 7d",
  "30d": "Last 30d",
  "90d": "Last 90d",
};

function getPeriodRange(key: PeriodKey): { from: Date; to: Date } {
  const now = new Date();
  switch (key) {
    case "today": return { from: startOfDay(now), to: endOfDay(now) };
    case "week": return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) };
    case "month": return { from: startOfMonth(now), to: endOfMonth(now) };
    case "year": return { from: startOfYear(now), to: endOfYear(now) };
    case "7d": return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    case "30d": return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
    case "90d": return { from: startOfDay(subDays(now, 89)), to: endOfDay(now) };
  }
}

const REPORT_META: Record<ReportType, { label: string; Icon: any; color: string }> = {
  sales:      { label: "Sales Report",       Icon: ShoppingCart, color: "text-emerald-500" },
  inventory:  { label: "Inventory Report",   Icon: Boxes,        color: "text-blue-500" },
  job_orders: { label: "Job Orders Report",  Icon: Wrench,       color: "text-amber-500" },
  customers:  { label: "Customers Report",   Icon: Users,        color: "text-violet-500" },
  finance:    { label: "Finance Report",     Icon: Wallet,       color: "text-teal-500" },
  payroll:    { label: "Payroll Summary",    Icon: TrendingUp,   color: "text-rose-500" },
  pnl:        { label: "P&L Statement",      Icon: BarChart2,    color: "text-indigo-500" },
};

const COLORS = ["oklch(0.62 0.24 27)", "oklch(0.7 0.18 145)", "oklch(0.68 0.18 240)", "oklch(0.72 0.18 60)", "oklch(0.65 0.2 300)"];

function PnlRow({
  label, value, indent, bold, large, negative, highlight, badge,
}: {
  label: string; value: number; indent?: boolean; bold?: boolean; large?: boolean;
  negative?: boolean; highlight?: "emerald" | "rose"; badge?: string;
}) {
  const colorCls = highlight === "emerald" ? "text-emerald-600" : highlight === "rose" ? "text-rose-600" : negative ? "text-rose-500" : "text-foreground";
  return (
    <div className={`flex items-center justify-between py-1 ${indent ? "pl-4" : ""} ${bold ? "font-semibold" : ""}`}>
      <span className={`${large ? "text-base" : "text-sm"} ${bold ? "" : "text-muted-foreground"}`}>{label}</span>
      <div className="flex items-center gap-2">
        {badge && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{badge}</span>}
        <span className={`${large ? "text-base" : "text-sm"} tabular-nums ${colorCls}`}>
          {negative ? `(${peso(value)})` : peso(value)}
        </span>
      </div>
    </div>
  );
}

export function ReportsPanel() {
  const [type, setType] = useState<ReportType>("sales");
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [selected, setSelected] = useState<{ type: ReportType; record: any } | null>(null);
  const [printOpen, setPrintOpen] = useState(false);

  const isOwner = useIsOwner();
  const { can } = useRbac();
  const canViewPrices = can("finance", "view");

  const live = useLiveSales(type === "sales");
  const { data: orders = [] } = useOrders();
  const { data: jobs = [] } = useJobOrders();
  const { data: inv = [] } = useInventoryLevels();
  const { data: customers = [] } = useCustomers();
  const { data: txns = [] } = useFinanceTxns();
  const { data: employees = [] } = useEmployees();
  const { data: allItems = [] } = useAllOrderItems();
  const { data: companyExpenses = [] } = useCompanyExpenses();

  const { from, to } = getPeriodRange(period);
  const inRange = (d: string | Date) => {
    if (!d) return false;
    try { return isWithinInterval(new Date(d), { start: from, end: to }); } catch { return false; }
  };

  const data = useMemo(() => {
    switch (type) {
      case "sales": {
        const rows = (orders as any[]).filter((o) => inRange(o.created_at) && o.status === "paid");
        const byDay = new Map<string, { d: string; revenue: number; orders: number }>();
        rows.forEach((o) => {
          const k = format(new Date(o.created_at), "MMM d");
          const cur = byDay.get(k) ?? { d: k, revenue: 0, orders: 0 };
          cur.revenue += Number(o.total ?? 0);
          cur.orders += 1;
          byDay.set(k, cur);
        });
        const chart = Array.from(byDay.values());
        const total = rows.reduce((s, o) => s + Number(o.total ?? 0), 0);
        return { rows, chart, total, count: rows.length };
      }
      case "inventory": {
        const rows = (inv as any[]).map((l) => ({
          ...l,
          value: Number(l.product?.cost_price ?? 0) * Number(l.quantity ?? 0),
          low: Number(l.quantity ?? 0) <= Number(l.reorder_point ?? 0),
        }));
        const total = rows.reduce((s, r) => s + r.value, 0);
        const low = rows.filter((r) => r.low).length;
        const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 8)
          .map((r) => ({ d: r.product?.name ?? "?", revenue: r.value }));
        const totalCost = (inv as any[]).reduce((s, l) => {
          const srp = Number(l.product?.retail_price || l.product?.base_price || 0);
          const dc: number[] = Array.isArray(l.product?.brand?.discount_chain) ? l.product.brand.discount_chain : [];
          const cost = dc.length > 0 ? computeCost(srp, dc) : Number(l.product?.cost_price || 0);
          return s + (l.quantity || 0) * cost;
        }, 0);
        const totalRetail = (inv as any[]).reduce((s, l) => s + (l.quantity || 0) * Number(l.product?.retail_price || l.product?.base_price || 0), 0);
        return { rows, chart: top, total, count: rows.length, low, totalCost, totalRetail };
      }
      case "job_orders": {
        const rows = (jobs as any[]).filter((j) => inRange(j.created_at));
        const byStatus = new Map<string, number>();
        rows.forEach((j) => byStatus.set(j.status, (byStatus.get(j.status) ?? 0) + 1));
        const chart = Array.from(byStatus.entries()).map(([d, revenue]) => ({ d, revenue }));
        const total = rows.reduce((s, r) => s + Number(r.total ?? 0), 0);
        return { rows, chart, total, count: rows.length };
      }
      case "customers": {
        const rows = customers as any[];
        const sorted = [...rows].sort((a, b) => Number(b.lifetime_value ?? 0) - Number(a.lifetime_value ?? 0)).slice(0, 10);
        const chart = sorted.map((c) => ({ d: c.full_name, revenue: Number(c.lifetime_value ?? 0) }));
        const total = rows.reduce((s, c) => s + Number(c.lifetime_value ?? 0), 0);
        return { rows, chart, total, count: rows.length };
      }
      case "finance": {
        const rows = (txns as any[]).filter((t) => inRange(t.txn_date));
        const inflow = rows.filter((r) => r.direction === "in").reduce((s, r) => s + Number(r.amount), 0);
        const outflow = rows.filter((r) => r.direction === "out").reduce((s, r) => s + Number(r.amount), 0);
        const byCat = new Map<string, number>();
        rows.forEach((r) => byCat.set(r.category, (byCat.get(r.category) ?? 0) + Number(r.amount)));
        const chart = Array.from(byCat.entries()).map(([d, revenue]) => ({ d, revenue }));
        return { rows, chart, total: inflow - outflow, count: rows.length, inflow, outflow };
      }
      case "payroll": {
        const rows = employees as any[];
        const total = rows.reduce((s, e) => s + Number(e.basic_salary ?? 0) + Number(e.allowance ?? 0), 0);
        const chart = [...rows].slice(0, 8).map((e) => ({
          d: `${e.first_name} ${e.last_name}`,
          revenue: Number(e.basic_salary ?? 0) + Number(e.allowance ?? 0),
        }));
        return { rows, chart, total, count: rows.length };
      }
      case "pnl": {
        // ── Revenue ──────────────────────────────────────
        const paidOrders = (orders as any[]).filter((o) => o.status === "paid" && inRange(o.created_at));
        const paidOrderIds = new Set(paidOrders.map((o: any) => o.id));
        const paidItems = (allItems as any[]).filter((it) => paidOrderIds.has(it.order?.id ?? ""));
        const productItems = paidItems.filter((it) => !it.is_service);
        const serviceItems = paidItems.filter((it) => it.is_service);
        const productRevenue = productItems.reduce((s, it) => s + Number(it.line_total ?? 0), 0);
        const serviceRevenue = serviceItems.reduce((s, it) => s + Number(it.line_total ?? 0), 0);
        const totalRevenue = productRevenue + serviceRevenue;

        // ── COGS ─────────────────────────────────────────
        const cogs = productItems.reduce((s, it) => s + Number(it.quantity ?? 0) * Number(it.product?.cost_price ?? 0), 0);
        const grossProfit = totalRevenue - cogs;
        const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

        // ── Operating Expenses ───────────────────────────
        const ceInPeriod = (companyExpenses as any[]).filter((e) => e.paid_at && inRange(e.paid_at));
        const txnOutflow = (txns as any[]).filter((t) => t.direction === "out" && inRange(t.txn_date));
        const expByCategory = new Map<string, number>();
        ceInPeriod.forEach((e) => expByCategory.set(e.category, (expByCategory.get(e.category) ?? 0) + Number(e.amount ?? 0)));
        txnOutflow.forEach((t) => {
          const k = t.category ?? "other";
          expByCategory.set(k, (expByCategory.get(k) ?? 0) + Number(t.amount ?? 0));
        });
        const totalOpEx = Array.from(expByCategory.values()).reduce((s, v) => s + v, 0);
        const netIncome = grossProfit - totalOpEx;
        const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

        // ── Monthly breakdown ─────────────────────────────
        const monthMap = new Map<string, { label: string; revenue: number; cogs: number; opex: number }>();
        let cur = startOfMonth(from);
        while (cur <= to) {
          const k = format(cur, "yyyy-MM");
          monthMap.set(k, { label: format(cur, "MMM yyyy"), revenue: 0, cogs: 0, opex: 0 });
          cur = addMonths(cur, 1);
        }
        paidOrders.forEach((o) => {
          const e = monthMap.get((o.created_at ?? "").slice(0, 7));
          if (e) e.revenue += Number(o.total ?? 0);
        });
        productItems.forEach((it) => {
          const e = monthMap.get((it.order?.created_at ?? "").slice(0, 7));
          if (e) e.cogs += Number(it.quantity ?? 0) * Number(it.product?.cost_price ?? 0);
        });
        ceInPeriod.forEach((x) => {
          const e = monthMap.get((x.paid_at ?? "").slice(0, 7));
          if (e) e.opex += Number(x.amount ?? 0);
        });
        txnOutflow.forEach((t) => {
          const e = monthMap.get((t.txn_date ?? "").slice(0, 7));
          if (e) e.opex += Number(t.amount ?? 0);
        });
        const monthlyRows = Array.from(monthMap.values()).map((m) => ({
          ...m, grossProfit: m.revenue - m.cogs, netIncome: m.revenue - m.cogs - m.opex,
        }));
        const chart = monthlyRows.map((m) => ({ d: m.label, revenue: m.revenue, costs: m.cogs + m.opex, net: m.netIncome }));

        return {
          rows: monthlyRows, chart, total: netIncome, count: paidOrders.length,
          totalRevenue, productRevenue, serviceRevenue,
          cogs, grossProfit, grossMargin,
          expByCategory, totalOpEx, netIncome, netMargin,
        };
      }
    }
  }, [type, orders, jobs, inv, customers, txns, employees, allItems, companyExpenses, period, from, to]);

  const exportExcel = () => {
    const ts = format(new Date(), "yyyyMMdd-HHmm");
    const periodLabel = PERIOD_LABELS[period];
    let rows: any[][] = [];
    let currency: number[] = [];
    switch (type) {
      case "sales":
        rows = [["Date", "Order #", "Customer", "Total (₱)", "Status"]];
        (data.rows as any[]).forEach((o) => rows.push([
          format(new Date(o.created_at), "yyyy-MM-dd HH:mm"),
          o.order_number, o.customer?.full_name ?? "Walk-in", Number(o.total ?? 0), o.status,
        ]));
        currency = [3];
        break;
      case "inventory":
        rows = [["Product", "SKU", "Warehouse", "Qty", "Cost (₱)", "Value (₱)", "Reorder Pt", "Low?"]];
        (data.rows as any[]).forEach((l) => rows.push([
          l.product?.name, l.product?.sku, l.warehouse?.name, Number(l.quantity ?? 0),
          Number(l.product?.cost_price ?? 0), Number(l.value ?? 0), Number(l.reorder_point ?? 0), l.low ? "YES" : "",
        ]));
        currency = [4, 5];
        break;
      case "job_orders":
        rows = [["Date", "Job #", "Customer", "Status", "Parts (₱)", "Labor (₱)", "Total (₱)"]];
        (data.rows as any[]).forEach((j) => rows.push([
          format(new Date(j.created_at), "yyyy-MM-dd"),
          j.job_number, j.customer?.full_name, j.status,
          Number(j.parts_cost ?? 0), Number(j.labor_cost ?? 0), Number(j.total ?? 0),
        ]));
        currency = [4, 5, 6];
        break;
      case "customers":
        rows = [["Name", "Email", "Phone", "Loyalty Pts", "Lifetime Value (₱)"]];
        (data.rows as any[]).forEach((c) => rows.push([
          c.full_name, c.email, c.phone, Number(c.loyalty_points ?? 0), Number(c.lifetime_value ?? 0),
        ]));
        currency = [4];
        break;
      case "finance":
        rows = [["Date", "Direction", "Category", "Method", "Amount (₱)", "Description"]];
        (data.rows as any[]).forEach((t) => rows.push([
          t.txn_date, t.direction, t.category, t.method ?? "", Number(t.amount ?? 0), t.description ?? "",
        ]));
        currency = [4];
        break;
      case "payroll":
        rows = [["Employee #", "Name", "Position", "Basic (₱)", "Allowance (₱)", "Gross (₱)"]];
        (data.rows as any[]).forEach((e) => rows.push([
          e.employee_number, `${e.first_name} ${e.last_name}`, e.position_id ?? "",
          Number(e.basic_salary ?? 0), Number(e.allowance ?? 0),
          Number(e.basic_salary ?? 0) + Number(e.allowance ?? 0),
        ]));
        currency = [3, 4, 5];
        break;
      case "pnl":
        rows = [
          ["ADZ Garage — Profit & Loss Statement", "", "", ""],
          ["Period", periodLabel, "", ""],
          ["", "", "", ""],
          ["REVENUE", "", "", ""],
          ["  Product Sales", "", "", Number(data.productRevenue ?? 0)],
          ["  Service Revenue", "", "", Number(data.serviceRevenue ?? 0)],
          ["  TOTAL REVENUE", "", "", Number(data.totalRevenue ?? 0)],
          ["", "", "", ""],
          ["COST OF GOODS SOLD", "", "", ""],
          ["  COGS (cost × qty)", "", "", Number(data.cogs ?? 0)],
          ["  GROSS PROFIT", "", `${(data.grossMargin ?? 0).toFixed(1)}%`, Number(data.grossProfit ?? 0)],
          ["", "", "", ""],
          ["OPERATING EXPENSES", "", "", ""],
          ...Array.from((data.expByCategory ?? new Map()) as Map<string, number>).map(([cat, amt]) => [`  ${cat}`, "", "", Number(amt)]),
          ["  TOTAL OPEX", "", "", Number(data.totalOpEx ?? 0)],
          ["", "", "", ""],
          ["NET INCOME", "", `${(data.netMargin ?? 0).toFixed(1)}%`, Number(data.netIncome ?? 0)],
          ["", "", "", ""],
          ["── Monthly Breakdown ──", "", "", ""],
          ["Month", "Revenue (₱)", "COGS (₱)", "Gross Profit (₱)", "OpEx (₱)", "Net Income (₱)", "Margin"],
          ...(data.rows as any[]).map((m: any) => [
            m.label, Number(m.revenue), Number(m.cogs),
            Number(m.grossProfit), Number(m.opex), Number(m.netIncome),
            `${m.revenue > 0 ? ((m.netIncome / m.revenue) * 100).toFixed(1) : 0}%`,
          ]),
        ];
        currency = [3];
        break;
    }
    downloadExcel(
      `ADZ-${type}-${periodLabel.replace(/\s+/g, "-")}-${ts}`,
      REPORT_META[type].label,
      rows,
      { headers: true, currency },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">Live exports across sales, inventory, jobs, finance &amp; HR.</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setPrintOpen(true)} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold flex items-center gap-1.5 hover:bg-secondary">
            <Printer className="h-3.5 w-3.5" /> Print Preview
          </button>
          <button onClick={exportExcel} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
        {(Object.entries(REPORT_META) as [ReportType, typeof REPORT_META.sales][]).map(([k, m]) => {
          const active = type === k;
          const Icon = m.Icon;
          return (
            <button
              key={k}
              onClick={() => setType(k)}
              className={`text-left rounded-xl border p-3 transition ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/30"}`}
            >
              <Icon className={`h-4 w-4 mb-2 ${m.color}`} />
              <div className="text-xs font-semibold">{m.label}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft p-5 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold tracking-tight text-base">{REPORT_META[type].label}</h3>
              {type === "sales" && <LiveBadge connected={live.connected} lastEvent={live.lastEvent} />}
            </div>
            <p className="text-xs text-muted-foreground">
              {type === "pnl"
                ? `${data.count} paid orders · Net Income ${peso(data.netIncome ?? 0)}`
                : `${data.count} records · ${type === "inventory" ? `valued ${peso(data.total)}` : `total ${peso(data.total)}`}`}
            </p>
          </div>
          {type !== "inventory" && type !== "customers" && type !== "payroll" && (
            <div className="flex items-center gap-1 flex-wrap">
              {(["today", "week", "month", "year", "7d", "30d", "90d"] as PeriodKey[]).map((k) => (
                <button key={k} onClick={() => setPeriod(k)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold ${period === k ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                  {PERIOD_LABELS[k]}
                </button>
              ))}
            </div>
          )}
        </div>

        {type === "inventory" && (isOwner || canViewPrices) && (
          <div className={`grid gap-3 mt-4 ${isOwner && canViewPrices ? "grid-cols-2" : "grid-cols-1"}`}>
            {isOwner && (
              <div className="rounded-xl bg-secondary/40 border border-border p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Inventory Value (Cost)</div>
                <div className="text-2xl font-bold mt-1">{peso((data as any).totalCost ?? 0)}</div>
              </div>
            )}
            {canViewPrices && (
              <div className="rounded-xl bg-secondary/40 border border-border p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Inventory Value (Retail)</div>
                <div className="text-2xl font-bold mt-1 text-emerald-600">{peso((data as any).totalRetail ?? 0)}</div>
              </div>
            )}
          </div>
        )}

        {type === "pnl" ? (
          /* ── Income Statement ───────────────────────────── */
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            {/* Left: P&L statement */}
            <div className="space-y-0 text-sm">
              {/* Revenue */}
              <div className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mt-2 mb-1">Revenue</div>
              <PnlRow label="Product Sales" value={data.productRevenue ?? 0} indent />
              <PnlRow label="Service Revenue" value={data.serviceRevenue ?? 0} indent />
              <PnlRow label="Total Revenue" value={data.totalRevenue ?? 0} bold />
              {/* COGS */}
              <div className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mt-4 mb-1">Cost of Goods Sold</div>
              <PnlRow label="Products at cost" value={data.cogs ?? 0} indent negative />
              <PnlRow label="Gross Profit" value={data.grossProfit ?? 0} bold highlight="emerald" badge={`${(data.grossMargin ?? 0).toFixed(1)}% margin`} />
              {/* OpEx */}
              <div className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mt-4 mb-1">Operating Expenses</div>
              {Array.from((data.expByCategory ?? new Map()) as Map<string, number>).map(([cat, amt]) => (
                <PnlRow key={cat} label={cat} value={amt} indent negative />
              ))}
              <PnlRow label="Total OpEx" value={data.totalOpEx ?? 0} bold negative />
              {/* Net */}
              <div className="mt-4 pt-3 border-t-2 border-border">
                <PnlRow
                  label="NET INCOME"
                  value={data.netIncome ?? 0}
                  bold
                  large
                  highlight={(data.netIncome ?? 0) >= 0 ? "emerald" : "rose"}
                  badge={`${(data.netMargin ?? 0).toFixed(1)}% margin`}
                />
              </div>
            </div>
            {/* Right: Monthly chart */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Monthly Overview</div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chart} barGap={2}>
                    <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
                    <XAxis dataKey="d" stroke="oklch(0.5 0.01 270)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.5 0.01 270)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(v: number) => peso(v)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4,4,0,0]} barSize={16} />
                    <Bar dataKey="costs" name="Costs" fill="#f43f5e" radius={[4,4,0,0]} barSize={16} />
                    <Bar dataKey="net" name="Net Income" fill="#6366f1" radius={[4,4,0,0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {type === "job_orders" || type === "finance" ? (
                <PieChart>
                  <Pie data={data.chart} dataKey="revenue" nameKey="d" outerRadius={100} label>
                    {(data.chart as any[]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : type === "sales" ? (
                <LineChart data={data.chart}>
                  <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
                  <XAxis dataKey="d" stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="oklch(0.62 0.24 27)" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <BarChart data={data.chart}>
                  <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
                  <XAxis dataKey="d" stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="oklch(0.62 0.24 27)" radius={[8, 8, 0, 0]} barSize={28} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{type === "pnl" ? "Monthly Breakdown" : "Preview"}</h3>
          {type !== "pnl" && <span className="text-xs text-muted-foreground">click a row to view details</span>}
          <span className="text-xs text-muted-foreground ml-auto">{Math.min(data.rows.length, 20)} of {data.rows.length}</span>
        </div>
        <div className="overflow-x-auto max-h-[420px]">
          <ReportTable type={type} rows={(data.rows as any[]).slice(0, 20)} onRowClick={(record) => setSelected({ type, record })} />
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          {selected && <RecordDetailCard type={selected.type} record={selected.record} />}
        </DialogContent>
      </Dialog>

      <PrintPreviewDialog
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        type={type}
        rows={data.rows as any[]}
        period={PERIOD_LABELS[period]}
        data={data}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Print Preview                                           */
/* ─────────────────────────────────────────────────────── */

function PrintPreviewDialog({
  open, onClose, type, rows, period, data,
}: {
  open: boolean; onClose: () => void;
  type: ReportType; rows: any[]; period: string; data: any;
}) {
  const { data: profile } = useMyProfile();
  const { data: allItems = [] } = useAllOrderItems();
  const printRef = useRef<HTMLDivElement>(null);

  const preparedBy = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || profile.email
    : "—";

  const today = format(new Date(), "MM-dd-yy");
  const reportTitle = {
    sales: "Daily Sales Report",
    inventory: "Inventory Report",
    job_orders: "Job Orders Report",
    customers: "Customer Report",
    finance: "Finance Report",
    payroll: "Payroll Report",
    pnl: "Profit & Loss Statement",
  }[type];

  // For sales: map order items → filtered by the paid order IDs in scope
  const orderIds = useMemo(() => new Set((rows as any[]).map((o) => o.id)), [rows]);
  const saleItems = useMemo(() =>
    type === "sales"
      ? (allItems as any[]).filter((i) => orderIds.has(i.order?.id ?? ""))
      : [],
    [allItems, orderIds, type],
  );

  const totalUnits = saleItems.reduce((s, i) => s + Number(i.quantity ?? 1), 0);
  const totalRevenue = (rows as any[]).reduce((s, o) => s + Number(o.total ?? 0), 0);
  const topCategory = useMemo(() => {
    const map = new Map<string, number>();
    saleItems.forEach((i) => {
      const cat = i.product?.category?.name ?? "Other";
      map.set(cat, (map.get(cat) ?? 0) + Number(i.quantity ?? 1));
    });
    let top = "—"; let max = 0;
    map.forEach((v, k) => { if (v > max) { max = v; top = k; } });
    return top;
  }, [saleItems]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${reportTitle}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; padding: 20mm; }
  .print-header { background: #1a56db; color: white; padding: 14px 18px; display: flex; align-items: center; gap: 14px; border-radius: 4px 4px 0 0; }
  .print-header img { height: 44px; width: auto; background: white; border-radius: 6px; padding: 3px; }
  .print-header h1 { font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
  .biz-section { display: flex; justify-content: space-between; border: 1px solid #d1d5db; border-top: none; padding: 12px 18px; background: #f9fafb; }
  .biz-col { display: flex; flex-direction: column; gap: 4px; }
  .biz-col label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
  .biz-col span { font-size: 12px; font-weight: 600; }
  .summary-header { font-size: 11px; font-weight: 700; color: #1a56db; text-align: center; margin-bottom: 4px; border-bottom: 1px solid #1a56db; padding-bottom: 2px; }
  .data-section { margin-top: 16px; }
  .data-section h2 { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  thead tr { background: #1a56db; color: white; }
  thead th { padding: 7px 10px; text-align: left; font-weight: 600; }
  thead th:last-child { text-align: right; }
  tbody tr:nth-child(even) { background: #eff6ff; }
  tbody tr:nth-child(odd) { background: #ffffff; }
  tbody td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
  tbody td:last-child { text-align: right; font-weight: 600; }
  .total-row { text-align: right; margin-top: 10px; font-size: 12px; }
  .total-row strong { font-size: 13px; }
  .print-footer { margin-top: 28px; border-top: 1px dashed #9ca3af; padding-top: 10px; display: flex; gap: 40px; }
  .footer-col { flex: 1; }
  .footer-col label { font-size: 10px; color: #6b7280; }
  .footer-col .val { font-weight: 600; font-size: 11px; border-bottom: 1px solid #374151; min-width: 120px; display: inline-block; padding-bottom: 2px; }
  .sig-line { margin-top: 28px; }
  .sig-line label { font-size: 10px; color: #6b7280; }
  .sig-line .val { border-bottom: 1px solid #374151; min-width: 180px; display: inline-block; height: 24px; }
  @media print { body { padding: 10mm; } }
</style></head><body>${content}</body></html>`);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
        {/* Preview toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <span className="font-semibold text-sm text-gray-700">Print Preview — {reportTitle}</span>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="h-9 px-4 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700">
              <Printer className="h-3.5 w-3.5" />Print
            </button>
            <button onClick={onClose} className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* A4-ish preview */}
        <div className="p-8 bg-gray-100">
          <div ref={printRef} className="bg-white shadow-md mx-auto" style={{ maxWidth: 740, fontFamily: "Arial, sans-serif", fontSize: 12, color: "#1a1a1a" }}>

            {/* Header */}
            <div style={{ background: "#1a56db", color: "white", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, borderRadius: "4px 4px 0 0" }} className="print-header">
              <img src={adzLogo} alt="ADZ" style={{ height: 44, background: "white", borderRadius: 6, padding: 3 }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>{reportTitle}</h1>
            </div>

            {/* Business Info + Report Summary */}
            <div style={{ display: "flex", justifyContent: "space-between", border: "1px solid #d1d5db", borderTop: "none", padding: "12px 18px", background: "#f9fafb" }}>
              {/* Left: Business Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Report Date: </span><strong>{today}</strong></div>
                <div><span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Store/Branch: </span><strong>ADZ Garage</strong></div>
                <div><span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Period: </span><strong>{period}</strong></div>
                <div><span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Prepared By: </span><strong>{preparedBy}</strong></div>
              </div>
              {/* Right: Report Summary */}
              <div style={{ minWidth: 220, border: "1px solid #d1d5db", borderRadius: 4, padding: "8px 12px", background: "white" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1a56db", textAlign: "center", borderBottom: "1px solid #1a56db", marginBottom: 6, paddingBottom: 2 }}>Report Summary</div>
                {type === "sales" ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Total Units Sold:</span><strong>{totalUnits}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Total Orders:</span><strong>{rows.length}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Top Category:</span><strong>{topCategory}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280", fontSize: 10 }}>Total Sales:</span><strong style={{ color: "#1a56db" }}>{peso(totalRevenue)}</strong></div>
                  </>
                ) : type === "pnl" ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Revenue:</span><strong style={{ color: "#059669" }}>{peso(data.totalRevenue ?? 0)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Gross Profit:</span><strong style={{ color: "#059669" }}>{peso(data.grossProfit ?? 0)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Total OpEx:</span><strong style={{ color: "#dc2626" }}>{peso(data.totalOpEx ?? 0)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280", fontSize: 10 }}>Net Income:</span><strong style={{ color: (data.netIncome ?? 0) >= 0 ? "#059669" : "#dc2626" }}>{peso(data.netIncome ?? 0)}</strong></div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#6b7280", fontSize: 10 }}>Total Records:</span><strong>{rows.length}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280", fontSize: 10 }}>Total:</span><strong style={{ color: "#1a56db" }}>{peso(data.total ?? 0)}</strong></div>
                  </>
                )}
              </div>
            </div>

            {/* Data Section */}
            <div style={{ padding: "16px 18px" }}>
              {type === "pnl" ? (
                /* ── P&L Print View ────────────────────────────── */
                <>
                  {/* Income Statement */}
                  <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Income Statement</h2>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 20 }}>
                    <tbody>
                      {/* Revenue section */}
                      <tr><td colSpan={3} style={{ padding: "6px 10px", background: "#1a56db", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Revenue</td></tr>
                      <tr style={{ background: "#f9fafb" }}>
                        <td style={{ padding: "5px 10px 5px 24px" }}>Product Sales</td>
                        <td></td>
                        <td style={{ padding: "5px 10px", textAlign: "right" }}>{peso(Number(data.productRevenue ?? 0))}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "5px 10px 5px 24px" }}>Service Revenue</td>
                        <td></td>
                        <td style={{ padding: "5px 10px", textAlign: "right" }}>{peso(Number(data.serviceRevenue ?? 0))}</td>
                      </tr>
                      <tr style={{ background: "#eff6ff", fontWeight: 700 }}>
                        <td style={{ padding: "6px 10px" }}>TOTAL REVENUE</td>
                        <td></td>
                        <td style={{ padding: "6px 10px", textAlign: "right", color: "#1a56db" }}>{peso(Number(data.totalRevenue ?? 0))}</td>
                      </tr>
                      {/* COGS */}
                      <tr><td colSpan={3} style={{ padding: "6px 10px", background: "#f43f5e22", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#dc2626" }}>Cost of Goods Sold</td></tr>
                      <tr style={{ background: "#f9fafb" }}>
                        <td style={{ padding: "5px 10px 5px 24px" }}>Products at cost (COGS)</td>
                        <td></td>
                        <td style={{ padding: "5px 10px", textAlign: "right", color: "#dc2626" }}>({peso(Number(data.cogs ?? 0))})</td>
                      </tr>
                      <tr style={{ background: "#ecfdf5", fontWeight: 700 }}>
                        <td style={{ padding: "6px 10px" }}>GROSS PROFIT</td>
                        <td style={{ padding: "6px 10px", textAlign: "right", fontSize: 10, color: "#6b7280" }}>{(data.grossMargin ?? 0).toFixed(1)}% margin</td>
                        <td style={{ padding: "6px 10px", textAlign: "right", color: "#059669" }}>{peso(Number(data.grossProfit ?? 0))}</td>
                      </tr>
                      {/* OpEx */}
                      <tr><td colSpan={3} style={{ padding: "6px 10px", background: "#fef3c722", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#b45309" }}>Operating Expenses</td></tr>
                      {Array.from((data.expByCategory ?? new Map()) as Map<string, number>).map(([cat, amt]) => (
                        <tr key={cat} style={{ background: "#f9fafb" }}>
                          <td style={{ padding: "5px 10px 5px 24px" }}>{cat}</td>
                          <td></td>
                          <td style={{ padding: "5px 10px", textAlign: "right", color: "#dc2626" }}>({peso(Number(amt))})</td>
                        </tr>
                      ))}
                      <tr style={{ background: "#fff7ed", fontWeight: 700 }}>
                        <td style={{ padding: "6px 10px" }}>TOTAL OPEX</td>
                        <td></td>
                        <td style={{ padding: "6px 10px", textAlign: "right", color: "#dc2626" }}>({peso(Number(data.totalOpEx ?? 0))})</td>
                      </tr>
                      {/* Net Income */}
                      <tr style={{ background: (data.netIncome ?? 0) >= 0 ? "#d1fae5" : "#fee2e2", fontWeight: 700, fontSize: 13, borderTop: "2px solid #374151" }}>
                        <td style={{ padding: "8px 10px" }}>NET INCOME</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 10, color: "#6b7280" }}>{(data.netMargin ?? 0).toFixed(1)}% margin</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: (data.netIncome ?? 0) >= 0 ? "#059669" : "#dc2626" }}>{peso(Number(data.netIncome ?? 0))}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Monthly Breakdown */}
                  <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Monthly Breakdown</h2>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                    <thead>
                      <tr style={{ background: "#1a56db", color: "white" }}>
                        {["Month", "Revenue", "COGS", "Gross Profit", "OpEx", "Net Income", "Margin"].map((h) => (
                          <th key={h} style={{ padding: "6px 8px", textAlign: h === "Month" ? "left" : "right", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(rows as any[]).map((m: any, i: number) => (
                        <tr key={m.label} style={{ background: i % 2 === 0 ? "#fff" : "#eff6ff" }}>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb" }}>{m.label}</td>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{peso(Number(m.revenue))}</td>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", textAlign: "right", color: "#dc2626" }}>{peso(Number(m.cogs))}</td>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", textAlign: "right", color: "#059669" }}>{peso(Number(m.grossProfit))}</td>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", textAlign: "right", color: "#dc2626" }}>{peso(Number(m.opex))}</td>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600, color: m.netIncome >= 0 ? "#059669" : "#dc2626" }}>{peso(Number(m.netIncome))}</td>
                          <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{m.revenue > 0 ? ((m.netIncome / m.revenue) * 100).toFixed(1) : 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
              <>
              <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Sales Data</h2>
              {type === "sales" ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#1a56db", color: "white" }}>
                      {["Item No.", "Product Name", "Category", "Units Sold", "Unit Price", "Total Sales"].map((h) => (
                        <th key={h} style={{ padding: "7px 10px", textAlign: h === "Units Sold" || h === "Unit Price" || h === "Total Sales" ? "right" : "left", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {saleItems.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: "center", padding: 16, color: "#6b7280" }}>No items found.</td></tr>
                    ) : saleItems.map((item, i) => (
                      <tr key={item.id} style={{ background: i % 2 === 0 ? "#fff" : "#eff6ff" }}>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{i + 1}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{item.product?.name ?? "—"}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{item.product?.category?.name ?? "—"}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{item.quantity}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{peso(Number(item.unit_price ?? 0))}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>{peso(Number(item.line_total ?? (item.unit_price ?? 0) * (item.quantity ?? 1)))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Generic table for non-sales reports */
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#1a56db", color: "white" }}>
                      {type === "inventory" && ["#", "Product", "SKU", "Warehouse", "Qty", "Value"].map((h) => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
                      {type === "job_orders" && ["#", "Job #", "Customer", "Status", "Total"].map((h) => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
                      {type === "finance" && ["#", "Date", "Category", "Direction", "Amount"].map((h) => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
                      {type === "customers" && ["#", "Name", "Contact", "Loyalty Pts", "Lifetime Value"].map((h) => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
                      {type === "payroll" && ["#", "Employee #", "Name", "Basic", "Allowance", "Gross"].map((h) => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {(rows as any[]).map((r, i) => (
                      <tr key={r.id ?? i} style={{ background: i % 2 === 0 ? "#fff" : "#eff6ff" }}>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{i + 1}</td>
                        {type === "inventory" && <>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.product?.name}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.product?.sku}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.warehouse?.name}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{r.quantity}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>{peso(r.value)}</td>
                        </>}
                        {type === "job_orders" && <>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.job_number}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.customer?.full_name}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.status}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>{peso(Number(r.total ?? 0))}</td>
                        </>}
                        {type === "finance" && <>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.txn_date}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.category}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", color: r.direction === "in" ? "#059669" : "#dc2626" }}>{r.direction}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>{peso(Number(r.amount))}</td>
                        </>}
                        {type === "customers" && <>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.full_name}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.email ?? r.phone ?? "—"}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{r.loyalty_points}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>{peso(Number(r.lifetime_value ?? 0))}</td>
                        </>}
                        {type === "payroll" && <>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.employee_number}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb" }}>{r.first_name} {r.last_name}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{peso(Number(r.basic_salary ?? 0))}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>{peso(Number(r.allowance ?? 0))}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>{peso(Number(r.basic_salary ?? 0) + Number(r.allowance ?? 0))}</td>
                        </>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Total row */}
              <div style={{ textAlign: "right", marginTop: 10, fontSize: 12 }}>
                Total Sales Amount (₱): <strong style={{ fontSize: 13 }}>{peso(type === "sales" ? totalRevenue : (data.total ?? 0))}</strong>
              </div>
              </>
              )}

              {/* Footer */}
              <div style={{ marginTop: 28, borderTop: "1px dashed #9ca3af", paddingTop: 10, display: "flex", gap: 40 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>Report Date:</div>
                  <div style={{ fontWeight: 600, fontSize: 11, borderBottom: "1px solid #374151", minWidth: 120, paddingBottom: 2 }}>{today}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>Store/Branch:</div>
                  <div style={{ fontWeight: 600, fontSize: 11, borderBottom: "1px solid #374151", minWidth: 120, paddingBottom: 2 }}>ADZ Garage</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>Prepared By:</div>
                  <div style={{ fontWeight: 600, fontSize: 11, borderBottom: "1px solid #374151", minWidth: 120, paddingBottom: 2 }}>{preparedBy}</div>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 10, color: "#6b7280" }}>Signature:</div>
                <div style={{ borderBottom: "1px solid #374151", minWidth: 220, height: 28, display: "inline-block" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportTable({ type, rows, onRowClick }: { type: ReportType; rows: any[]; onRowClick: (record: any) => void }) {
  if (rows.length === 0) {
    return <div className="p-8 text-center text-muted-foreground text-sm">No data.</div>;
  }
  const rowCls = "border-t border-border cursor-pointer transition hover:bg-muted/30";
  if (type === "sales")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Date</th><th className="text-left px-5 py-2">Order #</th>
          <th className="text-left px-5 py-2">Customer</th><th className="text-right px-5 py-2">Total</th>
          <th className="text-left px-5 py-2">Status</th>
        </tr></thead>
        <tbody>{rows.map((o) => (
          <tr key={o.id} className={rowCls} onClick={() => onRowClick(o)}>
            <td className="px-5 py-2 text-xs">{format(new Date(o.created_at), "MMM d HH:mm")}</td>
            <td className="px-5 py-2 font-medium">{o.order_number}</td>
            <td className="px-5 py-2">{o.customer?.full_name ?? "Walk-in"}</td>
            <td className="px-5 py-2 text-right font-semibold">{peso(Number(o.total ?? 0))}</td>
            <td className="px-5 py-2"><span className="text-xs">{o.status}</span></td>
          </tr>
        ))}</tbody>
      </table>
    );
  if (type === "inventory")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Product</th><th className="text-left px-5 py-2">Warehouse</th>
          <th className="text-right px-5 py-2">Qty</th><th className="text-right px-5 py-2">Value</th>
          <th className="text-left px-5 py-2">Status</th>
        </tr></thead>
        <tbody>{rows.map((l) => (
          <tr key={l.id} className={rowCls} onClick={() => onRowClick(l)}>
            <td className="px-5 py-2"><div className="font-medium">{l.product?.name}</div><div className="text-xs text-muted-foreground">{l.product?.sku}</div></td>
            <td className="px-5 py-2">{l.warehouse?.name}</td>
            <td className="px-5 py-2 text-right">{l.quantity}</td>
            <td className="px-5 py-2 text-right font-semibold">{peso(l.value)}</td>
            <td className="px-5 py-2">{l.low ? <span className="text-xs text-rose-500 font-semibold">LOW</span> : <span className="text-xs text-emerald-500">OK</span>}</td>
          </tr>
        ))}</tbody>
      </table>
    );
  if (type === "job_orders")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Job #</th><th className="text-left px-5 py-2">Customer</th>
          <th className="text-left px-5 py-2">Status</th><th className="text-right px-5 py-2">Total</th>
        </tr></thead>
        <tbody>{rows.map((j) => (
          <tr key={j.id} className={rowCls} onClick={() => onRowClick(j)}>
            <td className="px-5 py-2 font-medium">{j.job_number}</td>
            <td className="px-5 py-2">{j.customer?.full_name}</td>
            <td className="px-5 py-2 text-xs">{j.status}</td>
            <td className="px-5 py-2 text-right font-semibold">{peso(Number(j.total ?? 0))}</td>
          </tr>
        ))}</tbody>
      </table>
    );
  if (type === "customers")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Name</th><th className="text-left px-5 py-2">Contact</th>
          <th className="text-right px-5 py-2">Loyalty</th><th className="text-right px-5 py-2">LTV</th>
        </tr></thead>
        <tbody>{rows.map((c) => (
          <tr key={c.id} className={rowCls} onClick={() => onRowClick(c)}>
            <td className="px-5 py-2 font-medium">{c.full_name}</td>
            <td className="px-5 py-2 text-xs text-muted-foreground">{c.email ?? c.phone ?? "—"}</td>
            <td className="px-5 py-2 text-right">{c.loyalty_points}</td>
            <td className="px-5 py-2 text-right font-semibold">{peso(Number(c.lifetime_value ?? 0))}</td>
          </tr>
        ))}</tbody>
      </table>
    );
  if (type === "finance")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Date</th><th className="text-left px-5 py-2">Category</th>
          <th className="text-left px-5 py-2">Method</th><th className="text-left px-5 py-2">Direction</th>
          <th className="text-right px-5 py-2">Amount</th>
        </tr></thead>
        <tbody>{rows.map((t) => (
          <tr key={t.id} className={rowCls} onClick={() => onRowClick(t)}>
            <td className="px-5 py-2 text-xs">{t.txn_date}</td>
            <td className="px-5 py-2">{t.category}</td>
            <td className="px-5 py-2 text-xs">{t.method ?? "—"}</td>
            <td className="px-5 py-2"><span className={`text-xs font-semibold ${t.direction === "in" ? "text-emerald-500" : "text-rose-500"}`}>{t.direction}</span></td>
            <td className="px-5 py-2 text-right font-semibold">{peso(Number(t.amount))}</td>
          </tr>
        ))}</tbody>
      </table>
    );
  if (type === "pnl")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Month</th>
          <th className="text-right px-5 py-2">Revenue</th>
          <th className="text-right px-5 py-2">COGS</th>
          <th className="text-right px-5 py-2">Gross Profit</th>
          <th className="text-right px-5 py-2">OpEx</th>
          <th className="text-right px-5 py-2">Net Income</th>
          <th className="text-right px-5 py-2">Margin</th>
        </tr></thead>
        <tbody>{rows.map((m: any) => (
          <tr key={m.label} className={rowCls} onClick={() => onRowClick(m)}>
            <td className="px-5 py-2 font-medium">{m.label}</td>
            <td className="px-5 py-2 text-right">{peso(Number(m.revenue))}</td>
            <td className="px-5 py-2 text-right text-rose-500">{peso(Number(m.cogs))}</td>
            <td className="px-5 py-2 text-right text-emerald-600">{peso(Number(m.grossProfit))}</td>
            <td className="px-5 py-2 text-right text-rose-500">{peso(Number(m.opex))}</td>
            <td className={`px-5 py-2 text-right font-semibold ${m.netIncome >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{peso(Number(m.netIncome))}</td>
            <td className="px-5 py-2 text-right text-muted-foreground">{m.revenue > 0 ? ((m.netIncome / m.revenue) * 100).toFixed(1) : 0}%</td>
          </tr>
        ))}</tbody>
      </table>
    );
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
        <th className="text-left px-5 py-2">Employee #</th><th className="text-left px-5 py-2">Name</th>
        <th className="text-right px-5 py-2">Basic</th><th className="text-right px-5 py-2">Allowance</th>
        <th className="text-right px-5 py-2">Gross</th>
      </tr></thead>
      <tbody>{rows.map((e) => (
        <tr key={e.id} className={rowCls} onClick={() => onRowClick(e)}>
          <td className="px-5 py-2 text-xs">{e.employee_number}</td>
          <td className="px-5 py-2 font-medium">{e.first_name} {e.last_name}</td>
          <td className="px-5 py-2 text-right">{peso(Number(e.basic_salary ?? 0))}</td>
          <td className="px-5 py-2 text-right">{peso(Number(e.allowance ?? 0))}</td>
          <td className="px-5 py-2 text-right font-semibold">{peso(Number(e.basic_salary ?? 0) + Number(e.allowance ?? 0))}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm border-b border-border/60 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function fmtDate(d: string | null | undefined, withTime = true) {
  if (!d) return "—";
  try { return format(new Date(d), withTime ? "MMM d, yyyy · HH:mm" : "MMM d, yyyy"); } catch { return d; }
}

function RecordDetailCard({ type, record: r }: { type: ReportType; record: any }) {
  const meta = REPORT_META[type];
  const Icon = meta.Icon;

  let title = "";
  let subtitle = "";
  let badge: { label: string; cls: string } | null = null;
  let body: React.ReactNode = null;

  switch (type) {
    case "sales": {
      title = r.order_number;
      subtitle = `Order · ${fmtDate(r.created_at)}`;
      badge = { label: r.status, cls: "bg-blue-100 text-blue-700" };
      body = (
        <>
          <DetailRow label="Customer" value={r.customer?.full_name ?? "Walk-in"} />
          <DetailRow label="Channel" value={r.channel} />
          <DetailRow label="Subtotal" value={peso(Number(r.subtotal ?? 0))} />
          <DetailRow label="Discount" value={peso(Number(r.discount ?? 0))} />
          <DetailRow label="Amount Paid" value={peso(Number(r.amount_paid ?? 0))} />
          <DetailRow label="Total" value={<span className="text-base font-bold text-primary">{peso(Number(r.total ?? 0))}</span>} />
          {r.notes && <DetailRow label="Notes" value={r.notes} />}
        </>
      );
      break;
    }
    case "inventory": {
      title = r.product?.name ?? "Product";
      subtitle = `SKU ${r.product?.sku ?? "—"} · ${r.warehouse?.name ?? "—"}`;
      badge = r.low
        ? { label: "Low stock", cls: "bg-rose-100 text-rose-700" }
        : { label: "In stock", cls: "bg-emerald-100 text-emerald-700" };
      body = (
        <>
          <DetailRow label="Quantity on hand" value={r.quantity} />
          <DetailRow label="Reserved" value={r.reserved_quantity ?? 0} />
          <DetailRow label="Reorder point" value={r.reorder_point} />
          <DetailRow label="Cost price" value={peso(Number(r.product?.cost_price ?? 0))} />
          <DetailRow label="Retail price" value={peso(Number(r.product?.retail_price ?? r.product?.base_price ?? 0))} />
          <DetailRow label="Stock value" value={<span className="text-base font-bold text-primary">{peso(Number(r.value ?? 0))}</span>} />
        </>
      );
      break;
    }
    case "job_orders": {
      title = r.job_number;
      subtitle = `Job Order · ${fmtDate(r.created_at)}`;
      badge = { label: r.status, cls: "bg-amber-100 text-amber-700" };
      body = (
        <>
          <DetailRow label="Customer" value={r.customer?.full_name ?? "—"} />
          <DetailRow label="Vehicle" value={r.vehicle ? `${r.vehicle.make ?? ""} ${r.vehicle.model ?? ""} · ${r.vehicle.plate_number ?? "—"}`.trim() : "—"} />
          {r.description && <DetailRow label="Description" value={r.description} />}
          <DetailRow label="Scheduled" value={fmtDate(r.scheduled_at)} />
          <DetailRow label="Started" value={fmtDate(r.started_at)} />
          <DetailRow label="Completed" value={fmtDate(r.completed_at)} />
          <DetailRow label="Parts cost" value={peso(Number(r.parts_cost ?? 0))} />
          <DetailRow label="Labor cost" value={peso(Number(r.labor_cost ?? 0))} />
          <DetailRow label="Total" value={<span className="text-base font-bold text-primary">{peso(Number(r.total ?? 0))}</span>} />
        </>
      );
      break;
    }
    case "customers": {
      title = r.full_name;
      subtitle = r.email ?? r.phone ?? "Customer";
      body = (
        <>
          <DetailRow label="Email" value={r.email ?? "—"} />
          <DetailRow label="Phone" value={r.phone ?? "—"} />
          <DetailRow label="Address" value={r.address ?? "—"} />
          <DetailRow label="Loyalty points" value={r.loyalty_points} />
          <DetailRow label="Lifetime value" value={<span className="text-base font-bold text-primary">{peso(Number(r.lifetime_value ?? 0))}</span>} />
          <DetailRow label="Customer since" value={fmtDate(r.created_at, false)} />
          {r.tags?.length > 0 && <DetailRow label="Tags" value={r.tags.join(", ")} />}
          {r.notes && <DetailRow label="Notes" value={r.notes} />}
        </>
      );
      break;
    }
    case "finance": {
      title = r.category;
      subtitle = `Transaction · ${fmtDate(r.txn_date, false)}`;
      badge = r.direction === "in"
        ? { label: "Cash in", cls: "bg-emerald-100 text-emerald-700" }
        : { label: "Cash out", cls: "bg-rose-100 text-rose-700" };
      body = (
        <>
          <DetailRow label="Amount" value={<span className="text-base font-bold text-primary">{peso(Number(r.amount ?? 0))}</span>} />
          <DetailRow label="Method" value={r.method ?? "—"} />
          <DetailRow label="Reference" value={r.reference_type ? `${r.reference_type} · ${r.reference_id ?? "—"}` : "—"} />
          {r.description && <DetailRow label="Description" value={r.description} />}
        </>
      );
      break;
    }
    case "payroll": {
      title = `${r.first_name} ${r.last_name}`;
      subtitle = `#${r.employee_number} · ${r.employment_type ?? "Employee"}`;
      body = (
        <>
          <DetailRow label="Position" value={r.position?.title ?? "—"} />
          <DetailRow label="Department" value={r.department?.name ?? "—"} />
          <DetailRow label="Branch" value={r.branch?.name ?? "—"} />
          <DetailRow label="Date hired" value={fmtDate(r.date_hired, false)} />
          <DetailRow label="Basic salary" value={peso(Number(r.basic_salary ?? 0))} />
          <DetailRow label="Allowance" value={peso(Number(r.allowance ?? 0))} />
          <DetailRow label="Daily rate" value={peso(Number(r.daily_rate ?? 0))} />
          <DetailRow label="Gross pay" value={<span className="text-base font-bold text-primary">{peso(Number(r.basic_salary ?? 0) + Number(r.allowance ?? 0))}</span>} />
        </>
      );
      break;
    }
  }

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <div className="px-6 pt-6 pb-4 border-b border-border bg-muted/20">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={`h-11 w-11 rounded-xl grid place-items-center bg-primary/10 ${meta.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg">{title}</DialogTitle>
                {badge && <Badge variant="secondary" className={`font-medium ${badge.cls}`}>{badge.label}</Badge>}
              </div>
              <DialogDescription className="mt-0.5">{subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
      </div>
      <div className="px-6 py-4">{body}</div>
    </div>
  );
}
