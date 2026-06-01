import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TIME_NAV } from "@/components/sub-nav";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Timer, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  useOvertimeRequests,
  useEmployees,
  useInsert,
  useUpdate,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/overtime")({ component: OvertimePage });

function statusTone(s: string) {
  return {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    cancelled: "bg-secondary text-muted-foreground border-border",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function OvertimePage() {
  const { data: requests = [], refetch } = useOvertimeRequests();
  const { data: employees = [] } = useEmployees();
  const insert = useInsert<any>("overtime_requests");
  const update = useUpdate<any>("overtime_requests");
  const [open, setOpen] = useState(false);

  const pending = requests.filter((r: any) => r.status === "pending").length;
  const approved = requests.filter((r: any) => r.status === "approved").length;
  const totalHours = requests
    .filter((r: any) => r.status === "approved")
    .reduce((s: number, r: any) => s + Number(r.hours || 0), 0);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = fd.get("ot_date") as string;
    const startT = fd.get("start_time") as string;
    const endT = fd.get("end_time") as string;
    const start = new Date(`${date}T${startT}`);
    const end = new Date(`${date}T${endT}`);
    const hours = Math.max(0, (end.getTime() - start.getTime()) / 3600000);
    try {
      await insert.mutateAsync({
        employee_id: fd.get("employee_id"),
        ot_date: date,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        hours: Number(hours.toFixed(2)),
        reason: fd.get("reason"),
        status: "pending",
      });
      toast.success("OT request filed");
      setOpen(false);
    } catch {}
  };

  const decide = async (id: string, status: "approved" | "rejected") => {
    const { data: u } = await supabase.auth.getUser();
    await update.mutateAsync({
      id,
      patch: {
        status,
        approved_by: u.user?.id || null,
        approved_at: new Date().toISOString(),
      },
    });
    toast.success(`OT ${status}`);
    refetch();
  };

  return (
    <PageShell
      title="Overtime"
      subtitle="File at approve ang overtime requests ng employees."
      actions={
        <button
          onClick={() =>
      setOpen(true)}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground shadow-glow inline-flex items-center gap-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> File OT Request
        </button>
      }
    >
      <SubNav items={TIME_NAV} label="Time & Attendance" />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="glass-card rounded-2xl p-5">
          <Clock className="h-5 w-5 text-amber-400" />
          <div className="mt-3 text-2xl font-bold">{pending}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Pending</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <div className="mt-3 text-2xl font-bold">{approved}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Approved</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Timer className="h-5 w-5 text-primary" />
          <div className="mt-3 text-2xl font-bold">{totalHours.toFixed(1)}h</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Total Approved Hours</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-3">Employee</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Time</th>
                <th className="text-right p-3">Hours</th>
                <th className="text-left p-3">Reason</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    Walang OT requests pa.
                  </td>
                </tr>
              ) : (
                requests.map((r: any) => (
                  <tr key={r.id} className="border-t border-border/50">
                    <td className="p-3 font-medium">{r.employee?.first_name} {r.employee?.last_name}</td>
                    <td className="p-3 text-muted-foreground">{r.ot_date}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(r.start_time).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })} –{" "}
                      {new Date(r.end_time).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="p-3 text-right font-semibold">{Number(r.hours).toFixed(2)}</td>
                    <td className="p-3 max-w-xs truncate text-muted-foreground">{r.reason}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusTone(r.status)}`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === "pending" && (
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => decide(r.id, "approved")}
                            className="h-8 w-8 grid place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => decide(r.id, "rejected")}
                            className="h-8 w-8 grid place-items-center rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>File Overtime Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <select name="employee_id" required className="input">
              <option value="">Select employee</option>
              {employees.map((e: any) => (
                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
              ))}
            </select>
            <label className="text-xs">
              OT Date
              <input name="ot_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="input mt-1" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Start
                <input name="start_time" type="time" required defaultValue="17:00" className="input mt-1" />
              </label>
              <label className="text-xs">
                End
                <input name="end_time" type="time" required defaultValue="20:00" className="input mt-1" />
              </label>
            </div>
            <textarea name="reason" required placeholder="Reason for overtime..." className="input min-h-[80px]" />
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">Submit Request</button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}