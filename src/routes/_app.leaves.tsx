import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TIME_NAV } from "@/components/sub-nav";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plane, Plus, CheckCircle2, XCircle, Clock, Calendar, Wallet, Users2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import {
  useLeaveTypes,
  useLeaveRequests,
  useLeaveBalances,
  useEmployees,
  useInsert,
  useUpdate,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/leaves")({ component: LeavesPage });

function statusTone(s: string) {
  return {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    cancelled: "bg-secondary text-muted-foreground border-border",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function daysBetween(a: string, b: string) {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.max(1, Math.round((d2 - d1) / 86400000) + 1);
}

function LeavesPage() {
  const { data: requests = [], refetch: refetchReq } = useLeaveRequests();
  const { data: types = [], refetch: refetchTypes } = useLeaveTypes();
  const { data: balances = [], refetch: refetchBal } = useLeaveBalances();
  const { data: employees = [] } = useEmployees();
  const insertReq = useInsert<any>("leave_requests");
  const updateReq = useUpdate<any>("leave_requests");
  const insertType = useInsert<any>("leave_types");
  const insertBal = useInsert<any>("leave_balances");

  const [tab, setTab] = useState<"requests" | "balances" | "types">("requests");
  const [openReq, setOpenReq] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openBal, setOpenBal] = useState(false);

  const stats = useMemo(() => {
    const pending = requests.filter((r: any) => r.status === "pending").length;
    const approved = requests.filter((r: any) => r.status === "approved").length;
    const onLeaveToday = requests.filter((r: any) => {
      if (r.status !== "approved") return false;
      const t = new Date().toISOString().slice(0, 10);
      return r.start_date <= t && r.end_date >= t;
    }).length;
    const totalDays = requests
      .filter((r: any) => r.status === "approved")
      .reduce((s: number, r: any) => s + Number(r.days_count || 0), 0);
    return { pending, approved, onLeaveToday, totalDays };
  }, [requests]);

  const submitReq = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const start = fd.get("start_date") as string;
    const end = fd.get("end_date") as string;
    const days = daysBetween(start, end);
    const reqNum = `LR-${Date.now().toString().slice(-8)}`;
    try {
      await insertReq.mutateAsync({
        request_number: reqNum,
        employee_id: fd.get("employee_id"),
        leave_type_id: fd.get("leave_type_id"),
        start_date: start,
        end_date: end,
        days_count: days,
        reason: fd.get("reason"),
        status: "pending",
      });
      toast.success(`Leave request ${reqNum} filed`);
      setOpenReq(false);
      refetchReq();
    } catch {}
  };

  const submitType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertType.mutateAsync({
        code: (fd.get("code") as string).toUpperCase(),
        name: fd.get("name"),
        description: fd.get("description") || null,
        is_paid: fd.get("is_paid") === "on",
        default_days_per_year: Number(fd.get("default_days_per_year") || 0),
        color: fd.get("color") || "#ef4444",
      });
      toast.success("Leave type added");
      setOpenType(false);
      refetchTypes();
    } catch {}
  };

  const submitBal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertBal.mutateAsync({
        employee_id: fd.get("employee_id"),
        leave_type_id: fd.get("leave_type_id"),
        year: Number(fd.get("year")),
        entitled_days: Number(fd.get("entitled_days") || 0),
        carried_over: Number(fd.get("carried_over") || 0),
      });
      toast.success("Balance set");
      setOpenBal(false);
      refetchBal();
    } catch {}
  };

  const decide = async (r: any, status: "approved" | "rejected", rejection?: string) => {
    const { data: u } = await supabase.auth.getUser();
    await updateReq.mutateAsync({
      id: r.id,
      patch: {
        status,
        approved_by: u.user?.id || null,
        approved_at: new Date().toISOString(),
        rejection_reason: rejection || null,
      },
    });
    // If approved, increment used_days in matching balance (best-effort)
    if (status === "approved") {
      const yr = new Date(r.start_date).getFullYear();
      const match = balances.find(
        (b: any) => b.employee_id === r.employee_id && b.leave_type_id === r.leave_type_id && b.year === yr,
      );
      if (match) {
        try {
          await (supabase as any)
            .from("leave_balances")
            .update({ used_days: Number(match.used_days || 0) + Number(r.days_count || 0) })
            .eq("id", match.id);
          refetchBal();
        } catch {}
      }
    }
    toast.success(`Leave ${status}`);
    refetchReq();
  };

  return (
    <PageShell
      title="Leave Management"
      subtitle="Vacation, sick, and other leave requests, balances, and approvals."
      actions={
        <button
          onClick={() =>
      setOpenReq(true)}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground shadow-glow inline-flex items-center gap-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> File Leave Request
        </button>
      }
    >
      <SubNav items={TIME_NAV} label="Time & Attendance" />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <KpiCard icon={Clock} tint="amber" label="Pending" value={stats.pending} />
        <KpiCard icon={CheckCircle2} tint="emerald" label="Approved" value={stats.approved} />
        <KpiCard icon={Users2} tint="sky" label="On Leave Today" value={stats.onLeaveToday} />
        <KpiCard icon={Calendar} tint="primary" label="Total Approved Days" value={stats.totalDays} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(["requests", "balances", "types"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 h-9 text-xs font-semibold uppercase tracking-wide rounded-lg border transition ${
              tab === t
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "requests" ? "Requests" : t === "balances" ? "Balances" : "Leave Types"}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Ref #</th>
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Dates</th>
                  <th className="text-right p-3">Days</th>
                  <th className="text-left p-3">Reason</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      No leave requests yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((r: any) => (
                    <tr key={r.id} className="border-t border-border/50">
                      <td className="p-3 font-mono text-xs text-muted-foreground">{r.request_number}</td>
                      <td className="p-3 font-medium">{r.employee?.first_name} {r.employee?.last_name}</td>
                      <td className="p-3">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            background: `${r.leave_type?.color || "#ef4444"}22`,
                            color: r.leave_type?.color || "#ef4444",
                            borderColor: `${r.leave_type?.color || "#ef4444"}55`,
                          }}
                        >
                          {r.leave_type?.code || "—"}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {r.start_date} → {r.end_date}
                      </td>
                      <td className="p-3 text-right font-semibold">{Number(r.days_count).toFixed(1)}</td>
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
                              onClick={() => decide(r, "approved")}
                              className="h-8 w-8 grid place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("Rejection reason?") || "Not approved";
                                decide(r, "rejected", reason);
                              }}
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
      )}

      {tab === "balances" && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setOpenBal(true)}
              className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Set Balance
            </button>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Employee</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-center p-3">Year</th>
                    <th className="text-right p-3">Entitled</th>
                    <th className="text-right p-3">Carried</th>
                    <th className="text-right p-3">Used</th>
                    <th className="text-right p-3">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {balances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-muted-foreground">
                        No leave balances set. Configure the yearly entitlement for each employee.
                      </td>
                    </tr>
                  ) : (
                    balances.map((b: any) => {
                      const remaining =
                        Number(b.entitled_days || 0) +
                        Number(b.carried_over || 0) -
                        Number(b.used_days || 0);
                      return (
                        <tr key={b.id} className="border-t border-border/50">
                          <td className="p-3 font-medium">{b.employee?.first_name} {b.employee?.last_name}</td>
                          <td className="p-3">
                            <span
                              className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                              style={{
                                background: `${b.leave_type?.color || "#ef4444"}22`,
                                color: b.leave_type?.color || "#ef4444",
                                borderColor: `${b.leave_type?.color || "#ef4444"}55`,
                              }}
                            >
                              {b.leave_type?.name}
                            </span>
                          </td>
                          <td className="p-3 text-center">{b.year}</td>
                          <td className="p-3 text-right">{Number(b.entitled_days).toFixed(1)}</td>
                          <td className="p-3 text-right text-muted-foreground">{Number(b.carried_over).toFixed(1)}</td>
                          <td className="p-3 text-right text-amber-400">{Number(b.used_days).toFixed(1)}</td>
                          <td className="p-3 text-right font-bold text-emerald-400">{remaining.toFixed(1)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "types" && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setOpenType(true)}
              className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Leave Type
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {types.map((t: any) => (
              <div key={t.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl grid place-items-center"
                      style={{ background: `${t.color}22`, color: t.color }}
                    >
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{t.code}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      t.is_paid
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-secondary text-muted-foreground border-border"
                    }`}
                  >
                    {t.is_paid ? "PAID" : "UNPAID"}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" />
                  {Number(t.default_days_per_year).toFixed(0)} days / year default
                </div>
                {t.description && <p className="text-xs text-muted-foreground mt-2">{t.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Request Dialog */}
      <Dialog open={openReq} onOpenChange={(o) => !o && setOpenReq(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>File Leave Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitReq} className="space-y-3">
            <select name="employee_id" required className="input">
              <option value="">Select employee</option>
              {employees.map((e: any) => (
                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
              ))}
            </select>
            <select name="leave_type_id" required className="input">
              <option value="">Select leave type</option>
              {types.map((t: any) => (
                <option key={t.id} value={t.id}>{t.code} — {t.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Start Date
                <input name="start_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="input mt-1" />
              </label>
              <label className="text-xs">
                End Date
                <input name="end_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="input mt-1" />
              </label>
            </div>
            <textarea name="reason" required placeholder="Reason for leave..." className="input min-h-[80px]" />
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">Submit Request</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Leave Type Dialog */}
      <Dialog open={openType} onOpenChange={(o) => !o && setOpenType(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Leave Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitType} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs col-span-1">
                Code
                <input name="code" required placeholder="VL" className="input mt-1 uppercase" />
              </label>
              <label className="text-xs col-span-2">
                Name
                <input name="name" required placeholder="Vacation Leave" className="input mt-1" />
              </label>
            </div>
            <textarea name="description" placeholder="Description (optional)" className="input min-h-[60px]" />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Default Days / Year
                <input name="default_days_per_year" type="number" min="0" step="0.5" defaultValue="5" className="input mt-1" />
              </label>
              <label className="text-xs">
                Color
                <input name="color" type="color" defaultValue="#ef4444" className="input mt-1 h-10 p-1" />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="is_paid" defaultChecked className="rounded" />
              Paid leave
            </label>
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">Save Leave Type</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Set Balance Dialog */}
      <Dialog open={openBal} onOpenChange={(o) => !o && setOpenBal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Leave Balance</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitBal} className="space-y-3">
            <select name="employee_id" required className="input">
              <option value="">Select employee</option>
              {employees.map((e: any) => (
                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
              ))}
            </select>
            <select name="leave_type_id" required className="input">
              <option value="">Select leave type</option>
              {types.map((t: any) => (
                <option key={t.id} value={t.id}>{t.code} — {t.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs">
                Year
                <input name="year" type="number" required defaultValue={new Date().getFullYear()} className="input mt-1" />
              </label>
              <label className="text-xs">
                Entitled
                <input name="entitled_days" type="number" min="0" step="0.5" defaultValue="5" className="input mt-1" />
              </label>
              <label className="text-xs">
                Carried Over
                <input name="carried_over" type="number" min="0" step="0.5" defaultValue="0" className="input mt-1" />
              </label>
            </div>
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">Save Balance</button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: any;
  label: string;
  value: number;
  tint: "amber" | "emerald" | "sky" | "primary";
}) {
  const tints = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    sky: "text-sky-400",
    primary: "text-primary",
  };
  return (
    <div className="glass-card rounded-2xl p-5">
      <Icon className={`h-5 w-5 ${tints[tint]}`} />
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}