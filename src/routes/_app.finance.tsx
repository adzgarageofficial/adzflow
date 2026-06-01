import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Wallet, Receipt, Plus, Trash2, Edit2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinanceTxns, useBranches, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/finance")({ component: Finance });

const DIRECTIONS = ["inflow", "outflow"] as const;
const METHODS = ["cash", "gcash", "maya", "card", "bank_transfer", "other"] as const;
const CATEGORIES = ["sales", "service_revenue", "supplier_payment", "salary", "rent", "utilities", "marketing", "other"];

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

  const { inflow, outflow, series } = useMemo(() => {
    let inflow = 0, outflow = 0;
    const map = new Map<string, { d: string; inflow: number; outflow: number }>();
    for (const t of txns) {
      const amt = Number(t.amount) || 0;
      if (t.direction === "inflow") inflow += amt; else outflow += amt;
      const d = t.txn_date;
      const row = map.get(d) ?? { d, inflow: 0, outflow: 0 };
      if (t.direction === "inflow") row.inflow += amt; else row.outflow += amt;
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
    !q || [t.category, t.description, t.reference_type].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      txn_date: fd.get("txn_date"),
      direction: fd.get("direction"),
      category: fd.get("category"),
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

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />New Transaction
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr><th className="text-left font-medium px-6 py-3">Date</th><th className="text-left font-medium px-6 py-3">Type</th><th className="text-left font-medium px-6 py-3">Category</th><th className="text-left font-medium px-6 py-3">Description</th><th className="text-right font-medium px-6 py-3">Amount</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No transactions yet.</td></tr>
            ) : filtered.map((t: any) => (
              <tr key={t.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3">{t.txn_date}</td>
                <td className="px-6 py-3">
                  <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " + (t.direction === "inflow" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{t.direction}</span>
                </td>
                <td className="px-6 py-3">{t.category}</td>
                <td className="px-6 py-3 text-muted-foreground">{t.description}</td>
                <td className={"px-6 py-3 text-right font-semibold " + (t.direction === "inflow" ? "text-emerald-700" : "text-rose-700")}>{t.direction === "inflow" ? "+" : "−"}{peso(Number(t.amount))}</td>
                <td className="px-6 py-3 text-right">
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
              <label className="text-xs font-medium">Direction<select name="direction" required defaultValue={editing?.direction ?? "inflow"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">{DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}</select></label>
              <label className="text-xs font-medium">Category<select name="category" required defaultValue={editing?.category ?? "sales"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
              <label className="text-xs font-medium">Amount<input name="amount" type="number" step="0.01" required defaultValue={editing?.amount ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
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
    </PageShell>
  );
}