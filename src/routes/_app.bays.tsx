import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  useEmployees, useMyProfile, useJobOrders, useCustomers, useVehicles,
  useInsert, useUpdate, useDelete, useJobOrderHistory, peso, useIsOwner,
} from "@/lib/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AmountInput } from "@/components/ui/amount-input";
import {
  Wrench, Clock, CheckCircle2, AlertCircle, CircleDot,
  Plus, Trash2, ExternalLink, ChevronDown, Car, ArrowRight,
  Edit2, History, Search, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/bays")({ component: BaysPage });

// ── Types ──────────────────────────────────────────────────────────────────
type ServiceItem = { name: string; done: boolean };
type BayStatus = "empty" | "waiting" | "in_progress" | "quality_check" | "done";
type BayRow = {
  bay_number: number;
  status: BayStatus;
  customer_name: string | null;
  vehicle_info: string | null;
  mechanic_name: string | null;
  services: ServiceItem[];
  progress: number;
  notes: string | null;
  started_at: string | null;
  updated_at: string;
  updated_by_name: string | null;
};

// ── Status meta ─────────────────────────────────────────────────────────────
const STATUS_META: Record<BayStatus, { label: string; color: string; bg: string; icon: any }> = {
  empty:         { label: "Empty",         color: "text-muted-foreground",  bg: "bg-secondary",           icon: CircleDot },
  waiting:       { label: "Waiting",       color: "text-amber-600",         bg: "bg-amber-50",             icon: Clock },
  in_progress:   { label: "In Progress",   color: "text-blue-600",          bg: "bg-blue-50",              icon: Wrench },
  quality_check: { label: "Quality Check", color: "text-violet-600",        bg: "bg-violet-50",            icon: AlertCircle },
  done:          { label: "Done",          color: "text-emerald-600",       bg: "bg-emerald-50",           icon: CheckCircle2 },
};
const STATUSES: BayStatus[] = ["empty", "waiting", "in_progress", "quality_check", "done"];

// ── Live hook ───────────────────────────────────────────────────────────────
function useBays() {
  const qc = useQueryClient();

  useEffect(() => {
    const ch = supabase
      .channel("bays-mechanic-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "bay_queue" }, () => {
        qc.invalidateQueries({ queryKey: ["bay_queue"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return useQuery<BayRow[]>({
    queryKey: ["bay_queue"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("bay_queue")
        .select("*")
        .order("bay_number", { ascending: true });
      if (error) throw error;
      return (data ?? []) as BayRow[];
    },
    staleTime: 5_000,
  });
}

// ── Service Queue hook ─────────────────────────────────────────────────────
type QueueRow = {
  id: string;
  customer_name: string;
  vehicle_info: string | null;
  plate_number: string | null;
  services: { name: string; qty: number; price: number }[];
  reference_number: string | null;
  reference_image_url: string | null;
  status: "waiting" | "in_bay" | "done" | "cancelled";
  bay_assigned: number | null;
  queued_at: string;
  job_order_id?: string | null;
};

function useServiceQueue() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("service-queue-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "service_queue" }, () => {
        qc.invalidateQueries({ queryKey: ["service_queue"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return useQuery<QueueRow[]>({
    queryKey: ["service_queue"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("service_queue")
        .select("*")
        .in("status", ["waiting", "in_bay"])
        .order("queued_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as QueueRow[];
    },
    staleTime: 5_000,
  });
}

async function saveBay(patch: Partial<BayRow> & { bay_number: number }) {
  const { bay_number, ...rest } = patch;
  const { error } = await (supabase as any)
    .from("bay_queue")
    .update(rest)
    .eq("bay_number", bay_number);
  if (error) throw error;
}

const JO_STATUSES = ["pending", "in_progress", "awaiting_parts", "completed", "cancelled"] as const;
const JO_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  in_progress: "bg-blue-50 text-blue-700 border-blue-100",
  awaiting_parts: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

// ── Page ────────────────────────────────────────────────────────────────────
function BaysPage() {
  const { data: bays = [], isLoading } = useBays();
  const { data: myProfile } = useMyProfile();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<BayRow | null>(null);
  const [assigningJo, setAssigningJo] = useState<any | null>(null);
  const [assignBayNum, setAssignBayNum] = useState<number | "">("");
  const [assignBusy, setAssignBusy] = useState(false);

  // ── Job Orders ────────────────────────────────────────────────────────────
  const { data: jobs = [] } = useJobOrders();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const joIns = useInsert("job_orders");
  const joUpd = useUpdate("job_orders");
  const joDel = useDelete("job_orders");
  const canEditJo = useIsOwner();
  const [joQ, setJoQ] = useState("");
  const [joFilter, setJoFilter] = useState("active");
  const [joOpen, setJoOpen] = useState(false);
  const [joEditing, setJoEditing] = useState<any | null>(null);
  const [historyJob, setHistoryJob] = useState<any | null>(null);

  const ACTIVE_JO_STATUSES = ["pending", "in_progress", "awaiting_parts"];
  // FCFS: sort by created_at ascending so oldest job = first in line
  const filteredJobs = useMemo(() => (jobs as any[])
    .filter((j) =>
      (joFilter === "all" || (joFilter === "active" ? ACTIVE_JO_STATUSES.includes(j.status) : j.status === joFilter)) &&
      (!joQ || [j.job_number, j.customer?.full_name, j.description].join(" ").toLowerCase().includes(joQ.toLowerCase()))
    )
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
  [jobs, joQ, joFilter]);

  const emptyBays = bays.filter((b) => b.status === "empty" || b.status === "done");
  const actorName = myProfile?.display_name ?? "Staff";

  async function assignJoToBay() {
    if (!assigningJo || !assignBayNum) return;
    setAssignBusy(true);
    try {
      const customerName = assigningJo.customer?.full_name ?? assigningJo.walk_in_name ?? "Walk-in";
      const vehicleInfo = assigningJo.vehicle
        ? [assigningJo.vehicle.make, assigningJo.vehicle.model].filter(Boolean).join(" ")
        : assigningJo.walk_in_vehicle ?? null;
      const plateInfo = assigningJo.vehicle?.plate_number ?? assigningJo.walk_in_plate ?? null;
      await saveBay({
        bay_number: Number(assignBayNum),
        status: "waiting",
        customer_name: customerName,
        vehicle_info: [vehicleInfo, plateInfo].filter(Boolean).join(" · ") || null,
        services: [],
        progress: 0,
        mechanic_name: null,
        notes: assigningJo.job_number,
        started_at: null,
        updated_by_name: actorName,
      });
      await joUpd.mutateAsync({ id: assigningJo.id, patch: { status: "in_progress" } });
      // Sync the linked service_queue entry (used by the public bay-display)
      await (supabase as any)
        .from("service_queue")
        .update({ status: "in_bay", bay_assigned: Number(assignBayNum) })
        .eq("job_order_id", assigningJo.id);
      qc.invalidateQueries({ queryKey: ["service_queue"] });
      await supabase.from("notifications").insert({
        title: `Bay ${assignBayNum}: Customer Assigned`,
        body: `${customerName}${plateInfo ? ` (${plateInfo})` : ""} ay naka-assign na sa Bay ${assignBayNum} ni ${actorName}.`,
        severity: "info", category: "ops", audience_role: "owner", link: "/bays",
      });
      qc.invalidateQueries({ queryKey: ["bay_queue"] });
      qc.invalidateQueries({ queryKey: ["job_orders"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(`${customerName} → Bay ${assignBayNum}`);
      setAssigningJo(null);
      setAssignBayNum("");
    } catch (e: any) {
      toast.error(e.message ?? "Hindi na-assign");
    } finally {
      setAssignBusy(false);
    }
  }

  // Pad to 8 slots while data loads
  const displayBays: (BayRow | null)[] = Array.from({ length: 8 }, (_, i) =>
    bays.find((b) => b.bay_number === i + 1) ?? null,
  );

  return (
    <PageShell
      title="Workshop"
      subtitle="I-click ang job order para i-assign sa bay."
      actions={
        <a href="/bay-display" target="_blank" rel="noopener noreferrer"
          className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <ExternalLink className="h-3.5 w-3.5" /> Customer Display
        </a>
      }
    >
      {/* ── Job Orders as FCFS queue ── */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">
              Job Orders{" "}
              <span className="text-muted-foreground font-normal">({filteredJobs.length})</span>
            </h2>
            <span className="text-[10px] text-muted-foreground">— first come, first served</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={joQ} onChange={(e) => setJoQ(e.target.value)} placeholder="Search…"
                className="h-8 pl-8 pr-3 w-44 rounded-xl border border-border bg-card text-xs" />
            </div>
            <select value={joFilter} onChange={(e) => setJoFilter(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-border bg-card text-xs">
              <option value="active">Active</option>
              <option value="all">Lahat</option>
              {JO_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Walang active na job orders. Gumawa ng bago sa pamamagitan ng "New Job Order" button.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredJobs.map((j: any, idx: number) => {
              const isPending = j.status === "pending";
              const displayName = j.customer?.full_name ?? j.walk_in_name ?? "Walk-in";
              const vehicleLabel = j.vehicle
                ? [j.vehicle.make, j.vehicle.model].filter(Boolean).join(" ")
                : j.walk_in_vehicle ?? null;
              const plate = j.vehicle?.plate_number ?? j.walk_in_plate ?? null;
              return (
                <div
                  key={j.id}
                  className={`rounded-2xl border-2 bg-card shadow-soft p-4 flex items-center gap-4 transition-all ${isPending ? "hover:border-primary/50 hover:shadow-md cursor-pointer group" : "opacity-80"}`}
                  style={{ borderColor: isPending && idx === 0 ? "hsl(var(--primary))" : undefined }}
                  onClick={() => isPending && setAssigningJo(j)}
                >
                  <div className={`h-10 w-10 shrink-0 rounded-full grid place-items-center font-black text-base ${isPending && idx === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{displayName}</span>
                      <span className="text-[10px] font-semibold text-blue-600">{j.job_number}</span>
                      {isPending && idx === 0 && (
                        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">SUSUNOD</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-0.5">
                      {vehicleLabel && <span className="flex items-center gap-1"><Car className="h-3 w-3" />{vehicleLabel}</span>}
                      {plate && <span className="font-mono bg-secondary px-1.5 py-0.5 rounded">{plate}</span>}
                      <span className="text-[10px]">{formatDistanceToNow(new Date(j.created_at), { addSuffix: true })}</span>
                    </div>
                    {j.description && (
                      <div className="text-[11px] text-muted-foreground mt-1 truncate">{j.description}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${JO_STATUS_COLORS[j.status]}`}>
                      {j.status.replace("_", " ")}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); setHistoryJob(j); }}
                      className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary">
                      <History className="h-3.5 w-3.5" />
                    </button>
                    <button disabled={!canEditJo} onClick={(e) => { e.stopPropagation(); setJoEditing(j); setJoOpen(true); }}
                      className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button disabled={!canEditJo} onClick={(e) => { e.stopPropagation(); if (confirm("Delete?")) joDel.mutate(j.id); }}
                      className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 disabled:opacity-40">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isPending && <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Bay Grid ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold">Bay Status</h2>
          <span className="text-[10px] text-muted-foreground">— i-click ang bay para i-update</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayBays.map((bay, i) =>
            isLoading ? (
              <div key={i} className="rounded-2xl border border-border bg-card shadow-soft p-4 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-12 rounded bg-secondary" />
                  <div className="h-5 w-20 rounded-full bg-secondary" />
                </div>
                <div className="h-4 w-3/4 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
                <div className="h-1.5 w-full rounded-full bg-secondary mt-4" />
              </div>
            ) : bay ? (
              <BayCard key={bay.bay_number} bay={bay} onClick={() => setEditing(bay)} />
            ) : (
              <div key={i} className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                Bay {i + 1} — Available
              </div>
            ),
          )}
        </div>
      </section>

      {/* ── Assign to Bay dialog ── */}
      <Dialog open={!!assigningJo} onOpenChange={(o) => !o && setAssigningJo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Assign sa Bay</DialogTitle></DialogHeader>
          {assigningJo && (
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="font-semibold">
                  {assigningJo.customer?.full_name ?? assigningJo.walk_in_name ?? "Walk-in"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {assigningJo.job_number}
                  {(assigningJo.vehicle
                    ? ` · ${assigningJo.vehicle.make} ${assigningJo.vehicle.model}`
                    : assigningJo.walk_in_vehicle ? ` · ${assigningJo.walk_in_vehicle}` : "")}
                  {(assigningJo.vehicle?.plate_number ?? assigningJo.walk_in_plate)
                    ? ` · ${assigningJo.vehicle?.plate_number ?? assigningJo.walk_in_plate}`
                    : ""}
                </div>
                {assigningJo.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{assigningJo.description}</div>}
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5">Piliin ang Bay</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1,2,3,4,5,6,7,8].map((n) => {
                    const bay = bays.find((b) => b.bay_number === n);
                    const isEmpty = !bay || bay.status === "empty" || bay.status === "done";
                    return (
                      <button key={n} disabled={!isEmpty} onClick={() => setAssignBayNum(n)}
                        className={`h-12 rounded-xl border-2 text-sm font-bold transition ${assignBayNum === n ? "border-primary bg-primary/10 text-primary" : isEmpty ? "border-border hover:border-primary/50 hover:bg-secondary" : "border-border bg-secondary/30 text-muted-foreground cursor-not-allowed opacity-50"}`}>
                        {n}{!isEmpty && <div className="text-[9px] font-normal leading-none mt-0.5">busy</div>}
                      </button>
                    );
                  })}
                </div>
                {emptyBays.length === 0 && <p className="text-xs text-rose-600 mt-2">Lahat ng bay ay busy.</p>}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setAssigningJo(null)} className="flex-1 h-9 rounded-xl border border-border text-sm">Cancel</button>
                <button onClick={assignJoToBay} disabled={!assignBayNum || assignBusy}
                  className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
                  {assignBusy ? "Saving…" : `Assign sa Bay ${assignBayNum || "—"}`}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BayEditDialog bay={editing} onClose={() => setEditing(null)} onSaved={() => setEditing(null)} actorName={actorName} />

      <JobOrderDialog open={joOpen} editing={joEditing} customers={customers} vehicles={vehicles} onClose={() => setJoOpen(false)}
        onSave={async (v: any) => {
          if (joEditing) await joUpd.mutateAsync({ id: joEditing.id, patch: v });
          else await joIns.mutateAsync({ ...v, job_number: `JO-${Date.now().toString().slice(-8)}` });
          toast.success("Saved"); setJoOpen(false);
        }} />

      <JobHistoryDialog job={historyJob} onClose={() => setHistoryJob(null)} statusColors={JO_STATUS_COLORS} />
    </PageShell>
  );
}

// ── Bay Card ─────────────────────────────────────────────────────────────────
function BayCard({ bay, onClick }: { bay: BayRow; onClick: () => void }) {
  const meta = STATUS_META[bay.status];
  const Icon = meta.icon;
  const services = (bay.services ?? []) as ServiceItem[];
  const done = services.filter((s) => s.done).length;

  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl bg-card border-2 border-border shadow-soft p-4 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Bay {bay.bay_number}</span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
          <Icon className="h-3 w-3" />{meta.label}
        </span>
      </div>

      {bay.status === "empty" ? (
        <div className="py-4 text-center text-muted-foreground text-xs">— Available —</div>
      ) : (
        <>
          <div className="font-semibold text-sm truncate">{bay.customer_name || "—"}</div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">{bay.vehicle_info || "No vehicle"}</div>

          {services.length > 0 && (
            <ul className="mt-2.5 space-y-0.5">
              {services.slice(0, 4).map((s, i) => (
                <li key={i} className={`text-xs flex items-center gap-1.5 ${s.done ? "line-through text-muted-foreground" : ""}`}>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${s.done ? "bg-emerald-400" : "bg-amber-400"}`} />
                  {s.name}
                </li>
              ))}
              {services.length > 4 && (
                <li className="text-[10px] text-muted-foreground ml-3.5">+{services.length - 4} more</li>
              )}
            </ul>
          )}

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>{services.length > 0 ? `${done}/${services.length} done` : ""}</span>
              <span className="font-semibold">{bay.progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${bay.progress}%` }}
              />
            </div>
          </div>

          {bay.mechanic_name && (
            <div className="mt-2.5 text-[10px] text-muted-foreground">
              Mekaniko: <span className="font-semibold text-foreground">{bay.mechanic_name}</span>
            </div>
          )}
          {bay.updated_by_name && (
            <div className="text-[10px] text-muted-foreground/60 mt-0.5">
              ni {bay.updated_by_name}
            </div>
          )}
        </>
      )}
    </button>
  );
}

// ── Edit Dialog ──────────────────────────────────────────────────────────────
function BayEditDialog({ bay, onClose, onSaved, actorName }: { bay: BayRow | null; onClose: () => void; onSaved: () => void; actorName: string }) {
  const qc = useQueryClient();
  const { data: employees = [] } = useEmployees();
  const [saving, setSaving] = useState(false);

  // Form state — reset on open
  const [status, setStatus] = useState<BayStatus>("empty");
  const [customerName, setCustomerName] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [mechanicName, setMechanicName] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [newService, setNewService] = useState("");
  const [showEmpPicker, setShowEmpPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bay) return;
    setStatus(bay.status);
    setCustomerName(bay.customer_name ?? "");
    setVehicleInfo(bay.vehicle_info ?? "");
    setMechanicName(bay.mechanic_name ?? "");
    setServices((bay.services ?? []) as ServiceItem[]);
    setProgress(bay.progress);
    setNotes(bay.notes ?? "");
    setNewService("");
    setShowEmpPicker(false);
  }, [bay?.bay_number]);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowEmpPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addService = () => {
    const s = newService.trim();
    if (!s) return;
    setServices((prev) => [...prev, { name: s, done: false }]);
    setNewService("");
  };

  const toggleService = (i: number) =>
    setServices((prev) => prev.map((s, idx) => idx === i ? { ...s, done: !s.done } : s));

  const removeService = (i: number) =>
    setServices((prev) => prev.filter((_, idx) => idx !== i));

  const clearBay = async () => {
    if (!bay) return;
    if (!confirm(`Clear Bay ${bay.bay_number}? This resets it to empty.`)) return;
    setSaving(true);
    try {
      const prevCustomer = bay.customer_name;
      await saveBay({
        bay_number: bay.bay_number,
        status: "empty",
        customer_name: null,
        vehicle_info: null,
        mechanic_name: null,
        services: [],
        progress: 0,
        notes: null,
        started_at: null,
        updated_by_name: actorName,
      });
      await supabase.from("notifications").insert({
        title: `Bay ${bay.bay_number}: Cleared`,
        body: `Bay ${bay.bay_number}${prevCustomer ? ` (${prevCustomer})` : ""} ay na-clear ni ${actorName}.`,
        severity: "info",
        category: "ops",
        audience_role: "owner",
        link: "/bays",
      });
      qc.invalidateQueries({ queryKey: ["bay_queue"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(`Bay ${bay.bay_number} cleared`);
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to clear bay");
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    if (!bay) return;
    setSaving(true);
    try {
      const patch: any = {
        bay_number: bay.bay_number,
        status,
        customer_name: customerName || null,
        vehicle_info: vehicleInfo || null,
        mechanic_name: mechanicName || null,
        services,
        progress,
        notes: notes || null,
        updated_by_name: actorName,
      };
      if (status !== "empty" && !bay.started_at) patch.started_at = new Date().toISOString();
      if (status === "empty") { patch.started_at = null; }
      await saveBay(patch);

      // Notify owner on key status changes
      const statusChanged = status !== bay.status;
      if (statusChanged) {
        const statusLabel = STATUS_META[status].label;
        const notifSeverity = status === "done" ? "success" : status === "in_progress" ? "info" : "info";
        await supabase.from("notifications").insert({
          title: `Bay ${bay.bay_number}: ${statusLabel}`,
          body: `${customerName || "Bay " + bay.bay_number} → ${statusLabel}${mechanicName ? ` · ${mechanicName}` : ""} (ni ${actorName})`,
          severity: notifSeverity,
          category: "ops",
          audience_role: "owner",
          link: "/bays",
        });
        qc.invalidateQueries({ queryKey: ["notifications"] });
      }

      qc.invalidateQueries({ queryKey: ["bay_queue"] });
      toast.success(`Bay ${bay.bay_number} updated`);
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const mechanics = employees.filter((e: any) => e.status === "active");

  if (!bay) return null;

  return (
    <Dialog open={!!bay} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bay {bay.bay_number} — Update</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Status */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const m = STATUS_META[s];
                const Icon = m.icon;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition ${
                      status === s ? `${m.bg} ${m.color} border-current` : "border-border hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />{m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer + Vehicle */}
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold block">
              Customer Name
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className="mt-1 w-full h-9 px-3 rounded-xl border border-border bg-card text-sm"
              />
            </label>
            <label className="text-xs font-semibold block">
              Vehicle
              <input
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                placeholder="e.g. Toyota Vios · ABC 123"
                className="mt-1 w-full h-9 px-3 rounded-xl border border-border bg-card text-sm"
              />
            </label>
          </div>

          {/* Mechanic */}
          <div className="relative" ref={pickerRef}>
            <label className="text-xs font-semibold block mb-1">Mekaniko</label>
            <div className="flex gap-2">
              <input
                value={mechanicName}
                onChange={(e) => setMechanicName(e.target.value)}
                placeholder="Pangalan ng mekaniko"
                className="flex-1 h-9 px-3 rounded-xl border border-border bg-card text-sm"
              />
              <button
                type="button"
                onClick={() => setShowEmpPicker((v) => !v)}
                className="h-9 px-2.5 rounded-xl border border-border hover:bg-secondary inline-flex items-center gap-1 text-xs"
              >
                Pick <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            {showEmpPicker && (
              <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-auto rounded-xl border border-border bg-card shadow-lg">
                {mechanics.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-muted-foreground">No active employees found.</div>
                ) : mechanics.map((e: any) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => { setMechanicName(`${e.first_name} ${e.last_name}`); setShowEmpPicker(false); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 border-b border-border last:border-0"
                  >
                    {e.first_name} {e.last_name}
                    {e.employee_number && <span className="text-[10px] text-muted-foreground ml-2">#{e.employee_number}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">Services / Ginagawa</label>
            <div className="space-y-1.5 mb-2">
              {services.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-2">Walang services pa. Mag-add sa baba.</div>
              )}
              {services.map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleService(i)}
                    className={`h-4 w-4 shrink-0 rounded border ${s.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-background"} flex items-center justify-center`}
                  >
                    {s.done && <CheckCircle2 className="h-3 w-3" />}
                  </button>
                  <span className={`flex-1 text-sm ${s.done ? "line-through text-muted-foreground" : ""}`}>{s.name}</span>
                  <button type="button" onClick={() => removeService(i)} className="text-muted-foreground hover:text-rose-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                placeholder="Add service (e.g. Oil Change, Brake Check…)"
                className="flex-1 h-9 px-3 rounded-xl border border-border bg-card text-sm"
              />
              <button
                type="button"
                onClick={addService}
                className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />Add
              </button>
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="text-xs font-semibold block mb-1">
              Progress — <span className="text-primary font-bold">{progress}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold block mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Mga notes para sa bay na ito…"
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm resize-none"
            />
          </div>

          {bay.started_at && (
            <div className="text-[10px] text-muted-foreground">
              Started: {format(new Date(bay.started_at), "MMM d, yyyy · h:mm a")}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={clearBay}
              disabled={saving || bay.status === "empty"}
              className="h-9 px-3 rounded-xl border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50 disabled:opacity-40"
            >
              Clear Bay
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="h-9 px-4 rounded-xl border border-border text-sm">
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Job Order Dialog ──────────────────────────────────────────────────────────
function JobOrderDialog({ open, editing, customers, vehicles, onClose, onSave }: any) {
  const [v, setV] = useState<any>({});
  useMemo(() => setV(editing ?? { customer_id: "", vehicle_id: "", description: "", status: "pending", labor_cost: 0, parts_cost: 0, total: 0 }), [open, editing]);
  const total = Number(v.labor_cost || 0) + Number(v.parts_cost || 0);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing ? "Edit Job Order" : "New Job Order"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <JoField label="Customer">
            <select value={v.customer_id ?? ""} onChange={(e) => setV({ ...v, customer_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">—</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </JoField>
          <JoField label="Vehicle">
            <select value={v.vehicle_id ?? ""} onChange={(e) => setV({ ...v, vehicle_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">—</option>{vehicles.map((x: any) => <option key={x.id} value={x.id}>{x.make} {x.model} · {x.plate_number}</option>)}
            </select>
          </JoField>
          <JoField label="Description">
            <textarea value={v.description ?? ""} onChange={(e) => setV({ ...v, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-border" />
          </JoField>
          <div className="grid grid-cols-3 gap-2">
            <JoField label="Labor"><AmountInput value={v.labor_cost ?? null} onChange={(val) => setV({ ...v, labor_cost: val })} className="w-full h-10 px-3 rounded-lg border border-border" /></JoField>
            <JoField label="Parts"><AmountInput value={v.parts_cost ?? null} onChange={(val) => setV({ ...v, parts_cost: val })} className="w-full h-10 px-3 rounded-lg border border-border" /></JoField>
            <JoField label="Total"><div className="h-10 px-3 inline-flex items-center font-bold">{peso(total)}</div></JoField>
          </div>
          <button onClick={() => onSave({ ...v, total })} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Job History Dialog ────────────────────────────────────────────────────────
function JobHistoryDialog({ job, onClose, statusColors }: { job: any | null; onClose: () => void; statusColors: Record<string, string> }) {
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
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">Loading…</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No status changes recorded yet.</div>
          ) : (history as any[]).map((h: any) => (
            <div key={h.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                {h.from_status && <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[h.from_status] ?? ""}`}>{h.from_status.replace("_", " ")}</span>}
                {h.from_status && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[h.to_status] ?? ""}`}>{h.to_status.replace("_", " ")}</span>
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

function JoField({ label, children }: any) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
