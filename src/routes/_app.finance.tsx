import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { AmountInput } from "@/components/ui/amount-input";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowDownRight, ArrowUpRight, Wallet, Receipt, Plus, Trash2, Edit2,
  Search, Download, FileBarChart, CheckCircle2, CalendarClock,
  Zap, Droplets, Wifi, Building2, Users2, Package, Wrench, Fuel, Megaphone,
  FileText, CircleEllipsis, ChevronDown,
} from "lucide-react";
import { ReportsPanel } from "@/components/reports-panel";
import { downloadExcel } from "@/lib/export-excel";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinanceTxns, useCompanyExpenses, useBranches, useInsert, useUpdate, useDelete, useNotifications, peso, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/finance")({ component: Finance });

const DIRECTIONS = ["in", "out"] as const;
const DIRECTION_LABELS: Record<string, string> = { in: "Inflow", out: "Outflow" };
const METHODS = ["cash", "gcash", "maya", "card", "bank_transfer", "other"] as const;

const EXPENSE_CATEGORIES: { key: string; label: string; Icon: any; color: string; bg: string }[] = [
  { key: "electricity",    label: "Electricity",      Icon: Zap,             color: "text-amber-600",  bg: "bg-amber-50" },
  { key: "water",          label: "Water",             Icon: Droplets,        color: "text-sky-600",    bg: "bg-sky-50" },
  { key: "internet",       label: "Internet / Phone",  Icon: Wifi,            color: "text-blue-600",   bg: "bg-blue-50" },
  { key: "rent",           label: "Rent / Lease",      Icon: Building2,       color: "text-violet-600", bg: "bg-violet-50" },
  { key: "salaries",       label: "Salaries",          Icon: Users2,          color: "text-emerald-600",bg: "bg-emerald-50" },
  { key: "parts_supplies", label: "Parts & Supplies",  Icon: Package,         color: "text-orange-600", bg: "bg-orange-50" },
  { key: "maintenance",    label: "Maintenance",       Icon: Wrench,          color: "text-rose-600",   bg: "bg-rose-50" },
  { key: "fuel",           label: "Fuel / Transport",  Icon: Fuel,            color: "text-yellow-600", bg: "bg-yellow-50" },
  { key: "marketing",      label: "Marketing / Ads",   Icon: Megaphone,       color: "text-pink-600",   bg: "bg-pink-50" },
  { key: "taxes_fees",     label: "Taxes & Gov Fees",  Icon: FileText,        color: "text-slate-600",  bg: "bg-slate-50" },
  { key: "other",          label: "Other",             Icon: CircleEllipsis,  color: "text-muted-foreground", bg: "bg-secondary" },
];

const EXPENSE_CAT_MAP = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.key, c]));

const EXP_TONE_CLASS: Record<string, string> = {
  overdue: "bg-rose-50 text-rose-700 border-rose-200",
  soon:    "bg-amber-50 text-amber-700 border-amber-200",
  ok:      "bg-secondary text-muted-foreground border-border",
  paid:    "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const EXP_TONE_LABEL: Record<string, string> = {
  overdue: "Overdue", soon: "Due in ≤5 days", ok: "Upcoming", paid: "Paid",
};

function expDueTone(e: any): "overdue" | "soon" | "ok" | "paid" {
  if (e.paid_at) return "paid";
  const due = new Date(`${e.due_date}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return "overdue";
  if (days <= 5) return "soon";
  return "ok";
}

function useExpenseReminderNotifications(expenses: any[]) {
  const canCreate = useIsOwner();
  const { data: notifs = [] } = useNotifications();
  const insert = useInsert<any>("notifications");
  const alerted = useRef(new Set<string>());

  useEffect(() => {
    if (!canCreate || expenses.length === 0) return;
    const openLinks = new Set(
      (notifs as any[]).filter((n) => !n.read_at && n.category === "finance").map((n) => n.link),
    );
    for (const e of expenses as any[]) {
      if (e.paid_at) continue;
      const tone = expDueTone(e);
      if (tone === "ok") continue;
      const cat = EXPENSE_CAT_MAP[e.category];
      const link = `/finance?expense=${e.id}`;
      if (alerted.current.has(link) || openLinks.has(link)) continue;
      alerted.current.add(link);
      insert.mutate({
        title: tone === "overdue"
          ? `Overdue expense: ${cat?.label ?? e.category}`
          : `Expense due soon: ${cat?.label ?? e.category}`,
        body: tone === "overdue"
          ? `${cat?.label ?? e.category} (${peso(Number(e.amount))}) was due on ${e.due_date}.`
          : `${cat?.label ?? e.category} (${peso(Number(e.amount))}) is due on ${e.due_date} — within 5 days.`,
        severity: tone === "overdue" ? "error" : "warning",
        category: "finance",
        link,
        audience_role: "finance",
      });
    }
  }, [expenses, notifs, canCreate]);
}



function Finance() {
  const [tab, setTab] = useState<"finance" | "reports">("finance");
  const { data: txns = [] } = useFinanceTxns();
  const { data: branches = [] } = useBranches();
  const ins = useInsert("finance_transactions");
  const canEdit = useIsOwner();
  const upd = useUpdate("finance_transactions");
  const del = useDelete("finance_transactions");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);


  // Company expenses
  const { data: companyExpenses = [] } = useCompanyExpenses();
  const insExp = useInsert("company_expenses", ["company_expenses", "finance_transactions"]);
  const updExp = useUpdate("company_expenses");
  const delExp = useDelete("company_expenses");
  const [ceOpen, setCeOpen] = useState(false);
  const [editingCe, setEditingCe] = useState<any | null>(null);
  const [ceFilter, setCeFilter] = useState<string>("all");
  const [ceDefaultCat, setCeDefaultCat] = useState<string>("electricity");
  useExpenseReminderNotifications(companyExpenses as any[]);

  const { inflow, outflow, series } = useMemo(() => {
    let inflow = 0, outflow = 0;
    const map = new Map<string, { d: string; inflow: number; outflow: number }>();
    for (const t of txns) {
      const amt = Number(t.amount) || 0;
      if ((t as any).direction === "in") inflow += amt; else outflow += amt;
      const d = (t as any).txn_date;
      const row = map.get(d) ?? { d, inflow: 0, outflow: 0 };
      if ((t as any).direction === "in") row.inflow += amt; else row.outflow += amt;
      map.set(d, row);
    }
    const series = Array.from(map.values()).sort((a, b) => a.d.localeCompare(b.d)).slice(-30);
    return { inflow, outflow, series };
  }, [txns]);


  const net = inflow - outflow;
  const stats = [
    { label: "Total Inflow",  value: peso(inflow),   icon: ArrowUpRight,   tone: "text-emerald-600" },
    { label: "Total Outflow", value: peso(outflow),   icon: ArrowDownRight, tone: "text-destructive" },
    { label: "Net Cash",      value: peso(net),       icon: Wallet,         tone: net >= 0 ? "text-foreground" : "text-destructive" },
    { label: "Transactions",  value: txns.length,     icon: Receipt,        tone: "text-foreground" },
  ];

  const filtered = (txns as any[]).filter((t) =>
    !q || [t.description, t.reference_type, t.category].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      txn_date: fd.get("txn_date"),
      direction: fd.get("direction"),
      category: (fd.get("category") as string) || "other",
      amount: Number(fd.get("amount")),
      method: (fd.get("method") as string) || null,
      description: (fd.get("description") as string) || null,
      branch_id: (fd.get("branch_id") as string) || null,
    };
    try {
      if (editing) await upd.mutateAsync({ id: editing.id, patch: payload });
      else await ins.mutateAsync(payload);
      toast.success(editing ? "Transaction updated" : "Transaction recorded");
      setOpen(false); setEditing(null);
    } catch { /* handled */ }
  };


  const submitCompanyExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      category:   (fd.get("category") as string) || "other",
      amount:     Number(fd.get("amount")),
      entry_date: fd.get("entry_date"),
      due_date:   fd.get("due_date"),
      notes:      (fd.get("notes") as string) || null,
      branch_id:  (fd.get("branch_id") as string) || null,
    };
    try {
      if (editingCe) await updExp.mutateAsync({ id: editingCe.id, patch: payload });
      else await insExp.mutateAsync(payload);
      toast.success(editingCe ? "Expense updated" : "Company expense added");
      setCeOpen(false); setEditingCe(null);
    } catch { /* handled */ }
  };

  const markCompanyExpensePaid = async (ce: any) => {
    try {
      await ins.mutateAsync({
        txn_date: new Date().toISOString().slice(0, 10),
        direction: "out",
        category: ce.category,
        amount: Number(ce.amount),
        description: `${EXPENSE_CAT_MAP[ce.category]?.label ?? ce.category} — company expense`,
        branch_id: ce.branch_id ?? null,
      });
      await updExp.mutateAsync({ id: ce.id, patch: { paid_at: new Date().toISOString() } });
      toast.success("Marked as paid — recorded as outflow transaction");
    } catch { /* handled */ }
  };

  return (
    <PageShell title="Finance & Reports" subtitle="Cash flow, expenses, and business reports.">
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setTab("finance")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === "finance" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <Wallet className="h-4 w-4" />Finance
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === "reports" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <FileBarChart className="h-4 w-4" />Reports
        </button>
      </div>

      {tab === "reports" && <ReportsPanel />}

      {tab === "finance" && <>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border shadow-soft p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.tone}`} />
              </div>
              <div className={`mt-2 text-2xl font-bold tracking-tight ${s.tone}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Cash Flow chart ── */}
        <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
          <h3 className="font-semibold tracking-tight">Cash Flow</h3>
          <div className="h-[260px] mt-4">
            {series.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">No transactions yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="in" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.7 0.17 150)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.7 0.17 150)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="out" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.62 0.24 27)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.62 0.24 27)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
                  <XAxis dataKey="d" stroke="oklch(0.5 0.01 270)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.01 270)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.005 270)", borderRadius: 12 }} formatter={(v: number) => peso(v)} />
                  <Area type="monotone" dataKey="inflow" stroke="oklch(0.7 0.17 150)" strokeWidth={2} fill="url(#in)" />
                  <Area type="monotone" dataKey="outflow" stroke="oklch(0.62 0.24 27)" strokeWidth={2} fill="url(#out)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>



        {/* ── Company Expenses ── */}
        <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold tracking-tight flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />Company Expenses
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Log upcoming bills with a due date — reminder fires 5 days before. Mark paid to record as outflow.</p>
            </div>
            <button disabled={!canEdit} onClick={() => { setCeDefaultCat("electricity"); setEditingCe(null); setCeOpen(true); }} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft disabled:opacity-50">
              <Plus className="h-3.5 w-3.5" />Add Expense
            </button>
          </div>

          {/* Category filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCeFilter("all")}
              className={`h-7 px-3 rounded-full text-xs font-medium border transition-colors ${ceFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
            >All</button>
            {EXPENSE_CATEGORIES.filter((c) => (companyExpenses as any[]).some((e) => e.category === c.key)).map((c) => (
              <button
                key={c.key}
                onClick={() => setCeFilter(c.key)}
                className={`h-7 px-3 rounded-full text-xs font-medium border transition-colors ${ceFilter === c.key ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
              >{c.label}</button>
            ))}
          </div>

          {(() => {
            const visible = (companyExpenses as any[]).filter((e) => ceFilter === "all" || e.category === ceFilter);
            if (visible.length === 0) return (
              <div className="text-sm text-muted-foreground text-center py-8">No company expenses logged yet.</div>
            );
            return (
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visible.map((ce) => {
                  const tone = expDueTone(ce);
                  const cat = EXPENSE_CAT_MAP[ce.category];
                  const Icon = cat?.Icon ?? CircleEllipsis;
                  return (
                    <div key={ce.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`shrink-0 p-1.5 rounded-lg ${cat?.bg ?? "bg-secondary"}`}>
                            <Icon className={`h-3.5 w-3.5 ${cat?.color ?? "text-muted-foreground"}`} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{cat?.label ?? ce.category}</div>
                            <div className="text-[11px] text-muted-foreground">Entered {ce.entry_date}</div>
                          </div>
                        </div>
                        <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${EXP_TONE_CLASS[tone]}`}>
                          {EXP_TONE_LABEL[tone]}
                        </span>
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-2">
                        <div>
                          <div className="text-lg font-bold">{peso(Number(ce.amount))}</div>
                          <div className="text-[11px] text-muted-foreground">Due {ce.due_date}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {!ce.paid_at && (
                            <button disabled={!canEdit} onClick={() => markCompanyExpensePaid(ce)} className="h-8 px-2.5 rounded-lg bg-emerald-500 text-white text-[11px] font-semibold inline-flex items-center gap-1 disabled:opacity-50">
                              <CheckCircle2 className="h-3.5 w-3.5" />Mark Paid
                            </button>
                          )}
                          {!ce.paid_at && <button disabled={!canEdit} onClick={() => { setEditingCe(ce); setCeOpen(true); }} className="p-1.5 rounded-lg hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>}
                          <button disabled={!canEdit} onClick={() => { if (confirm("Delete this expense?")) delExp.mutate(ce.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      {ce.notes && <div className="mt-2 text-[11px] text-muted-foreground truncate">{ce.notes}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* ── All Transactions ledger ── */}
        <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative w-60">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const rows: any[][] = [
                  ["Date", "Type", "Category", "Method", "Amount (₱)", "Description"],
                  ...filtered.map((t: any) => [
                    t.txn_date,
                    t.direction === "in" ? "Inflow" : "Outflow",
                    EXPENSE_CAT_MAP[t.category]?.label ?? t.category ?? "",
                    t.method ?? "",
                    Number(t.amount ?? 0),
                    t.description ?? "",
                  ]),
                ];
                downloadExcel(
                  `ADZ-Finance-${format(new Date(), "yyyyMMdd-HHmm")}`,
                  "Finance Transactions",
                  rows,
                  { headers: true, currency: [4] },
                );
              }}
              className="h-10 px-4 rounded-xl border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary"
            >
              <Download className="h-4 w-4" />Export Excel
            </button>
            <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
              <Plus className="h-4 w-4" />New Transaction
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
              <tr>
                <th className="text-left font-medium px-6 py-3">Date</th>
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="text-left font-medium px-6 py-3">Category</th>
                <th className="text-left font-medium px-6 py-3">Description</th>
                <th className="text-right font-medium px-6 py-3">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No transactions yet.</td></tr>
              ) : filtered.map((t: any) => {
                const cat = EXPENSE_CAT_MAP[t.category];
                const Icon = cat?.Icon ?? CircleEllipsis;
                return (
                  <tr key={t.id} onClick={() => { setEditing(t); setOpen(true); }} className="border-t border-border hover:bg-secondary/40 cursor-pointer">
                    <td className="px-6 py-3">{t.txn_date}</td>
                    <td className="px-6 py-3">
                      <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " + (t.direction === "in" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                        {DIRECTION_LABELS[t.direction] ?? t.direction}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {t.category ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cat?.bg ?? "bg-secondary"} ${cat?.color ?? "text-muted-foreground"}`}>
                          <Icon className="h-3 w-3" />{cat?.label ?? t.category}
                        </span>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground text-xs">{t.description}</td>
                    <td className={"px-6 py-3 text-right font-semibold " + (t.direction === "in" ? "text-emerald-700" : "text-rose-700")}>
                      {t.direction === "in" ? "+" : "−"}{peso(Number(t.amount))}
                    </td>
                    <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex gap-2">
                        <button disabled={!canEdit} onClick={() => { setEditing(t); setOpen(true); }} className="p-1.5 rounded-lg hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button disabled={!canEdit} onClick={() => { if (confirm("Delete transaction?")) del.mutate(t.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>


        {/* ── General Transaction dialog ── */}
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Transaction</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-medium">
                  Date
                  <input name="txn_date" type="date" required defaultValue={editing?.txn_date ?? new Date().toISOString().slice(0, 10)} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" />
                </label>
                <label className="text-xs font-medium">
                  Direction
                  <select name="direction" required defaultValue={editing?.direction ?? "in"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                    {DIRECTIONS.map((d) => <option key={d} value={d}>{DIRECTION_LABELS[d]}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium col-span-2">
                  Category
                  <select name="category" defaultValue={editing?.category ?? "other"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                    {EXPENSE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium">
                  Amount
                  <AmountInput name="amount" required defaultValue={editing?.amount ?? null} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" />
                </label>
                <label className="text-xs font-medium">
                  Method
                  <select name="method" defaultValue={editing?.method ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                    <option value="">—</option>
                    {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium">
                  Branch
                  <select name="branch_id" defaultValue={editing?.branch_id ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                    <option value="">—</option>
                    {(branches as any[]).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </label>
              </div>
              <label className="text-xs font-medium block">
                Description
                <textarea name="description" rows={2} defaultValue={editing?.description ?? ""} className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-card text-sm" />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
                <button type="submit" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editing ? "Save" : "Add"}</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── Company Expense dialog ── */}
        <Dialog open={ceOpen} onOpenChange={(o) => { setCeOpen(o); if (!o) setEditingCe(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingCe ? "Edit" : "Add"} Company Expense</DialogTitle></DialogHeader>
            <form onSubmit={submitCompanyExpense} className="space-y-3">
              <label className="text-xs font-medium block">
                Category
                <select name="category" required defaultValue={editingCe?.category ?? ceDefaultCat} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                  {EXPENSE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium block">
                Amount
                <AmountInput name="amount" required defaultValue={editingCe?.amount ?? null} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-medium">
                  Date Entered
                  <input name="entry_date" type="date" required defaultValue={editingCe?.entry_date ?? new Date().toISOString().slice(0, 10)} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" />
                </label>
                <label className="text-xs font-medium">
                  Due Date
                  <input name="due_date" type="date" required defaultValue={editingCe?.due_date ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" />
                </label>
              </div>
              <label className="text-xs font-medium block">
                Branch
                <select name="branch_id" defaultValue={editingCe?.branch_id ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                  <option value="">—</option>
                  {(branches as any[]).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium block">
                Notes
                <textarea name="notes" rows={2} defaultValue={editingCe?.notes ?? ""} className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-card text-sm" />
              </label>
              <p className="text-[11px] text-muted-foreground">A reminder notification fires 5 days before the due date. "Mark Paid" records this as an outflow transaction.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCeOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
                <button type="submit" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editingCe ? "Save" : "Add"}</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </>}
    </PageShell>
  );
}
