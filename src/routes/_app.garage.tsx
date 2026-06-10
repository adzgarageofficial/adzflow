import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useMemo, useState } from "react";
import { Car, Search, Plus, Edit2, Trash2, Wrench, CalendarClock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVehicles, useCustomers, useInsert, useUpdate, useDelete, useIsOwner } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/garage")({ component: GaragePage });

const NEXT_SERVICE_BADGE: Record<string, string> = {
  overdue: "bg-rose-50 text-rose-700 border-rose-100",
  soon: "bg-amber-50 text-amber-700 border-amber-100",
  ok: "bg-secondary text-muted-foreground border-border",
};
const NEXT_SERVICE_LABEL: Record<string, string> = { overdue: "Service overdue", soon: "Service due soon", ok: "Next service" };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

// Reads the latest service-log row that has a next-service plan and compares
// it against today's date and the vehicle's current odometer reading.
function nextServiceStatus(vehicle: any, info: { next_service_date?: string | null; next_service_mileage?: number | null } | undefined | null) {
  if (!info || (!info.next_service_date && info.next_service_mileage == null)) return null;
  let level: "overdue" | "soon" | "ok" = "ok";
  const parts: string[] = [];
  if (info.next_service_date) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((new Date(info.next_service_date).getTime() - today.getTime()) / 86400000);
    if (days < 0) level = "overdue";
    else if (days <= 14 && level === "ok") level = "soon";
    parts.push(fmtDate(info.next_service_date));
  }
  if (info.next_service_mileage != null) {
    const remaining = info.next_service_mileage - Number(vehicle?.mileage ?? 0);
    if (remaining <= 0) level = "overdue";
    else if (remaining <= 500 && level === "ok") level = "soon";
    parts.push(`${Number(info.next_service_mileage).toLocaleString()} km`);
  }
  return { level, label: parts.join(" or at ") };
}

function GaragePage() {
  const { data: vehicles = [] } = useVehicles();
  const { data: customers = [] } = useCustomers();
  const [q, setQ] = useState("");
  const [dueOnly, setDueOnly] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [logsFor, setLogsFor] = useState<any | null>(null);
  const ins = useInsert("vehicles");
  const canEdit = useIsOwner();
  const upd = useUpdate("vehicles");
  const del = useDelete("vehicles");

  const { data: nextServiceRows = [] } = useQuery({
    queryKey: ["vehicle_service_logs", "next-due"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicle_service_logs")
        .select("vehicle_id, service_date, next_service_date, next_service_mileage")
        .or("next_service_date.not.is.null,next_service_mileage.not.is.null")
        .order("service_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  // Most recent log per vehicle that set a next-service plan — that plan supersedes older ones.
  const nextServiceByVehicle = useMemo(() => {
    const map: Record<string, any> = {};
    for (const row of nextServiceRows as any[]) if (!map[row.vehicle_id]) map[row.vehicle_id] = row;
    return map;
  }, [nextServiceRows]);

  const dueVehicles = useMemo(
    () => vehicles.filter((v: any) => {
      const status = nextServiceStatus(v, nextServiceByVehicle[v.id]);
      return status && status.level !== "ok";
    }),
    [vehicles, nextServiceByVehicle],
  );

  const filtered = useMemo(() =>
    (dueOnly ? dueVehicles : vehicles).filter((v: any) => !q || [v.plate_number, v.make, v.model, v.customer?.full_name].join(" ").toLowerCase().includes(q.toLowerCase())),
    [vehicles, dueVehicles, dueOnly, q],
  );

  return (
    <PageShell title="Garage" subtitle="Customer vehicles, service history & build sheets.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plate, make, owner..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <div className="flex items-center gap-2">
          {dueVehicles.length > 0 && (
            <button onClick={() => setDueOnly((d) => !d)} className={`h-10 px-4 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition ${dueOnly ? "bg-amber-50 text-amber-700 border-amber-200" : "border-border hover:bg-secondary"}`}>
              <CalendarClock className="h-4 w-4" />{dueVehicles.length} due for service
            </button>
          )}
          <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
            <Plus className="h-4 w-4" />Add Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-sm">{dueOnly ? "No vehicles due for service. 🎉" : "No vehicles yet."}</div>
        ) : filtered.map((v: any) => {
          const nextService = nextServiceStatus(v, nextServiceByVehicle[v.id]);
          return (
          <div key={v.id} className="rounded-2xl bg-card border border-border shadow-soft p-4 hover:border-foreground/30 transition">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary inline-flex items-center justify-center"><Car className="h-6 w-6" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{v.year} {v.make} {v.model}</div>
                <div className="text-xs text-muted-foreground">{v.plate_number ?? "No plate"}</div>
              </div>
              <div className="flex gap-1">
                <button disabled={!canEdit} onClick={() => { setEditing(v); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                <button disabled={!canEdit} onClick={() => { if (confirm("Delete vehicle?")) del.mutate(v.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div><dt className="text-muted-foreground">Owner</dt><dd className="font-semibold truncate">{v.customer?.full_name ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Mileage</dt><dd className="font-semibold">{v.mileage?.toLocaleString() ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Color</dt><dd className="font-semibold">{v.color ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">VIN</dt><dd className="font-semibold truncate">{v.vin ?? "—"}</dd></div>
            </dl>
            {nextService && (
              <div className={`mt-3 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border inline-flex items-center gap-1.5 ${NEXT_SERVICE_BADGE[nextService.level]}`}>
                <CalendarClock className="h-3 w-3 shrink-0" />{NEXT_SERVICE_LABEL[nextService.level]} · {nextService.label}
              </div>
            )}
            <button onClick={() => setLogsFor(v)} className="mt-3 w-full h-9 rounded-xl border border-border text-xs font-semibold hover:bg-secondary inline-flex items-center justify-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />Service History
            </button>
          </div>
        );})}
      </div>

      <VehicleDialog open={open} onClose={() => setOpen(false)} editing={editing} customers={customers}
        onSave={async (v: any) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync(v);
          toast.success("Saved"); setOpen(false);
        }} />
      <ServiceLogsDialog vehicle={logsFor} onClose={() => setLogsFor(null)} nextServiceInfo={logsFor ? nextServiceByVehicle[logsFor.id] : null} />
    </PageShell>
  );
}

function VehicleDialog({ open, onClose, editing, customers, onSave }: any) {
  const [v, setV] = useState<any>({});
  useMemo(() => setV(editing ?? { make: "", model: "", year: new Date().getFullYear(), plate_number: "", vin: "", color: "", mileage: 0, customer_id: "" }), [open, editing]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing ? "Edit Vehicle" : "New Vehicle"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Customer" className="col-span-2">
            <select value={v.customer_id ?? ""} onChange={(e) => setV({ ...v, customer_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">— None —</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </Field>
          <Field label="Make *"><input value={v.make ?? ""} onChange={(e) => setV({ ...v, make: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Model *"><input value={v.model ?? ""} onChange={(e) => setV({ ...v, model: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Year"><input type="number" value={v.year ?? ""} onChange={(e) => setV({ ...v, year: Number(e.target.value) || null })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Plate"><input value={v.plate_number ?? ""} onChange={(e) => setV({ ...v, plate_number: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="VIN"><input value={v.vin ?? ""} onChange={(e) => setV({ ...v, vin: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Color"><input value={v.color ?? ""} onChange={(e) => setV({ ...v, color: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Engine"><input value={v.engine ?? ""} onChange={(e) => setV({ ...v, engine: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Mileage"><input type="number" value={v.mileage ?? 0} onChange={(e) => setV({ ...v, mileage: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Notes" className="col-span-2"><textarea value={v.notes ?? ""} onChange={(e) => setV({ ...v, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border" rows={2} /></Field>
        </div>
        <button onClick={() => onSave(v)} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mt-3">Save</button>
      </DialogContent>
    </Dialog>
  );
}

function ServiceLogsDialog({ vehicle, onClose, nextServiceInfo }: { vehicle: any | null; onClose: () => void; nextServiceInfo?: any }) {
  const qc = useQueryClient();
  const { data: logs = [] } = useQuery({
    queryKey: ["vehicle_service_logs", vehicle?.id],
    enabled: !!vehicle?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicle_service_logs").select("*").eq("vehicle_id", vehicle.id).order("service_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [title, setTitle] = useState(""); const [date, setDate] = useState(""); const [cost, setCost] = useState(0); const [mileage, setMileage] = useState(0);
  const [nextDate, setNextDate] = useState(""); const [nextMileage, setNextMileage] = useState("");

  const nextService = nextServiceStatus(vehicle, nextServiceInfo);

  async function add() {
    if (!title || !vehicle) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("vehicle_service_logs").insert({
      vehicle_id: vehicle.id, title, service_date: date || new Date().toISOString().slice(0, 10),
      cost, mileage, created_by: u.user?.id ?? null,
      next_service_date: nextDate || null,
      next_service_mileage: nextMileage === "" ? null : Number(nextMileage),
    });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["vehicle_service_logs", vehicle.id] });
    qc.invalidateQueries({ queryKey: ["vehicle_service_logs", "next-due"] });
    setTitle(""); setDate(""); setCost(0); setMileage(0); setNextDate(""); setNextMileage("");
    toast.success("Service log added");
  }

  return (
    <Dialog open={!!vehicle} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Service History — {vehicle?.make} {vehicle?.model}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {nextService && (
            <div className={`text-xs font-semibold px-3 py-2 rounded-lg border inline-flex items-center gap-1.5 ${NEXT_SERVICE_BADGE[nextService.level]}`}>
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />{NEXT_SERVICE_LABEL[nextService.level]} · {nextService.label}
            </div>
          )}
          <div className="rounded-xl border border-border p-3 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log new service</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Oil change)" className="w-full h-9 px-3 rounded-lg border border-border text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 px-2 rounded-lg border border-border text-xs" />
              <input type="number" placeholder="Cost" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="h-9 px-2 rounded-lg border border-border text-xs" />
              <input type="number" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(Number(e.target.value))} className="h-9 px-2 rounded-lg border border-border text-xs" />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pt-1">Next service due (optional)</div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} placeholder="By date" className="h-9 px-2 rounded-lg border border-border text-xs" />
              <input type="number" placeholder="Or at mileage" value={nextMileage} onChange={(e) => setNextMileage(e.target.value)} className="h-9 px-2 rounded-lg border border-border text-xs" />
            </div>
            <button onClick={add} className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Add Log</button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.length === 0 ? <div className="text-center text-xs text-muted-foreground py-6">No service logs yet.</div> :
              logs.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between p-2 rounded-lg border border-border text-sm">
                  <div><div className="font-semibold">{l.title}</div><div className="text-xs text-muted-foreground">{l.service_date} · {l.mileage?.toLocaleString()} km</div></div>
                  <div className="font-semibold">₱{Number(l.cost ?? 0).toLocaleString()}</div>
                </div>
              ))
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }: any) {
  return (
    <div className={className}>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
