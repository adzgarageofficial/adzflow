import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useMemo, useState } from "react";
import {
  useOrders, useJobOrders, useInventoryLevels, useCustomers,
  useFinanceTxns, useEmployees, peso,
} from "@/lib/db";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Line, LineChart, Cell, Pie, PieChart, Legend,
} from "recharts";
import { Download, FileSpreadsheet, TrendingUp, ShoppingCart, Boxes, Users, Wrench, Wallet } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";

export const Route = createFileRoute("/_app/reports")({ component: Reports });

type ReportType = "sales" | "inventory" | "job_orders" | "customers" | "finance" | "payroll";

const REPORT_META: Record<ReportType, { label: string; Icon: any; color: string }> = {
  sales: { label: "Sales Report", Icon: ShoppingCart, color: "text-emerald-500" },
  inventory: { label: "Inventory Report", Icon: Boxes, color: "text-blue-500" },
  job_orders: { label: "Job Orders Report", Icon: Wrench, color: "text-amber-500" },
  customers: { label: "Customers Report", Icon: Users, color: "text-violet-500" },
  finance: { label: "Finance Report", Icon: Wallet, color: "text-teal-500" },
  payroll: { label: "Payroll Summary", Icon: TrendingUp, color: "text-rose-500" },
};

const COLORS = ["oklch(0.62 0.24 27)", "oklch(0.7 0.18 145)", "oklch(0.68 0.18 240)", "oklch(0.72 0.18 60)", "oklch(0.65 0.2 300)"];

function downloadCsv(filename: string, rows: any[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Reports() {
  const [type, setType] = useState<ReportType>("sales");
  const [days, setDays] = useState(30);

  const { data: orders = [] } = useOrders();
  const { data: jobs = [] } = useJobOrders();
  const { data: inv = [] } = useInventoryLevels();
  const { data: customers = [] } = useCustomers();
  const { data: txns = [] } = useFinanceTxns();
  const { data: employees = [] } = useEmployees();

  const from = startOfDay(subDays(new Date(), days));
  const to = endOfDay(new Date());
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
  }, [type, orders, jobs, inv, customers, txns, employees, days]);

  const exportCsv = () => {
    const ts = format(new Date(), "yyyyMMdd-HHmm");
    let rows: any[][] = [];
    switch (type) {
      case "sales":
        rows = [["Date", "Order #", "Customer", "Total", "Status"]];
        (data.rows as any[]).forEach((o) => rows.push([
          format(new Date(o.created_at), "yyyy-MM-dd HH:mm"),
          o.order_number, o.customer?.full_name ?? "Walk-in", o.total, o.status,
        ]));
        break;
      case "inventory":
        rows = [["Product", "SKU", "Warehouse", "Qty", "Cost", "Value", "Reorder Pt", "Low?"]];
        (data.rows as any[]).forEach((l) => rows.push([
          l.product?.name, l.product?.sku, l.warehouse?.name, l.quantity,
          l.product?.cost_price, l.value, l.reorder_point, l.low ? "YES" : "",
        ]));
        break;
      case "job_orders":
        rows = [["Date", "Job #", "Customer", "Status", "Parts", "Labor", "Total"]];
        (data.rows as any[]).forEach((j) => rows.push([
          format(new Date(j.created_at), "yyyy-MM-dd"),
          j.job_number, j.customer?.full_name, j.status, j.parts_cost, j.labor_cost, j.total,
        ]));
        break;
      case "customers":
        rows = [["Name", "Email", "Phone", "Loyalty Pts", "Lifetime Value"]];
        (data.rows as any[]).forEach((c) => rows.push([
          c.full_name, c.email, c.phone, c.loyalty_points, c.lifetime_value,
        ]));
        break;
      case "finance":
        rows = [["Date", "Direction", "Category", "Method", "Amount", "Description"]];
        (data.rows as any[]).forEach((t) => rows.push([
          t.txn_date, t.direction, t.category, t.method, t.amount, t.description,
        ]));
        break;
      case "payroll":
        rows = [["Employee #", "Name", "Position", "Basic", "Allowance", "Total"]];
        (data.rows as any[]).forEach((e) => rows.push([
          e.employee_number, `${e.first_name} ${e.last_name}`, e.position_id ?? "",
          e.basic_salary, e.allowance, Number(e.basic_salary ?? 0) + Number(e.allowance ?? 0),
        ]));
        break;
    }
    downloadCsv(`${type}-report-${ts}.csv`, rows);
  };

  return (
    <PageShell
      title="Reports"
      subtitle="Live exports across sales, inventory, jobs, finance & HR."
      actions={
        <button onClick={exportCsv} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export CSV
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
            <h3 className="font-semibold tracking-tight text-base">{REPORT_META[type].label}</h3>
            <p className="text-xs text-muted-foreground">{data.count} records · {type === "inventory" ? `valued ${peso(data.total)}` : `total ${peso(data.total)}`}</p>
          </div>
          {type !== "inventory" && type !== "customers" && type !== "payroll" && (
            <div className="flex items-center gap-1">
              {[7, 30, 90, 365].map((n) => (
                <button
                  key={n}
                  onClick={() => setDays(n)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold ${days === n ? "bg-primary text-primary-foreground" : "border border-border"}`}
                >
                  {n}d
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
          <span className="text-xs text-muted-foreground ml-auto">{Math.min(data.rows.length, 20)} of {data.rows.length}</span>
        </div>
        <div className="overflow-x-auto max-h-[420px]">
          <ReportTable type={type} rows={(data.rows as any[]).slice(0, 20)} />
        </div>
      </div>
    </PageShell>
  );
}

function ReportTable({ type, rows }: { type: ReportType; rows: any[] }) {
  if (rows.length === 0) {
    return <div className="p-8 text-center text-muted-foreground text-sm">No data.</div>;
  }
  if (type === "sales")
    return (
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs text-muted-foreground"><tr>
          <th className="text-left px-5 py-2">Date</th><th className="text-left px-5 py-2">Order #</th>
          <th className="text-left px-5 py-2">Customer</th><th className="text-right px-5 py-2">Total</th>
          <th className="text-left px-5 py-2">Status</th>
        </tr></thead>
        <tbody>{rows.map((o) => (
          <tr key={o.id} className="border-t border-border">
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
          <tr key={l.id} className="border-t border-border">
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
          <tr key={j.id} className="border-t border-border">
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
          <tr key={c.id} className="border-t border-border">
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
          <tr key={t.id} className="border-t border-border">
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
        <tr key={e.id} className="border-t border-border">
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
