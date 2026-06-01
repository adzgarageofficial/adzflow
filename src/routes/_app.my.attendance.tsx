import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { useEmployees, useAttendanceLogs } from "@/lib/db";
import { useMemo, useState } from "react";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/my/attendance")({ component: MyAttendance });

function fmt(t?: string | null) {
  return t ? new Date(t).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) : "—";
}

function statusTone(s: string) {
  return {
    present: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    late: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    absent: "bg-red-500/15 text-red-400 border-red-500/30",
    on_leave: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    holiday: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function MyAttendance() {
  const { currentUser } = useRbac();
  const { data: employees = [] } = useEmployees();
  const me = employees.find((e: any) => e.email === currentUser.email) ?? employees[0];
  const today = new Date().toISOString().slice(0, 10);
  const [month, setMonth] = useState(today.slice(0, 7));
  const monthStart = month + "-01";
  const monthEnd = month + "-31";

  const { data: logs = [] } = useAttendanceLogs({ from: monthStart, to: monthEnd, employeeId: me?.id });
  const todayLog = logs.find((l: any) => l.log_date === today);

  const summary = useMemo(() => {
    const present = logs.filter((l: any) => l.status === "present" || l.status === "late").length;
    const absent = logs.filter((l: any) => l.status === "absent").length;
    const late = logs.reduce((s: number, l: any) => s + (l.late_minutes || 0), 0);
    const overtime = logs.reduce((s: number, l: any) => s + Number(l.overtime_hours || 0), 0);
    const total = logs.reduce((s: number, l: any) => s + Number(l.total_hours || 0), 0);
    return { present, absent, late, overtime, total };
  }, [logs]);

  return (
    <PageShell title="My Attendance" subtitle="Your time logs and history">
      <SubNav items={MY_NAV} label="Self-Service" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Today · {today}</div>
              <div className="font-semibold">{todayLog ? `Status: ${todayLog.status}` : "Not yet clocked in"}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-xs text-muted-foreground">Time In</div>
              <div className="text-xl font-bold mt-1">{fmt(todayLog?.time_in)}</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-xs text-muted-foreground">Time Out</div>
              <div className="text-xl font-bold mt-1">{fmt(todayLog?.time_out)}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => toast.info("Use a kiosk or QR scanner to clock in. Contact your HR for setup.")}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              <LogIn className="h-4 w-4" /> Clock In
            </button>
            <button
              onClick={() => toast.info("Use a kiosk or QR scanner to clock out.")}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Clock Out
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">This Month</div>
          <div className="space-y-3 text-sm">
            <Row label="Present days" value={summary.present} />
            <Row label="Absent days" value={summary.absent} />
            <Row label="Late minutes" value={summary.late} />
            <Row label="Overtime hours" value={summary.overtime.toFixed(1)} />
            <Row label="Total hours" value={summary.total.toFixed(1)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Attendance History</h3>
          </div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Time In</th>
                <th className="text-left px-4 py-2">Time Out</th>
                <th className="text-right px-4 py-2">Hours</th>
                <th className="text-right px-4 py-2">Late (m)</th>
                <th className="text-right px-4 py-2">OT (h)</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No logs for this month.</td></tr>
              ) : logs.map((l: any) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-2">{l.log_date}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-0.5 text-[11px] rounded-md border ${statusTone(l.status)}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{fmt(l.time_in)}</td>
                  <td className="px-4 py-2">{fmt(l.time_out)}</td>
                  <td className="px-4 py-2 text-right">{Number(l.total_hours || 0).toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{l.late_minutes || 0}</td>
                  <td className="px-4 py-2 text-right">{Number(l.overtime_hours || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}