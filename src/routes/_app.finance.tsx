import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { AmountInput } from "@/components/ui/amount-input";
import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Wallet, Receipt, Plus, Trash2, Edit2, Search, Repeat, CheckCircle2, Download } from "lucide-react";
import { downloadExcel } from "@/lib/export-excel";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinanceTxns, useRecurringBills, useBranches, useInsert, useUpdate, useDelete, useNotifications, peso, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/finance")({ component: Finance });

const DIRECTIONS = ["in", "out"] as const;
const DIRECTION_LABELS: Record<string, string> = { in: "Inflow", out: "Outflow" };
const METHODS = ["cash", "gcash", "maya", "card", "bank_transfer", "other"] as const;
const BILL_FREQUENCIES = ["weekly", "monthly", "quarterly", "annually"] as const;
const BILL_TONE_CLASS: Record<string, string> = {
  overdue: "bg-rose-50 text-rose-700 border-rose-200",
  soon: "bg-amber-50 text-amber-700 border-amber-200",
  ok: "bg-secondary text-muted-foreground border-border",
};
const BILL_TONE_LABEL: Record<string, string> = { overdue: "Overdue", soon: "Due soon", ok: "Upcoming" };

function billDueTone(nextDueISO: string): "overdue" | "soon" | "ok" {
  const due = new Date(`${nextDueISO}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return "overdue";
  if (days <= 7) return "soon";
  return "ok";
}

// Roll the due date forward by one cycle once a bill is marked as paid.
function advanceDueDate(dateISO: string, frequency: string): string {
  const d = new Date(`${dateISO}T00:00:00`);
  switch (frequency) {
    case "weekly": d.setDate(d.getDate() + 7); break;
    case "quarterly": d.setMonth(d.getMonth() + 3); break;
    case "annually": d.setFullYear(d.getFullYear() + 1); break;
    default: d.setMonth(d.getMonth() + 1); break;
  }
  return d.toISOString().slice(0, 10);
}

// Reminders for the owner/finance team — nudges for bills that are due soon or
// already overdue. Mirrors useStockAlertNotifications' dedupe pattern, reusing
// the existing "finance" notification_category.
function useBillReminderNotifications(bills: any[]) {
  const canCreate = useIsOwner();
  const { data: notifs = [] } = useNotifications();
  const insert = useInsert<any>("notifications");
  const alerted = useRef(new Set<string>());

  useEffect(() => {
    if (!canCreate || bills.length === 0) return;
    const openLinks = new Set(
      (notifs as any[]).filter((n) => !n.read_at && n.category === "finance").map((n) => n.link),
    );
    for (const b of bills as any[]) {
      if (!b.is_active) continue;
      const tone = billDueTone(b.next_due_date);
      if (tone === "ok") continue;

      const link = `/finance?bill=${b.id}`;
      if (alerted.current.has(link) || openLinks.has(link)) continue;
      alerted.current.add(link);

      const amt = peso(Number(b.amount));
      insert.mutate({
        title: tone === "overdue" ? `Overdue bill: ${b.name}` : `Bill due soon: ${b.name}`,
        body: tone === "overdue"
          ? `${b.name} (${amt}) was due on ${b.next_due_date} and hasn't been marked as paid.`
          : `${b.name} (${amt}) is due on ${b.next_due_date}. Settle it on time to avoid late fees.`,
        severity: tone === "overdue" ? "error" : "warning",
        category: "finance",
        link,
        audience_role: "finance",
      });
    }
  }, [bills, notifs, canCreate]);
}

function Finance() {
  const { data: txns = [] } = useFinanceTxns();
  const { data: branches = [] } = useBranches();
  const ins = useInsert("finance_transactions");
  const canEdit = useIsOwner();
  const upd = useUpdate("finance_transactions");
  const del = useDelete("finance_transactions");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data: bills = [] } = useRecurringBills();
  const insBill = useInsert("recurring_bills");
  const updBill = useUpdate("recurring_bills");
  const delBill = useDelete("recurring_bills");
  const [billOpen, setBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<any | null>(null);
  useBillReminderNotifications(bills);

  const { inflow, outflow, series } = useMemo(() => {
    let inflow = 0, outflow = 0;
    const map = new Map<string, { d: string; inflow: number; outflow: number }>();
    for (const t of txns) {
      const amt = Number(t.amount) || 0;
      if (t.direction === "in") inflow += amt; else outflow += amt;
      const d = t.txn_date;
      const row = map.get(d) ?? { d, inflow: 0, outflow: 0 };
      if (t.direction === "in") row.inflow += amt; else row.outflow += amt;
      map.set(d, row);
    }
    const series = Array.from(map.values()).sort((a, b) => a.d.localeCompare(b.d)).slice(-30);
    return { inflow, outflow, series };
  }, [txns]);

  const net = inflow - outflow;
  const stats = [
    { label: "Total Inflow", value: peso(inflow), icon: ArrowUpRight, tone: "text-emerald-600" },
    { label: "Total Outflow", value: peso(outflow), icon: ArrowDownRight, tone: "text-destructive" },
    { label: "Net Cash", value: peso(net), icon: Wallet, tone: "text-foreground" },
    { label: "Transactions", value: txns.length, icon: Receipt, tone: "text-foreground" },
  ];

  const filtered = txns.filter((t: any) =>
    !q || [t.description, t.reference_type].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      txn_date: fd.get("txn_date"),
      direction: fd.get("direction"),
      category: editing?.category ?? "other",
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

  const submitBill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      name: fd.get("name"),
      category: (fd.get("category") as string) || "utilities",
      amount: Number(fd.get("amount")),
      frequency: fd.get("frequency"),
      next_due_date: fd.get("next_due_date"),
      method: (fd.get("method") as string) || null,
      branch_id: (fd.get("branch_id") as string) || null,
      notes: (fd.get("notes") as string) || null,
    };
    try {
      if (editingBill) await updBill.mutateAsync({ id: editingBill.id, patch: payload });
      else await insBill.mutateAsync(payload);
      toast.success(editingBill ? "Bill updated" : "Recurring bill added");
      setBillOpen(false); setEditingBill(null);
    } catch { /* handled */ }
  };

  const markBillPaid = async (bill: any) => {
    try {
      await ins.mutateAsync({
        txn_date: new Date().toISOString().slice(0, 10),
        direction: "out",
        category: bill.category,
        amount: Number(bill.amount),
        method: bill.method ?? null,
        description: `${bill.name} — recurring bill payment`,
        branch_id: bill.branch_id ?? null,
      });
      const nextDue = advanceDueDate(bill.next_due_date, bill.frequency);
      await updBill.mutateAsync({ id: bill.id, patch: { next_due_date: nextDue } });
      toast.success(`${bill.name} marked as paid · next due ${nextDue}`);
    } catch { /* handled */ }
  };

  return (
    <PageShell title="Finance" subtitle="Cash flow, invoices, and financial health at a glance.">
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

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <h3 className="font-semibold tracking-tight">Cash Flow</h3>
        <div className="h-[300px] mt-4">
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

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold tracking-tight flex items-center gap-2">
              <Repeat className="h-4 w-4 text-muted-foreground" />Recurring Bills
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Electricity, wifi, rent, and other periodic costs — register once, get reminded when due.</p>
          </div>
          <button disabled={!canEdit} onClick={() => { setEditingBill(null); setBillOpen(true); }} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
            <Plus className="h-3.5 w-3.5" />Add Bill
          </button>
        </div>
        {bills.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">No recurring bills tracked yet.</div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bills.map((b: any) => {
              const tone = billDueTone(b.next_due_date);
              return (
                <div key={b.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{b.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{b.category} · {b.frequency}</div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${BILL_TONE_CLASS[tone]}`}>
                      {BILL_TONE_LABEL[tone]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-lg font-bold">{peso(Number(b.amount))}</div>
                      <div className="text-[11px] text-muted-foreground">Due {b.next_due_date}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button disabled={!canEdit} onClick={() => markBillPaid(b)} title="Record payment & roll due date forward" className="h-8 px-2.5 rounded-lg bg-emerald-500 text-white text-[11px] font-semibold inline-flex items-center gap-1 disabled:opacity-50">
                        <CheckCircle2 className="h-3.5 w-3.5" />Mark Paid
                      </button>
                      <button disabled={!canEdit} onClick={() => { setEditingBill(b); setBillOpen(true); }} className="p-1.5 rounded-lg hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button disabled={!canEdit} onClick={() => { if (confirm(`Delete "${b.name}"?`)) delBill.mutate(b.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const rows: any[][] = [
                ["Date", "Type", "Category", "Method", "Amount (₱)", "Description"],
                ...filtered.map((t: any) => [
                  t.txn_date,
                  t.direction === "in" ? "Inflow" : "Outflow",
                  t.category ?? "",
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
            <tr><th className="text-left font-medium px-6 py-3">Date</th><th className="text-left font-medium px-6 py-3">Type</th><th className="text-left font-medium px-6 py-3">Description</th><th className="text-right font-medium px-6 py-3">Amount</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No transactions yet.</td></tr>
            ) : filtered.map((t: any) => (
              <tr key={t.id} onClick={() => { setEditing(t); setOpen(true); }} className="border-t border-border hover:bg-secondary/40 cursor-pointer">
                <td className="px-6 py-3">{t.txn_date}</td>
                <td className="px-6 py-3">
                  <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " + (t.direction === "in" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{DIRECTION_LABELS[t.direction] ?? t.direction}</span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{t.description}</td>
                <td className={"px-6 py-3 text-right font-semibold " + (t.direction === "in" ? "text-emerald-700" : "text-rose-700")}>{t.direction === "in" ? "+" : "−"}{peso(Number(t.amount))}</td>
                <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex gap-2">
                    <button disabled={!canEdit} onClick={() => { setEditing(t); setOpen(true); }} className="p-1.5 rounded-lg hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button disabled={!canEdit} onClick={() => { if (confirm("Delete transaction?")) del.mutate(t.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Transaction</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Date<input name="txn_date" type="date" required defaultValue={editing?.txn_date ?? new Date().toISOString().slice(0, 10)} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Direction<select name="direction" required defaultValue={editing?.direction ?? "in"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">{DIRECTIONS.map((d) => <option key={d} value={d}>{DIRECTION_LABELS[d]}</option>)}</select></label>
              <label className="text-xs font-medium">Amount<AmountInput name="amount" required defaultValue={editing?.amount ?? null} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Method<select name="method" defaultValue={editing?.method ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"><option value="">—</option>{METHODS.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
              <label className="text-xs font-medium">Branch<select name="branch_id" defaultValue={editing?.branch_id ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"><option value="">—</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
            </div>
            <label className="text-xs font-medium block">Description<textarea name="description" rows={2} defaultValue={editing?.description ?? ""} className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-card text-sm" /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
              <button type="submit" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editing ? "Save" : "Add"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={billOpen} onOpenChange={(o) => { setBillOpen(o); if (!o) setEditingBill(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingBill ? "Edit" : "New"} Recurring Bill</DialogTitle></DialogHeader>
          <form onSubmit={submitBill} className="space-y-3">
            <label className="text-xs font-medium block">Name<input name="name" required placeholder="e.g. Meralco — shop electricity" defaultValue={editingBill?.name ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Category<input name="category" defaultValue={editingBill?.category ?? "utilities"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Amount<AmountInput name="amount" required defaultValue={editingBill?.amount ?? null} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Frequency<select name="frequency" required defaultValue={editingBill?.frequency ?? "monthly"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">{BILL_FREQUENCIES.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}</select></label>
              <label className="text-xs font-medium">Next Due Date<input name="next_due_date" type="date" required defaultValue={editingBill?.next_due_date ?? new Date().toISOString().slice(0, 10)} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Method<select name="method" defaultValue={editingBill?.method ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"><option value="">—</option>{METHODS.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
              <label className="text-xs font-medium">Branch<select name="branch_id" defaultValue={editingBill?.branch_id ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"><option value="">—</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
            </div>
            <label className="text-xs font-medium block">Notes<textarea name="notes" rows={2} defaultValue={editingBill?.notes ?? ""} className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-card text-sm" /></label>
            <p className="text-[11px] text-muted-foreground">"Mark Paid" records this as an outflow transaction and rolls the due date forward by one {editingBill?.frequency ?? "monthly"} cycle.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setBillOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
              <button type="submit" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editingBill ? "Save" : "Add"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}