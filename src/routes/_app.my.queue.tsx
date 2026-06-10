import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { useEmployees, useJobOrders, useUpdate, useInsert, peso } from "@/lib/db";
import { useMemo, useState } from "react";
import { Wrench, PlayCircle, PackageSearch, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/my/queue")({ component: MyQueue });

const STATUS_LABEL: Record<string, string> = {
  pending: "Queued",
  in_progress: "In Progress",
  awaiting_parts: "Awaiting Parts",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  in_progress: "bg-blue-50 text-blue-700 border-blue-100",
  awaiting_parts: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

function MyQueue() {
  const { currentUser } = useRbac();
  const { data: employees = [] } = useEmployees();
  const { data: jobs = [], isLoading } = useJobOrders();
  const upd = useUpdate("job_orders");
  const addHistory = useInsert("job_order_status_history", ["job_order_status_history", "job_orders"]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const me = employees.find((e: any) => e.email === currentUser.email);

  // technician_id on job_orders points at the account/profile id (auth user),
  // which is the same id useRbac exposes as currentUser.id — match on that,
  // not on the employee record's own id.
  const myJobs = useMemo(
    () => jobs.filter((j: any) => j.technician_id && j.technician_id === currentUser.id),
    [jobs, currentUser.id],
  );

  const active = myJobs.filter((j: any) => j.status === "pending" || j.status === "in_progress" || j.status === "awaiting_parts");
  const recent = myJobs.filter((j: any) => j.status === "completed" || j.status === "cancelled").slice(0, 8);

  async function advance(job: any, toStatus: string) {
    setBusyId(job.id);
    try {
      const now = new Date().toISOString();
      const patch: Record<string, any> = { status: toStatus };
      if (toStatus === "in_progress" && !job.started_at) patch.started_at = now;
      if (toStatus === "completed") patch.completed_at = now;

      await upd.mutateAsync({ id: job.id, patch });
      await addHistory.mutateAsync({
        job_order_id: job.id,
        from_status: job.status,
        to_status: toStatus,
        changed_by: currentUser.id,
      } as any);
      toast.success(`${job.job_number} → ${STATUS_LABEL[toStatus]}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <PageShell title="My Queue" subtitle="Jobs assigned to you — update status as you work.">
      <SubNav items={MY_NAV} label="Self-Service" />

      {!me ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Couldn't match your account to an employee record. Ask an admin to link your email to your employee profile.
        </div>
      ) : isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading your jobs…</div>
      ) : active.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Wrench className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="font-semibold">No active jobs assigned to you right now</p>
          <p className="text-sm text-muted-foreground mt-1">New assignments will show up here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((j: any) => (
            <div key={j.id} className="rounded-2xl border border-border bg-card shadow-soft p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold tracking-tight">{j.job_number}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[j.status]}`}>
                      {STATUS_LABEL[j.status]}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {j.vehicle ? `${j.vehicle.make} ${j.vehicle.model} · ${j.vehicle.plate_number ?? "—"}` : "No vehicle on file"}
                    {j.customer?.full_name ? ` · ${j.customer.full_name}` : ""}
                  </div>
                  {j.description && <p className="text-sm mt-2 text-foreground/80 max-w-2xl">{j.description}</p>}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3.5 w-3.5" />
                    Queued {formatDistanceToNow(new Date(j.started_at ?? j.created_at), { addSuffix: true })}
                    <span className="mx-1">·</span>
                    Total {peso(Number(j.total ?? 0))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {j.status === "pending" && (
                    <ActionButton tone="blue" icon={PlayCircle} label="Start Job" busy={busyId === j.id} onClick={() => advance(j, "in_progress")} />
                  )}
                  {j.status === "in_progress" && (
                    <>
                      <ActionButton tone="purple" icon={PackageSearch} label="Awaiting Parts" busy={busyId === j.id} onClick={() => advance(j, "awaiting_parts")} />
                      <ActionButton tone="emerald" icon={CheckCircle2} label="Mark Complete" busy={busyId === j.id} onClick={() => advance(j, "completed")} />
                    </>
                  )}
                  {j.status === "awaiting_parts" && (
                    <>
                      <ActionButton tone="blue" icon={RotateCcw} label="Resume Job" busy={busyId === j.id} onClick={() => advance(j, "in_progress")} />
                      <ActionButton tone="emerald" icon={CheckCircle2} label="Mark Complete" busy={busyId === j.id} onClick={() => advance(j, "completed")} />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {me && recent.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recently finished</h3>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Job #</th>
                  <th className="text-left font-medium px-5 py-2.5">Vehicle</th>
                  <th className="text-left font-medium px-5 py-2.5">Status</th>
                  <th className="text-right font-medium px-5 py-2.5">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((j: any) => (
                  <tr key={j.id} className="border-t border-border">
                    <td className="px-5 py-2.5 font-medium">{j.job_number}</td>
                    <td className="px-5 py-2.5 text-xs text-muted-foreground">{j.vehicle ? `${j.vehicle.make} ${j.vehicle.model} · ${j.vehicle.plate_number ?? ""}` : "—"}</td>
                    <td className="px-5 py-2.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[j.status]}`}>{STATUS_LABEL[j.status]}</span>
                    </td>
                    <td className="px-5 py-2.5 text-right font-semibold">{peso(Number(j.total ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function ActionButton({ tone, icon: Icon, label, busy, onClick }: { tone: "blue" | "purple" | "emerald"; icon: any; label: string; busy?: boolean; onClick: () => void }) {
  const tones: Record<string, string> = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };
  return (
    <button
      disabled={busy}
      onClick={onClick}
      className={`h-10 px-4 rounded-xl text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft disabled:opacity-50 ${tones[tone]}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
