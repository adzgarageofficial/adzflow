import { createFileRoute } from "@tanstack/react-router";
import adzLogo from "@/assets/adz-logo.png";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Wrench, Clock, PackageSearch, Car } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Lounge display — meant to be shown on a tablet/TV in the customer waiting area
// so people can follow their vehicle's progress without asking the front desk.
// No login required: data comes only from the narrow public_service_queue() RPC,
// which deliberately excludes phone/email/cost and shows just the customer's first name.
export const Route = createFileRoute("/service-queue")({ component: ServiceQueuePage });

type QueueRow = {
  id: string;
  job_number: string;
  status: "pending" | "in_progress" | "awaiting_parts" | "completed" | "cancelled";
  vehicle_label: string | null;
  customer_name: string | null;
  technician_name: string | null;
  queued_at: string;
};

function useLiveQueue() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("service-queue-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "job_orders" }, () => {
        qc.invalidateQueries({ queryKey: ["public_service_queue"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return useQuery<QueueRow[]>({
    queryKey: ["public_service_queue"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("public_service_queue");
      if (error) throw error;
      return (data ?? []) as QueueRow[];
    },
    refetchInterval: 30_000,
  });
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function ServiceQueuePage() {
  const { data: rows = [], isLoading } = useLiveQueue();
  const now = useClock();

  const servicing = rows.filter((r) => r.status === "in_progress");
  const waitingParts = rows.filter((r) => r.status === "awaiting_parts");
  const queued = rows.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen w-full bg-surface px-6 py-8 md:px-12 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-3">
            <img src={adzLogo} alt="ADZ Garage" className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Service Queue</h1>
              <p className="text-sm text-muted-foreground">ADZ Garage — live status of vehicles being serviced today</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold tabular-nums tracking-tight">{now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="text-center py-24 text-muted-foreground">Loading queue…</div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card shadow-soft py-24 text-center">
            <Car className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-lg font-semibold">No vehicles in queue right now</p>
            <p className="text-sm text-muted-foreground mt-1">Check back in a bit — the board updates automatically.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <QueueSection
              title="Now Servicing"
              icon={Wrench}
              tone="emerald"
              emptyLabel="No vehicle currently being worked on."
              rows={servicing}
              big
            />
            <QueueSection
              title="Waiting on Parts"
              icon={PackageSearch}
              tone="amber"
              emptyLabel="Nothing waiting on parts."
              rows={waitingParts}
            />
            <QueueSection
              title="In Queue"
              icon={Clock}
              tone="slate"
              emptyLabel="Queue is empty."
              rows={queued}
              numbered
            />
          </div>
        )}
      </div>
    </div>
  );
}

const TONES: Record<string, { badge: string; icon: string; ring: string }> = {
  emerald: { badge: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: "text-emerald-600", ring: "border-emerald-200" },
  amber: { badge: "bg-amber-50 text-amber-700 border-amber-100", icon: "text-amber-600", ring: "border-amber-200" },
  slate: { badge: "bg-secondary text-muted-foreground border-border", icon: "text-muted-foreground", ring: "border-border" },
};

function QueueSection({ title, icon: Icon, tone, emptyLabel, rows, big, numbered }: {
  title: string; icon: any; tone: "emerald" | "amber" | "slate"; emptyLabel: string; rows: QueueRow[]; big?: boolean; numbered?: boolean;
}) {
  const t = TONES[tone];
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${t.icon}`} />
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${t.badge}`}>{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground text-center">{emptyLabel}</div>
      ) : (
        <div className={big ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-2.5"}>
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={`rounded-2xl bg-card border-2 ${t.ring} shadow-soft flex items-center justify-between gap-4 ${big ? "p-6" : "p-4"}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {numbered && (
                  <div className="h-9 w-9 shrink-0 rounded-full bg-secondary grid place-items-center font-bold text-sm">{i + 1}</div>
                )}
                <div className="min-w-0">
                  <div className={`font-bold tracking-tight truncate ${big ? "text-xl" : "text-base"}`}>{r.vehicle_label ?? "Vehicle"}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {r.customer_name ? `${r.customer_name} · ` : ""}Ticket {r.job_number}
                    {r.technician_name ? ` · w/ ${r.technician_name}` : ""}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs font-semibold ${t.icon}`}>{formatDistanceToNow(new Date(r.queued_at), { addSuffix: false })}</div>
                <div className="text-[11px] text-muted-foreground">{r.status === "in_progress" ? "in progress" : r.status === "awaiting_parts" ? "waiting on parts" : "waiting"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
