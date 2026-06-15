import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useMemo, useState } from "react";
import { Search, Plus, Droplets, AlertCircle, Clock, CheckCircle2, Edit2, Trash2, ExternalLink, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOilHistory, useVehicles, useBookings, useInsert, useUpdate, useDelete, useIsOwner } from "@/lib/db";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/oil-records")({ component: OilHistoryPage });

/* ── Status helpers ─────────────────────────────────────── */
function getServiceStatus(log: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (log.next_service_date) {
    const next = new Date(log.next_service_date);
    const daysLeft = Math.floor((next.getTime() - today.getTime()) / 86400000);
    if (daysLeft < 0) return { label: "Overdue", color: "bg-rose-100 text-rose-700 border-rose-200", icon: AlertCircle, days: daysLeft };
    if (daysLeft <= 30) return { label: `Due in ${daysLeft}d`, color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, days: daysLeft };
    return { label: "OK", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2, days: daysLeft };
  }
  return null;
}

function OilHistoryPage() {
  const { data: logs = [] } = useOilHistory();
  const { data: vehicles = [] } = useVehicles();
  const { data: bookings = [] } = useBookings();
  const ins = useInsert("vehicle_service_logs");
  const upd = useUpdate("vehicle_service_logs");
  const del = useDelete("vehicle_service_logs");
  const canEdit = useIsOwner();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  /* filter only logs that have oil_used (oil change logs) */
  const oilLogs = useMemo(() => {
    const base = (logs as any[]).filter((l) => l.oil_used || l.title?.toLowerCase().includes("oil"));
    if (!q) return base;
    const s = q.toLowerCase();
    return base.filter((l) =>
      [l.vehicle?.plate_number, l.vehicle?.make, l.vehicle?.model,
       l.vehicle?.customer?.full_name, l.oil_used, l.booking?.booking_number]
        .join(" ").toLowerCase().includes(s)
    );
  }, [logs, q]);

  /* summary counts */
  const overdue  = oilLogs.filter((l) => getServiceStatus(l)?.label === "Overdue").length;
  const dueSoon  = oilLogs.filter((l) => (getServiceStatus(l)?.days ?? 999) <= 30 && (getServiceStatus(l)?.days ?? 999) >= 0).length;

  return (
    <PageShell title="Oil Change History" subtitle="Track oil changes per vehicle and monitor next service schedules.">

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Entries",  value: oilLogs.length,       color: "text-primary",      bg: "bg-primary/10" },
          { label: "Overdue",         value: overdue,              color: "text-rose-600",     bg: "bg-rose-50" },
          { label: "Due This Month",  value: dueSoon,              color: "text-amber-600",    bg: "bg-amber-50" },
          { label: "Up to Date",      value: oilLogs.length - overdue - dueSoon, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-2xl p-4 border border-border bg-card shadow-soft")}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</div>
            <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plate, customer, oil…" className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/oil-history"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-lg border border-border bg-background text-sm font-medium inline-flex items-center gap-2 hover:bg-secondary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Customer Link
          </a>
          <Button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" />Log Oil Change
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-medium px-5 py-3">Vehicle</th>
              <th className="text-left font-medium px-5 py-3">Customer</th>
              <th className="text-left font-medium px-5 py-3">Service Date</th>
              <th className="text-left font-medium px-5 py-3">Oil Used</th>
              <th className="text-left font-medium px-5 py-3">Mileage</th>
              <th className="text-left font-medium px-5 py-3">Next Service</th>
              <th className="text-left font-medium px-5 py-3">Booking</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {oilLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-14 text-muted-foreground">
                  <Droplets className="h-8 w-8 mx-auto mb-2 opacity-25" />
                  <p>Walang oil change records pa.</p>
                </td>
              </tr>
            ) : oilLogs.map((log: any) => {
              const status = getServiceStatus(log);
              const Icon = status?.icon;
              return (
                <tr key={log.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{log.vehicle?.plate_number ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{log.vehicle?.make} {log.vehicle?.model}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div>{log.vehicle?.customer?.full_name ?? "—"}</div>
                    {log.vehicle?.customer?.phone && (
                      <div className="text-xs text-muted-foreground">{log.vehicle.customer.phone}</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {log.service_date
                      ? new Date(log.service_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-400" />
                      {log.oil_used ?? <span className="text-muted-foreground">—</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {log.mileage ? `${log.mileage.toLocaleString()} km` : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {log.next_service_date ? (
                      <div>
                        <div>{new Date(log.next_service_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</div>
                        {log.next_service_mileage && (
                          <div className="text-muted-foreground">or {log.next_service_mileage.toLocaleString()} km</div>
                        )}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3">
                    {log.booking ? (
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-mono">
                        <Calendar className="h-3 w-3" />
                        {log.booking.booking_number}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {status && Icon ? (
                      <Badge variant="secondary" className={cn("gap-1 text-[11px] border capitalize", status.color)}>
                        <Icon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button disabled={!canEdit} onClick={() => { setEditing(log); setOpen(true); }}
                      className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button disabled={!canEdit} onClick={() => { if (confirm("Delete this record?")) del.mutate(log.id); }}
                      className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 disabled:opacity-40">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <OilLogDialog
        open={open} editing={editing} vehicles={vehicles} bookings={bookings} canEdit={canEdit}
        onClose={() => setOpen(false)}
        onSave={async (v: any) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync({ ...v, title: "Oil Change" });
          toast.success("Saved!"); setOpen(false);
        }}
        onDelete={async (id: string) => {
          if (!confirm("Delete this record?")) return;
          await del.mutateAsync(id);
          toast.success("Deleted"); setOpen(false);
        }}
      />
    </PageShell>
  );
}

/* ── Dialog ─────────────────────────────────────────────── */
function OilLogDialog({ open, editing, vehicles, bookings, canEdit, onClose, onSave, onDelete }: any) {
  const blank = {
    vehicle_id: "", booking_id: "", service_date: new Date().toISOString().slice(0, 10),
    oil_used: "", mileage: "", cost: "", next_service_date: "", next_service_mileage: "", description: "",
  };
  const [v, setV] = useState<any>(blank);
  useMemo(() => {
    if (!open) return;
    if (editing) {
      setV({
        vehicle_id:            editing.vehicle_id ?? "",
        booking_id:            editing.booking_id ?? "",
        service_date:          editing.service_date ?? new Date().toISOString().slice(0, 10),
        oil_used:              editing.oil_used ?? "",
        mileage:               editing.mileage ?? "",
        cost:                  editing.cost ?? "",
        next_service_date:     editing.next_service_date ?? "",
        next_service_mileage:  editing.next_service_mileage ?? "",
        description:           editing.description ?? "",
      });
    } else {
      setV(blank);
    }
  }, [open, editing]);

  function field(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }

  function buildPayload() {
    return {
      vehicle_id:           v.vehicle_id || null,
      booking_id:           v.booking_id || null,
      service_date:         v.service_date || null,
      oil_used:             v.oil_used || null,
      mileage:              v.mileage ? Number(v.mileage) : null,
      cost:                 v.cost ? Number(v.cost) : null,
      next_service_date:    v.next_service_date || null,
      next_service_mileage: v.next_service_mileage ? Number(v.next_service_mileage) : null,
      description:          v.description || null,
    };
  }

  /* filter bookings to only show ones linked to the selected vehicle */
  const filteredBookings = useMemo(() => {
    if (!v.vehicle_id) return bookings;
    return (bookings as any[]).filter((b: any) => b.vehicle_id === v.vehicle_id);
  }, [bookings, v.vehicle_id]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Oil Change Record" : "Log Oil Change"}</DialogTitle>
          <DialogDescription>Record an oil change service for a vehicle.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Vehicle */}
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Vehicle *</Label>
            <select value={v.vehicle_id} onChange={(e) => field("vehicle_id", e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">
              <option value="">— Select vehicle —</option>
              {(vehicles as any[]).map((x: any) => (
                <option key={x.id} value={x.id}>
                  {x.plate_number ? `[${x.plate_number}] ` : ""}{x.make} {x.model}
                </option>
              ))}
            </select>
          </div>

          {/* Booking link */}
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Linked Booking <span className="normal-case text-muted-foreground font-normal">(optional)</span>
            </Label>
            <select value={v.booking_id} onChange={(e) => field("booking_id", e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">
              <option value="">— None —</option>
              {filteredBookings.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.booking_number} · {b.customer?.full_name ?? ""}
                  {b.scheduled_at ? ` · ${new Date(b.scheduled_at).toLocaleDateString("en-PH")}` : ""}
                </option>
              ))}
            </select>
            {v.vehicle_id && filteredBookings.length === 0 && (
              <p className="text-[11px] text-muted-foreground mt-1">Walang booking para sa vehicle na ito.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Service Date *</Label>
              <Input type="date" className="mt-1" value={v.service_date} onChange={(e) => field("service_date", e.target.value)} />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Mileage (km)</Label>
              <Input type="number" className="mt-1" placeholder="e.g. 45000" value={v.mileage} onChange={(e) => field("mileage", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Oil Used</Label>
              <Input className="mt-1" placeholder="e.g. Mobil 1 5W-30" value={v.oil_used} onChange={(e) => field("oil_used", e.target.value)} />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Cost (₱)</Label>
              <Input type="number" className="mt-1" placeholder="0.00" value={v.cost} onChange={(e) => field("cost", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Service Reminder</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Next Date</Label>
                <Input type="date" className="mt-1" value={v.next_service_date} onChange={(e) => field("next_service_date", e.target.value)} />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Next Mileage (km)</Label>
                <Input type="number" className="mt-1" placeholder="e.g. 50000" value={v.next_service_mileage} onChange={(e) => field("next_service_mileage", e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notes</Label>
            <textarea value={v.description} onChange={(e) => field("description", e.target.value)} rows={2}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {editing && canEdit && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(editing.id)} className="mr-auto">
              <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!canEdit} onClick={() => {
            if (!v.vehicle_id) return toast.error("Pumili ng vehicle");
            if (!v.service_date) return toast.error("Lagyan ng service date");
            onSave(buildPayload());
          }}>
            {editing ? "Save Changes" : "Log Oil Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
