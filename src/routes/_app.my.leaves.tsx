import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { useEmployees, useLeaveRequests, useLeaveBalances, useLeaveTypes, useInsert } from "@/lib/db";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plane, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/my/leaves")({ component: MyLeaves });

function statusTone(s: string) {
  return {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    cancelled: "bg-secondary text-muted-foreground border-border",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function MyLeaves() {
  const { currentUser } = useRbac();
  const { data: employees = [] } = useEmployees();
  const me = employees.find((e: any) => e.email === currentUser.email) ?? employees[0];
  const { data: leaves = [] } = useLeaveRequests();
  const { data: types = [] } = useLeaveTypes();
  const { data: balances = [] } = useLeaveBalances(me?.id);
  const insertLeave = useInsert("leave_requests");

  const myLeaves = useMemo(
    () => leaves.filter((l: any) => l.employee_id === me?.id),
    [leaves, me],
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ leave_type_id: "", start_date: "", end_date: "", reason: "" });

  const submit = async () => {
    if (!me) return toast.error("No employee profile linked");
    if (!form.leave_type_id || !form.start_date || !form.end_date || !form.reason) {
      return toast.error("Complete all fields");
    }
    const d1 = new Date(form.start_date).getTime();
    const d2 = new Date(form.end_date).getTime();
    const days = Math.max(1, Math.round((d2 - d1) / 86400000) + 1);
    try {
      await insertLeave.mutateAsync({
        employee_id: me.id,
        leave_type_id: form.leave_type_id,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason,
        days_count: days,
        request_number: "LR-" + Date.now(),
        status: "pending",
      });
      toast.success("Leave request submitted");
      setOpen(false);
      setForm({ leave_type_id: "", start_date: "", end_date: "", reason: "" });
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    }
  };

  const stats = {
    pending: myLeaves.filter((l: any) => l.status === "pending").length,
    approved: myLeaves.filter((l: any) => l.status === "approved").length,
    rejected: myLeaves.filter((l: any) => l.status === "rejected").length,
  };

  return (
    <PageShell
      title="My Leave Requests"
      subtitle="File and track your time off"
      actions={
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> File Leave
        </button>
      }
    >
      <SubNav items={MY_NAV} label="Self-Service" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Pending" value={stats.pending} icon={Clock} tone="text-amber-400" />
        <Stat label="Approved" value={stats.approved} icon={CheckCircle2} tone="text-emerald-400" />
        <Stat label="Rejected" value={stats.rejected} icon={XCircle} tone="text-red-400" />
      </div>

      {balances.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft mb-6">
          <h3 className="font-semibold mb-3">Leave Balances</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {balances.map((b: any) => {
              const type = types.find((t: any) => t.id === b.leave_type_id);
              const remaining = Number(b.entitled_days || 0) + Number(b.carried_over || 0) - Number(b.used_days || 0);
              return (
                <div key={b.id} className="rounded-xl border border-border bg-surface p-3">
                  <div className="text-xs text-muted-foreground">{type?.name || "Leave"}</div>
                  <div className="text-lg font-bold mt-1">{remaining.toFixed(1)} <span className="text-xs text-muted-foreground">days</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Plane className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2">Request #</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Dates</th>
                <th className="text-right px-4 py-2">Days</th>
                <th className="text-left px-4 py-2">Reason</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No leave requests yet.</td></tr>
              ) : myLeaves.map((l: any) => {
                const type = types.find((t: any) => t.id === l.leave_type_id);
                return (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs">{l.request_number}</td>
                    <td className="px-4 py-2">{type?.name || "—"}</td>
                    <td className="px-4 py-2 text-xs">{l.start_date} → {l.end_date}</td>
                    <td className="px-4 py-2 text-right">{l.days_count}</td>
                    <td className="px-4 py-2 max-w-[280px] truncate">{l.reason}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex px-2 py-0.5 text-[11px] rounded-md border ${statusTone(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>File a Leave Request</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Leave Type</label>
              <select
                value={form.leave_type_id}
                onChange={(e) => setForm({ ...form, leave_type_id: e.target.value })}
                className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="">Select type…</option>
                {types.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Start Date</label>
                <input type="date" value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">End Date</label>
                <input type="date" value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button onClick={submit} className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium">
              Submit Request
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function Stat({ label, value, icon: Icon, tone }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}