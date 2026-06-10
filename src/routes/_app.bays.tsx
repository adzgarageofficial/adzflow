import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEmployees } from "@/lib/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Wrench, Clock, CheckCircle2, AlertCircle, CircleDot,
  Plus, Trash2, ExternalLink, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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

async function saveBay(patch: Partial<BayRow> & { bay_number: number }) {
  const { bay_number, ...rest } = patch;
  const { error } = await (supabase as any)
    .from("bay_queue")
    .update(rest)
    .eq("bay_number", bay_number);
  if (error) throw error;
}

// ── Page ────────────────────────────────────────────────────────────────────
function BaysPage() {
  const { data: bays = [], isLoading } = useBays();
  const [editing, setEditing] = useState<BayRow | null>(null);

  // Pad to 8 slots while data loads
  const displayBays: (BayRow | null)[] = Array.from({ length: 8 }, (_, i) =>
    bays.find((b) => b.bay_number === i + 1) ?? null,
  );

  return (
    <PageShell
      title="Bay Queue"
      subtitle="8-bay live status board — mechanics update from here, customers see it on the lounge screen."
      actions={
        <a
          href="/bay-display"
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Customer Display
        </a>
      }
    >
      {isLoading ? (
        <div className="text-center py-24 text-muted-foreground text-sm">Loading bays…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {displayBays.map((bay, i) =>
            bay ? (
              <BayCard key={bay.bay_number} bay={bay} onClick={() => setEditing(bay)} />
            ) : (
              <div key={i} className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                Bay {i + 1} — loading
              </div>
            ),
          )}
        </div>
      )}

      <BayEditDialog
        bay={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
        }}
      />
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
        </>
      )}
    </button>
  );
}

// ── Edit Dialog ──────────────────────────────────────────────────────────────
function BayEditDialog({ bay, onClose, onSaved }: { bay: BayRow | null; onClose: () => void; onSaved: () => void }) {
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
      });
      qc.invalidateQueries({ queryKey: ["bay_queue"] });
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
      };
      if (status !== "empty" && !bay.started_at) patch.started_at = new Date().toISOString();
      if (status === "empty") { patch.started_at = null; }
      await saveBay(patch);
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
