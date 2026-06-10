import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  useOrders, useJobOrders, useInventoryLevels, useCustomers,
  useFinanceTxns, useEmployees, peso,
} from "@/lib/db";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Line, LineChart, Cell, Pie, PieChart, Legend,
} from "recharts";
import { Download, FileSpreadsheet, TrendingUp, ShoppingCart, Boxes, Users, Wrench, Wallet } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, formatDistanceToNow } from "date-fns";
import { downloadExcel } from "@/lib/export-excel";

/* ---------- Live-updating Sales Report: subscribe to order changes in real time ---------- */
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

export const Route = createFileRoute("/_app/reports")({ component: Reports });

type ReportType = "sales" | "inventory" | "job_orders" | "customers" | "finance" | "payroll";
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
  sales: { label: "Sales Report", Icon: ShoppingCart, color: "text-emerald-500" },
  inventory: { label: "Inventory Report", Icon: Boxes, color: "text-blue-500" },
  job_orders: { label: "Job Orders Report", Icon: Wrench, color: "text-amber-500" },
  customers: { label: "Customers Report", Icon: Users, color: "text-violet-500" },
  finance: { label: "Finance Report", Icon: Wallet, color: "text-teal-500" },
  payroll: { label: "Payroll Summary", Icon: TrendingUp, color: "text-rose-500" },
};

const COLORS = ["oklch(0.62 0.24 27)", "oklch(0.7 0.18 145)", "oklch(0.68 0.18 240)", "oklch(0.72 0.18 60)", "oklch(0.65 0.2 300)"];


function Reports() {
  const [type, setType] = useState<ReportType>("sales");
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [selected, setSelected] = useState<{ type: ReportType; record: any } | null>(null);

  const live = useLiveSales(type === "sales");
  const { data: orders = [] } = useOrders();
  const { data: jobs = [] } = useJobOrders();
  const { data: inv = [] } = useInventoryLevels();
  const { data: customers = [] } = useCustomers();
  const { data: txns = [] } = useFinanceTxns();
  const { data: employees = [] } = useEmployees();

  const { from, to } = getPeriodRange(period);
  const inRange = (d: string | Date) => {
    if (!d) return false;
    try { return isWithinInterval(new Date(d), { start: from, end: to }); } catch { return false; }
  };

  const data = useMemo(() => {
    switch (type) {
      case "sales": {
        const rows = (orders as any[]).filter((o) => inRange(o.created_at));
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
        return { rows, chart: top, total, count: rows.length, low };
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
    }
  }, [type, orders, jobs, inv, customers, txns, employees, period, from, to]);

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
    }
    downloadExcel(
      `ADZ-${type}-${periodLabel.replace(/\s+/g, "-")}-${ts}`,
      REPORT_META[type].label,
      rows,
      { headers: true, currency },
    );
  };

  return (
    <PageShell
      title="Reports"
      subtitle="Live exports across sales, inventory, jobs, finance & HR."
      actions={
        <button onClick={exportExcel} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export Excel
        </button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
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
            <p className="text-xs text-muted-foreground">{data.count} records · {type === "inventory" ? `valued ${peso(data.total)}` : `total ${peso(data.total)}`}</p>
          </div>
          {type !== "inventory" && type !== "customers" && type !== "payroll" && (
            <div className="flex items-center gap-1 flex-wrap">
              {(["today", "week", "month", "year", "7d", "30d", "90d"] as PeriodKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setPeriod(k)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold ${period === k ? "bg-primary text-primary-foreground" : "border border-border"}`}
                >
                  {PERIOD_LABELS[k]}
                </button>
              ))}
            </div>
          )}
        </div>
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
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Preview</h3>
          <span className="text-xs text-muted-foreground">click a row to view details</span>
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
    </PageShell>
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

/* ------------------------------------------------------------------ */
/* Record detail card — shown in a dialog when a Preview row is clicked */
/* ------------------------------------------------------------------ */

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
