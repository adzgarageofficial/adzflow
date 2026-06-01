import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookings, useCustomers, useVehicles, useServices, useBranches, useInsert, useUpdate, useDelete, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bookings")({ component: BookingsPage });

const STATUSES = ["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"] as const;
const COLORS: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-100",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  in_progress: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-zinc-100 text-zinc-700 border-zinc-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  no_show: "bg-amber-50 text-amber-700 border-amber-100",
};

function BookingsPage() {
  const { data: bookings = [] } = useBookings();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: services = [] } = useServices();
  const { data: branches = [] } = useBranches();
  const ins = useInsert("bookings");
  const canEdit = useIsOwner();
  const upd = useUpdate("bookings");
  const del = useDelete("bookings");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const filtered = useMemo(() => bookings.filter((b: any) =>
    !q || [b.booking_number, b.customer?.full_name, b.service?.name].join(" ").toLowerCase().includes(q.toLowerCase())
  ), [bookings, q]);

  return (
    <PageShell title="Bookings" subtitle="Service appointments & schedule.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />New Booking
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr><th className="text-left font-medium px-6 py-3">Booking</th><th className="text-left font-medium px-6 py-3">Date & Time</th><th className="text-left font-medium px-6 py-3">Customer</th><th className="text-left font-medium px-6 py-3">Service</th><th className="text-left font-medium px-6 py-3">Status</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No bookings yet.</td></tr>
            ) : filtered.map((b: any) => (
              <tr key={b.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3 font-medium">{b.booking_number}</td>
                <td className="px-6 py-3 text-xs"><div className="font-semibold">{new Date(b.scheduled_at).toLocaleString()}</div><div className="text-muted-foreground">{b.duration_minutes} min</div></td>
                <td className="px-6 py-3">{b.customer?.full_name ?? "—"}</td>
                <td className="px-6 py-3 text-muted-foreground">{b.service?.name ?? "—"}</td>
                <td className="px-6 py-3">
                  <select disabled={!canEdit} value={b.status} onChange={(e) => upd.mutate({ id: b.id, patch: { status: e.target.value as any } })}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${COLORS[b.status]}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </td>
                <td className="px-6 py-3 text-right">
                  <button disabled={!canEdit} onClick={() => { setEditing(b); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button disabled={!canEdit} onClick={() => { if (confirm("Delete?")) del.mutate(b.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BookingDialog open={open} editing={editing} onClose={() => setOpen(false)}
        customers={customers} vehicles={vehicles} services={services} branches={branches}
        onSave={async (v: any) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync({ ...v, booking_number: `BK-${Date.now().toString().slice(-8)}` });
          toast.success("Saved"); setOpen(false);
        }} />
    </PageShell>
  );
}

function BookingDialog({ open, editing, customers, vehicles, services, branches, onClose, onSave }: any) {
  const [v, setV] = useState<any>({});
  useMemo(() => setV(editing ?? { customer_id: "", vehicle_id: "", service_id: "", branch_id: "", scheduled_at: "", duration_minutes: 60, status: "scheduled", notes: "" }), [open, editing]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing ? "Edit Booking" : "New Booking"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Customer"><select value={v.customer_id ?? ""} onChange={(e) => setV({ ...v, customer_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background"><option value="">—</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}</select></Field>
          <Field label="Vehicle"><select value={v.vehicle_id ?? ""} onChange={(e) => setV({ ...v, vehicle_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background"><option value="">—</option>{vehicles.map((x: any) => <option key={x.id} value={x.id}>{x.make} {x.model}</option>)}</select></Field>
          <Field label="Service"><select value={v.service_id ?? ""} onChange={(e) => setV({ ...v, service_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background"><option value="">—</option>{services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Branch"><select value={v.branch_id ?? ""} onChange={(e) => setV({ ...v, branch_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background"><option value="">—</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Date & Time *"><input type="datetime-local" value={v.scheduled_at ? new Date(v.scheduled_at).toISOString().slice(0, 16) : ""} onChange={(e) => setV({ ...v, scheduled_at: new Date(e.target.value).toISOString() })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Duration (min)"><input type="number" value={v.duration_minutes ?? 60} onChange={(e) => setV({ ...v, duration_minutes: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          </div>
          <Field label="Notes"><textarea value={v.notes ?? ""} onChange={(e) => setV({ ...v, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border" /></Field>
          <button onClick={() => { if (!v.scheduled_at) return toast.error("Pick a date/time"); onSave(v); }} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: any) {
  return (<div><label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label><div className="mt-1">{children}</div></div>);
}
