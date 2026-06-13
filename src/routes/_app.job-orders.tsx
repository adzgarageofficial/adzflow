import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { AmountInput } from "@/components/ui/amount-input";
import { useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2, Wrench, History, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useJobOrders, useCustomers, useVehicles, useInsert, useUpdate, useDelete, useJobOrderHistory, peso, useIsOwner } from "@/lib/db";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/job-orders")({ component: JobOrdersPage });

const STATUSES = ["pending", "in_progress", "awaiting_parts", "completed", "cancelled"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  in_progress: "bg-blue-50 text-blue-700 border-blue-100",
  awaiting_parts: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

function JobOrdersPage() {
  const { data: jobs = [] } = useJobOrders();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const ins = useInsert("job_orders");
  const canEdit = useIsOwner();
  const upd = useUpdate("job_orders");
  const del = useDelete("job_orders");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [historyJob, setHistoryJob] = useState<any | null>(null);

  const filtered = useMemo(() => jobs.filter((j: any) =>
    (filter === "all" || j.status === filter) &&
    (!q || [j.job_number, j.customer?.full_name, j.description].join(" ").toLowerCase().includes(q.toLowerCase()))
  ), [jobs, q, filter]);

  return (
    <PageShell title="Job Orders" subtitle="Workshop service tickets.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-sm">
            <option value="all">All status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />New Job Order
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-medium px-6 py-3">Job #</th>
              <th className="text-left font-medium px-6 py-3">Customer</th>
              <th className="text-left font-medium px-6 py-3">Vehicle</th>
              <th className="text-left font-medium px-6 py-3">Description</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="text-right font-medium px-6 py-3">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No job orders yet.</td></tr>
            ) : filtered.map((j: any) => (
              <tr key={j.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3 font-medium">{j.job_number}</td>
                <td className="px-6 py-3">{j.customer?.full_name ?? "—"}</td>
                <td className="px-6 py-3 text-xs">{j.vehicle ? `${j.vehicle.make} ${j.vehicle.model} · ${j.vehicle.plate_number ?? ""}` : "—"}</td>
                <td className="px-6 py-3 text-muted-foreground truncate max-w-xs">{j.description}</td>
                <td className="px-6 py-3">
                  <select disabled={!canEdit} value={j.status} onChange={(e) => upd.mutate({ id: j.id, patch: { status: e.target.value as any } })}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[j.status]}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </td>
                <td className="px-6 py-3 text-right font-semibold">{peso(Number(j.total))}</td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => setHistoryJob(j)} title="Status history" className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><History className="h-3.5 w-3.5" /></button>
                  <button disabled={!canEdit} onClick={() => { setEditing(j); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button disabled={!canEdit} onClick={() => { if (confirm("Delete?")) del.mutate(j.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <JobDialog open={open} editing={editing} customers={customers} vehicles={vehicles} onClose={() => setOpen(false)}
        onSave={async (v: any) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync({ ...v, job_number: `JO-${Date.now().toString().slice(-8)}` });
          toast.success("Saved"); setOpen(false);
        }} />

      <JobHistoryDialog job={historyJob} onClose={() => setHistoryJob(null)} />
    </PageShell>
  );
}

function JobHistoryDialog({ job, onClose }: { job: any | null; onClose: () => void }) {
  const { data: history = [], isLoading } = useJobOrderHistory(job?.id);
  return (
    <Dialog open={!!job} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Status history · {job?.job_number}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          Who moved this job between statuses and when — for owner verification of mechanic/staff updates.
        </p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">Loading…</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No status changes recorded yet.</div>
          ) : history.map((h: any) => (
            <div key={h.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                {h.from_status && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[h.from_status] ?? ""}`}>{h.from_status.replace("_", " ")}</span>
                )}
                {h.from_status && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[h.to_status] ?? ""}`}>{h.to_status.replace("_", " ")}</span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-medium">{h.changed_by_profile?.display_name ?? "System"}</div>
                <div className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(h.created_at), { addSuffix: true })}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JobDialog({ open, editing, customers, vehicles, onClose, onSave }: any) {
  const [v, setV] = useState<any>({});
  useMemo(() => setV(editing ?? { customer_id: "", vehicle_id: "", description: "", status: "pending", labor_cost: 0, parts_cost: 0, total: 0 }), [open, editing]);
  const total = Number(v.labor_cost || 0) + Number(v.parts_cost || 0);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing ? "Edit Job" : "New Job Order"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Customer">
            <select value={v.customer_id ?? ""} onChange={(e) => setV({ ...v, customer_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">—</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </Field>
          <Field label="Vehicle">
            <select value={v.vehicle_id ?? ""} onChange={(e) => setV({ ...v, vehicle_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">—</option>{vehicles.map((x: any) => <option key={x.id} value={x.id}>{x.make} {x.model} · {x.plate_number}</option>)}
            </select>
          </Field>
          <Field label="Description"><textarea value={v.description ?? ""} onChange={(e) => setV({ ...v, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-border" /></Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Labor"><AmountInput value={v.labor_cost ?? null} onChange={(val) => setV({ ...v, labor_cost: val })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Parts"><AmountInput value={v.parts_cost ?? null} onChange={(val) => setV({ ...v, parts_cost: val })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Total"><div className="h-10 px-3 inline-flex items-center font-bold">{peso(total)}</div></Field>
          </div>
          <button onClick={() => onSave({ ...v, total })} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: any) {
  return (<div><label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label><div className="mt-1">{children}</div></div>);
}
