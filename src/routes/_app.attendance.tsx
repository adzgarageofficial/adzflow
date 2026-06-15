import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TIME_NAV } from "@/components/sub-nav";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Clock,
  QrCode,
  ScanLine,
  LogIn,
  LogOut,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Scanner } from "@yudiel/react-qr-scanner";
import { supabase } from "@/integrations/supabase/client";
import { useAttendanceLogs, useEmployees, useEmployeeShifts } from "@/lib/db";
import { TableSkeleton, QueryError } from "@/components/query-states";

export const Route = createFileRoute("/_app/attendance")({ component: AttendancePage });

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(t?: string | null) {
  if (!t) return "—";
  return new Date(t).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    present: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    late: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    absent: "bg-red-500/15 text-red-400 border-red-500/30",
    half_day: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    on_leave: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    holiday: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  };
  return map[status] || "bg-secondary text-muted-foreground border-border";
}

function AttendancePage() {
  const today = todayStr();
  const { data: employees = [] } = useEmployees();
  const { data: empShifts = [] } = useEmployeeShifts();
  const { data: logs = [], refetch, isLoading: logsLoading, isError: logsError, error: logsErr } = useAttendanceLogs({ from: today, to: today });
  const { data: monthLogs = [] } = useAttendanceLogs({
    from: today.slice(0, 8) + "01",
    to: today,
  });

  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrEmp, setQrEmp] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const totals = useMemo(() => {
    const present = logs.filter((l: any) => l.status === "present" || l.status === "late").length;
    const late = logs.filter((l: any) => l.status === "late").length;
    const absent = Math.max(0, employees.length - present);
    const totalHours = logs.reduce((s: number, l: any) => s + Number(l.total_hours || 0), 0);
    return { present, late, absent, totalHours };
  }, [logs, employees]);

  /** Time in/out logic */
  const handleScan = async (rawCode: string) => {
    try {
      // Expected QR payload: ADZ:EMP:<employee_id>
      const parts = rawCode.split(":");
      const empId = parts.length >= 3 && parts[0] === "ADZ" ? parts[2] : rawCode;
      const emp = employees.find((e: any) => e.id === empId);
      if (!emp) {
        toast.error("Employee not found");
        return;
      }
      await punch(emp);
      setScannerOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Scan failed");
    }
  };

  const punch = async (emp: any) => {
    const today = todayStr();
    const { data: existing } = await supabase
      .from("attendance_logs")
      .select("*")
      .eq("employee_id", emp.id)
      .eq("log_date", today)
      .maybeSingle();

    const shiftAssign = empShifts.find((es: any) => es.employee_id === emp.id && es.is_active);
    const shift = shiftAssign?.shift;
    const now = new Date();

    if (!existing) {
      // Time in
      let status: "present" | "late" = "present";
      let late_minutes = 0;
      if (shift?.start_time) {
        const [h, m] = shift.start_time.split(":").map(Number);
        const shiftStart = new Date();
        shiftStart.setHours(h, m, 0, 0);
        const diff = Math.floor((now.getTime() - shiftStart.getTime()) / 60000);
        if (diff > (shift.grace_period_minutes || 10)) {
          status = "late";
          late_minutes = diff;
        }
      }
      const { error } = await supabase.from("attendance_logs").insert({
        employee_id: emp.id,
        shift_id: shiftAssign?.shift_id || null,
        log_date: today,
        time_in: now.toISOString(),
        status,
        late_minutes,
        method: "qr",
      });
      if (error) throw error;
      toast.success(`Time in: ${emp.first_name} ${emp.last_name}${late_minutes ? ` (Late ${late_minutes}m)` : ""}`);
    } else if (!existing.time_out) {
      // Time out
      const ti = new Date(existing.time_in!);
      const totalMs = now.getTime() - ti.getTime();
      const breakMins = shift?.break_minutes || 60;
      const totalHours = Math.max(0, totalMs / 3600000 - breakMins / 60);
      const regular = Math.min(8, totalHours);
      const overtime = Math.max(0, totalHours - 8);
      const { error } = await supabase
        .from("attendance_logs")
        .update({
          time_out: now.toISOString(),
          total_hours: Number(totalHours.toFixed(2)),
          regular_hours: Number(regular.toFixed(2)),
          overtime_hours: Number(overtime.toFixed(2)),
        })
        .eq("id", existing.id);
      if (error) throw error;
      toast.success(`Time out: ${emp.first_name} (${totalHours.toFixed(2)}h)`);
    } else {
      toast.info("Shift already completed for today.");
    }
    refetch();
  };

  const filteredEmployees = employees.filter((e: any) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
      e.employee_number?.toLowerCase().includes(q)
    );
  });

  return (
    <PageShell
      title="Attendance"
      subtitle="QR-based time in / out at daily logs."
      actions={
        <button
          onClick={() =>
      setScannerOpen(true)}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-2 text-sm font-semibold shadow-glow"
        >
          <ScanLine className="h-4 w-4" /> Scan QR
        </button>
      }
    >
      <SubNav items={TIME_NAV} label="Time & Attendance" />
      {/* KPI strip */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <KpiCard icon={CheckCircle2} label="Present Today" value={totals.present.toString()} tone="emerald" />
        <KpiCard icon={AlertCircle} label="Late" value={totals.late.toString()} tone="amber" />
        <KpiCard icon={Users} label="Absent" value={totals.absent.toString()} tone="red" />
        <KpiCard icon={Clock} label="Total Hours" value={totals.totalHours.toFixed(1) + "h"} tone="blue" />
      </div>

      <Tabs defaultValue="today">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="today" className="gap-2"><Calendar className="h-4 w-4" /> Today</TabsTrigger>
          <TabsTrigger value="month" className="gap-2"><Calendar className="h-4 w-4" /> This Month</TabsTrigger>
          <TabsTrigger value="qr" className="gap-2"><QrCode className="h-4 w-4" /> Employee QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-5">
          <LogsTable logs={logs} empty="No attendance logs for today." onPunch={punch} employees={employees} isLoading={logsLoading} isError={logsError} errorMsg={(logsErr as Error)?.message} onRetry={refetch} />
        </TabsContent>

        <TabsContent value="month" className="mt-5">
          <LogsTable logs={monthLogs} empty="No attendance logs this month." />
        </TabsContent>

        <TabsContent value="qr" className="mt-5">
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="input pl-9"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredEmployees.map((e: any) => (
              <button
                key={e.id}
                onClick={() => setQrEmp(e)}
                className="glass-card rounded-2xl p-4 text-left hover:shadow-glow transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center text-primary font-semibold">
                    {e.first_name?.[0]}{e.last_name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{e.first_name} {e.last_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{e.employee_number}</div>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <QrCode className="h-3.5 w-3.5" /> View QR
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* QR Scanner */}
      <Dialog open={scannerOpen} onOpenChange={(o) => !o && setScannerOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Employee QR</DialogTitle>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border border-border">
            {scannerOpen && (
              <Scanner
                onScan={(results) => {
                  if (results?.[0]?.rawValue) handleScan(results[0].rawValue);
                }}
                onError={() => {}}
                constraints={{ facingMode: "environment" }}
                styles={{ container: { width: "100%" } }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Point the camera at the employee's QR code to time-in / time-out.
          </p>
        </DialogContent>
      </Dialog>

      {/* QR Display */}
      <QrDisplayDialog emp={qrEmp} onClose={() => setQrEmp(null)} />
    </PageShell>
  );
}

function KpiCard({ icon: Icon, label, value, tone }: any) {
  const tones: Record<string, string> = {
    emerald: "from-emerald-500/20 to-transparent text-emerald-400",
    amber: "from-amber-500/20 to-transparent text-amber-400",
    red: "from-red-500/20 to-transparent text-red-400",
    blue: "from-blue-500/20 to-transparent text-blue-400",
  };
  return (
    <div className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${tones[tone]}`}>
      <Icon className="h-5 w-5 opacity-80" />
      <div className="mt-3 text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function LogsTable({
  logs,
  empty,
  onPunch,
  employees,
  isLoading,
  isError,
  errorMsg,
  onRetry,
}: {
  logs: any[];
  empty: string;
  onPunch?: (e: any) => void;
  employees?: any[];
  isLoading?: boolean;
  isError?: boolean;
  errorMsg?: string;
  onRetry?: () => void;
}) {
  if (isLoading) return <TableSkeleton rows={5} cols={onPunch ? 8 : 7} />;
  if (isError) return <QueryError message={errorMsg} onRetry={onRetry} />;
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left p-3">Employee</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Time In</th>
              <th className="text-left p-3">Time Out</th>
              <th className="text-right p-3">Hours</th>
              <th className="text-right p-3">OT</th>
              <th className="text-center p-3">Status</th>
              {onPunch && <th className="text-right p-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={onPunch ? 8 : 7} className="text-center text-muted-foreground py-10">
                  {empty}
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} className="border-t border-border/50">
                  <td className="p-3">
                    <div className="font-medium">{l.employee?.first_name} {l.employee?.last_name}</div>
                    <div className="text-xs text-muted-foreground">{l.employee?.employee_number}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{l.log_date}</td>
                  <td className="p-3"><span className="inline-flex items-center gap-1"><LogIn className="h-3 w-3 text-emerald-400" />{formatTime(l.time_in)}</span></td>
                  <td className="p-3"><span className="inline-flex items-center gap-1"><LogOut className="h-3 w-3 text-red-400" />{formatTime(l.time_out)}</span></td>
                  <td className="p-3 text-right font-semibold">{Number(l.total_hours || 0).toFixed(2)}</td>
                  <td className="p-3 text-right text-amber-400">{Number(l.overtime_hours || 0).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge(l.status)}`}>
                      {l.status?.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  {onPunch && employees && (
                    <td className="p-3 text-right">
                      {!l.time_out && (
                        <button
                          onClick={() => onPunch(employees.find((e: any) => e.id === l.employee_id))}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25"
                        >
                          Time Out
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QrDisplayDialog({ emp, onClose }: { emp: any | null; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (!emp) return;
    const payload = `ADZ:EMP:${emp.id}`;
    QRCode.toDataURL(payload, { width: 320, margin: 2, color: { dark: "#0d0d0d", light: "#ffffff" } }).then(setUrl);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, { width: 320, margin: 2 });
    }
  }, [emp]);

  const print = () => {
    const w = window.open("", "_blank", "width=420,height=560");
    if (!w || !emp) return;
    w.document.write(`
      <html><head><title>${emp.first_name} ${emp.last_name} QR</title>
      <style>body{font-family:sans-serif;text-align:center;padding:24px}</style></head>
      <body>
        <h2 style="margin:0">ADZ GARAGE</h2>
        <p style="color:#666;margin:4px 0 16px">Employee ID Card</p>
        <img src="${url}" style="width:280px;height:280px" />
        <h3 style="margin:16px 0 4px">${emp.first_name} ${emp.last_name}</h3>
        <p style="color:#666;margin:0">${emp.employee_number}</p>
        <script>window.onload=()=>{window.print();}</script>
      </body></html>
    `);
  };

  return (
    <Dialog open={!!emp} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{emp?.first_name} {emp?.last_name}</DialogTitle>
        </DialogHeader>
        {emp && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-3">{emp.employee_number}</div>
            <div className="bg-white p-4 rounded-2xl inline-block">
              <canvas ref={canvasRef} />
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <a href={url} download={`${emp.employee_number}-qr.png`} className="h-9 px-3 rounded-lg border border-border hover:bg-secondary text-xs inline-flex items-center">
                Download PNG
              </a>
              <button onClick={print} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                Print ID
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}