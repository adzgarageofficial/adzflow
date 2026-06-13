import { createFileRoute } from "@tanstack/react-router";
import adzLogo from "@/assets/adz-logo.png";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Wrench, Clock, AlertCircle, CircleDot, Users } from "lucide-react";

// Standalone customer lounge display — no auth required, public read on bay_queue.
// Put this on a TV/monitor screen in the waiting area. URL: /bay-display
export const Route = createFileRoute("/bay-display")({ component: BayDisplayPage });

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

const STATUS_META: Record<BayStatus, { label: string; bg: string; text: string; border: string; icon: any; glow: string }> = {
  empty:         { label: "Available",     bg: "bg-gray-900/60",    text: "text-gray-400",    border: "border-gray-700/40",  icon: CircleDot,    glow: "" },
  waiting:       { label: "Waiting",       bg: "bg-amber-950/60",   text: "text-amber-300",   border: "border-amber-600/50", icon: Clock,        glow: "shadow-amber-900/40" },
  in_progress:   { label: "In Progress",   bg: "bg-blue-950/60",    text: "text-blue-300",    border: "border-blue-500/50",  icon: Wrench,       glow: "shadow-blue-900/50" },
  quality_check: { label: "Quality Check", bg: "bg-violet-950/60",  text: "text-violet-300",  border: "border-violet-500/50",icon: AlertCircle,  glow: "shadow-violet-900/40" },
  done:          { label: "Ready",         bg: "bg-emerald-950/60", text: "text-emerald-300", border: "border-emerald-500/50",icon: CheckCircle2, glow: "shadow-emerald-900/50" },
};

type QueueRow = {
  id: string;
  customer_name: string;
  vehicle_info: string | null;
  plate_number: string | null;
  services: { name: string; qty: number; price: number }[];
  queued_at: string;
};

function useLiveBays() {
  const qc = useQueryClient();

  useEffect(() => {
    const ch = supabase
      .channel("bay-display-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "bay_queue" }, () => {
        qc.invalidateQueries({ queryKey: ["bay_queue_display"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "service_queue" }, () => {
        qc.invalidateQueries({ queryKey: ["service_queue_display"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const bays = useQuery<BayRow[]>({
    queryKey: ["bay_queue_display"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("bay_queue")
        .select("*")
        .order("bay_number", { ascending: true });
      if (error) throw error;
      return (data ?? []) as BayRow[];
    },
    refetchInterval: 15_000,
  });

  const queue = useQuery<QueueRow[]>({
    queryKey: ["service_queue_display"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("service_queue")
        .select("id,customer_name,vehicle_info,plate_number,services,queued_at")
        .eq("status", "waiting")
        .order("queued_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as QueueRow[];
    },
    refetchInterval: 15_000,
  });

  return { bays, queue };
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function BayDisplayPage() {
  const { bays: { data: bays = [], isLoading }, queue: { data: waitingQueue = [] } } = useLiveBays();
  const now = useClock();

  const displayBays: (BayRow | null)[] = Array.from({ length: 8 }, (_, i) =>
    bays.find((b) => b.bay_number === i + 1) ?? null,
  );

  const activeCount = bays.filter((b) => b.status !== "empty").length;

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white overflow-hidden flex flex-col">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-4">
          <img src={adzLogo} alt="ADZ Garage" className="h-12 w-12 rounded-xl object-cover" />
          <div>
            <div className="text-xl font-black tracking-wider text-white leading-none">ADZ GARAGE</div>
            <div className="text-xs text-gray-400 tracking-[0.2em] uppercase mt-0.5">Service Bay Status</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Active Bays</div>
            <div className="text-2xl font-black text-white">{activeCount} <span className="text-sm text-gray-400 font-normal">/ 8</span></div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Sa Pila</div>
            <div className="text-2xl font-black text-amber-300">{waitingQueue.length}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black tabular-nums tracking-tight text-white">
              {now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {now.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            LIVE
          </div>
        </div>
      </header>

      {/* ── Body: Bay Grid + Waiting Queue ── */}
      <main className="flex-1 flex gap-4 p-6 min-h-0">
        {/* Bay Grid */}
        <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-4">
          {displayBays.map((bay, i) =>
            bay ? (
              <BayDisplayCard key={bay.bay_number} bay={bay} />
            ) : (
              <div
                key={i}
                className="rounded-2xl border border-gray-800 bg-gray-900/40 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-gray-700 font-black text-2xl">BAY {i + 1}</div>
                  {isLoading && <div className="text-xs text-gray-600 mt-1">Loading…</div>}
                </div>
              </div>
            ),
          )}
        </div>

        {/* Waiting Queue Sidebar */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Users className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-amber-400">Sa Pila</span>
            <span className="ml-auto text-sm font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
              {waitingQueue.length}
            </span>
          </div>

          {waitingQueue.length === 0 ? (
            <div className="flex-1 flex items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/40">
              <div className="text-center text-gray-600">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <div className="text-sm">Walang naghihintay</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
              {waitingQueue.map((row, idx) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-amber-700/40 bg-amber-950/40 p-4 flex gap-3 items-start"
                >
                  <div className="h-9 w-9 shrink-0 rounded-full bg-amber-500/20 text-amber-300 grid place-items-center font-black text-lg">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="font-black text-base text-white leading-tight">{row.customer_name}</div>
                    {row.vehicle_info && (
                      <div className="text-sm font-semibold text-amber-300">{row.vehicle_info}</div>
                    )}
                    {row.plate_number && (
                      <div className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 inline-block px-2 py-0.5 rounded">
                        {row.plate_number}
                      </div>
                    )}
                    {row.services.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {row.services.map((s, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60 shrink-0" />
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 px-8 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600">
        <span>ADZ Garage Enterprise Suite</span>
        <span>Updates automatically every few seconds</span>
        <span>Staff: update via Bay Queue in the admin panel</span>
      </footer>
    </div>
  );
}

function BayDisplayCard({ bay }: { bay: BayRow }) {
  const meta = STATUS_META[bay.status];
  const Icon = meta.icon;
  const services = (bay.services ?? []) as ServiceItem[];
  const done = services.filter((s) => s.done).length;
  const isEmpty = bay.status === "empty";

  return (
    <div
      className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-5 flex flex-col gap-3 transition-all duration-500 ${meta.glow ? `shadow-xl ${meta.glow}` : ""}`}
    >
      {/* Bay number + status */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-500">Bay {bay.bay_number}</div>
        <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/30 ${meta.text}`}>
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CircleDot className="h-8 w-8 mx-auto text-gray-700 mb-2" />
            <div className="text-gray-600 text-sm font-semibold">Available</div>
          </div>
        </div>
      ) : (
        <>
          {/* Customer + Vehicle */}
          <div className="flex-1 min-h-0">
            <div className="text-white font-black text-lg leading-tight truncate">
              {bay.customer_name || "—"}
            </div>
            <div className={`text-sm ${meta.text} font-semibold truncate mt-0.5`}>
              {bay.vehicle_info || "—"}
            </div>

            {/* Services */}
            {services.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {services.slice(0, 5).map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                        s.done ? "bg-emerald-500/30 text-emerald-400" : "bg-white/10 text-gray-500"
                      }`}
                    >
                      {s.done ? "✓" : "○"}
                    </span>
                    <span className={`text-sm ${s.done ? "line-through text-gray-600" : "text-gray-200"}`}>
                      {s.name}
                    </span>
                  </li>
                ))}
                {services.length > 5 && (
                  <li className="text-xs text-gray-600 ml-6">+{services.length - 5} more</li>
                )}
              </ul>
            )}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className={`font-black ${meta.text}`}>{bay.progress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-black/40 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  bay.status === "done" ? "bg-emerald-500" :
                  bay.status === "quality_check" ? "bg-violet-500" :
                  bay.status === "in_progress" ? "bg-blue-500" :
                  "bg-amber-500"
                }`}
                style={{ width: `${bay.progress}%` }}
              />
            </div>
          </div>

          {/* Mechanic */}
          {bay.mechanic_name && (
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <Wrench className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-gray-400">Mekaniko:</span>
              <span className="text-xs font-bold text-white truncate">{bay.mechanic_name}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
