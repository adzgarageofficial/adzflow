import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Banknote,
  Plus,
  Calculator,
  CheckCircle2,
  Printer,
  Wallet,
  Users2,
  Calendar,
  TrendingUp,
  X,
  Download,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { downloadElementAsPdf } from "@/lib/pdf";
import {
  usePayrollPeriods,
  usePayslips,
  useEmployees,
  useInsert,
  useUpdate,
  peso,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import {
  computePayroll,
  countWorkingDays,
  buildSemiMonthlyPeriods,
} from "@/lib/payroll-calc";

export const Route = createFileRoute("/_app/payroll")({ component: PayrollPage });

// Mechanic commission: % of labor_cost on completed jobs, or a flat amount per
// completed job — based on the employee's commission_type/commission_rate.
// technician_id on job_orders points at auth.users(id), i.e. employees.user_id —
// NOT employees.id — so jobs must be matched on emp.user_id.
function computeJobCommission(emp: any, completedJobs: any[]) {
  const techJobs = emp.user_id ? completedJobs.filter((j: any) => j.technician_id === emp.user_id) : [];
  const laborRevenue = techJobs.reduce((s: number, j: any) => s + Number(j.labor_cost || 0), 0);
  const rate = Number(emp.commission_rate || 0);
  const commission = emp.commission_type === "fixed" ? rate * techJobs.length : laborRevenue * (rate / 100);
  return { jobCount: techJobs.length, laborRevenue, commission: Math.round(commission * 100) / 100 };
}

function statusTone(s: string) {
  return {
    draft: "bg-secondary text-muted-foreground border-border",
    processing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    posted: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    finalized: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function PayrollPage() {
  const { data: periods = [], refetch: refetchPeriods } = usePayrollPeriods();
  const { data: employees = [] } = useEmployees();
  const insertPeriod = useInsert<any>("payroll_periods");
  const updatePeriod = useUpdate<any>("payroll_periods");

  const [selected, setSelected] = useState<string | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [openSlip, setOpenSlip] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  const { data: payslips = [], refetch: refetchSlips } = usePayslips(selected || undefined);

  const stats = useMemo(() => {
    const totalGross = periods.reduce((s: number, p: any) => s + Number(p.total_gross || 0), 0);
    const totalNet = periods.reduce((s: number, p: any) => s + Number(p.total_net || 0), 0);
    const paidCount = periods.filter((p: any) => p.status === "paid").length;
    return { totalGross, totalNet, paidCount, periodCount: periods.length };
  }, [periods]);

  const createPeriod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const year = Number(fd.get("year"));
    const month = Number(fd.get("month")) - 1;
    const cutoff = fd.get("cutoff") as "1st" | "2nd";
    const { first, second } = buildSemiMonthlyPeriods(year, month);
    const data = cutoff === "1st" ? first : second;
    const code = `PR-${year}${String(month + 1).padStart(2, "0")}-${cutoff === "1st" ? "01" : "02"}`;
    try {
      const row = await insertPeriod.mutateAsync({
        period_code: code,
        ...data,
        status: "draft",
      });
      toast.success(`Period ${code} created`);
      setOpenNew(false);
      setSelected((row as any).id);
      refetchPeriods();
    } catch {}
  };

  const generatePayslips = async (period: any) => {
    if (!employees.length) {
      toast.error("Walang employees pa.");
      return;
    }
    setGenerating(true);
    try {
      // Fetch attendance for period
      const { data: logs } = await (supabase as any)
        .from("attendance_logs")
        .select("employee_id, regular_hours, overtime_hours, late_minutes, log_date")
        .gte("log_date", period.period_start)
        .lte("log_date", period.period_end);

      // Fetch completed job orders for the period — basis for mechanic commission
      const { data: completedJobs } = await (supabase as any)
        .from("job_orders")
        .select("technician_id, labor_cost, completed_at")
        .eq("status", "completed")
        .gte("completed_at", period.period_start)
        .lte("completed_at", `${period.period_end} 23:59:59`);

      const workingDays = countWorkingDays(period.period_start, period.period_end);
      let totalGross = 0;
      let totalDed = 0;
      let totalNet = 0;
      let created = 0;

      for (const emp of employees.filter((e: any) => e.status === "active")) {
        const empLogs = (logs || []).filter((l: any) => l.employee_id === emp.id);
        const daysWorked = new Set(empLogs.map((l: any) => l.log_date)).size;
        const otHours = empLogs.reduce((s: number, l: any) => s + Number(l.overtime_hours || 0), 0);
        const lateMin = empLogs.reduce((s: number, l: any) => s + Number(l.late_minutes || 0), 0);
        const { commission } = computeJobCommission(emp, completedJobs || []);

        const breakdown = computePayroll({
          basicMonthly: Number(emp.basic_salary || 0),
          allowanceMonthly: Number(emp.allowance || 0),
          daysWorked: daysWorked || workingDays, // assume full if no logs
          workingDaysInPeriod: workingDays,
          overtimeHours: otHours,
          lateMinutes: lateMin,
          hourlyRate: Number(emp.hourly_rate || 0) || undefined,
          commission,
        });

        const slipNum = `PS-${period.period_code}-${emp.employee_number}`;
        const regHours = empLogs.reduce((s: number, l: any) => s + Number(l.regular_hours || 0), 0);
        const { error } = await (supabase as any).from("payslips").upsert(
          {
            payslip_number: slipNum,
            period_id: period.id,
            employee_id: emp.id,
            days_worked: daysWorked || workingDays,
            regular_hours: regHours,
            overtime_hours: otHours,
            late_minutes: lateMin,
            basic_pay: breakdown.basicPay,
            allowance: breakdown.allowance,
            overtime_pay: breakdown.overtimePay,
            commission: breakdown.commission,
            gross_pay: breakdown.grossPay,
            sss: breakdown.sss,
            philhealth: breakdown.philhealth,
            pagibig: breakdown.pagibig,
            withholding_tax: breakdown.withholdingTax,
            late_deduction: breakdown.lateDeduction,
            total_deductions: breakdown.totalDeductions,
            net_pay: breakdown.netPay,
            status: "draft",
          },
          { onConflict: "period_id,employee_id" },
        );
        if (!error) {
          created++;
          totalGross += breakdown.grossPay;
          totalDed += breakdown.totalDeductions;
          totalNet += breakdown.netPay;
        }
      }

      await updatePeriod.mutateAsync({
        id: period.id,
        patch: {
          status: "processing",
          total_gross: totalGross,
          total_deductions: totalDed,
          total_net: totalNet,
        },
      });

      toast.success(`Generated ${created} payslips`);
      refetchSlips();
      refetchPeriods();
    } catch (e: any) {
      toast.error(e.message || "Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  const markPaid = async (period: any) => {
    await updatePeriod.mutateAsync({ id: period.id, patch: { status: "paid" } });
    // mark all slips paid
    await (supabase as any).from("payslips").update({ status: "paid" }).eq("period_id", period.id);
    toast.success("Marked as paid");
    refetchPeriods();
    refetchSlips();
  };

  const selectedPeriod = periods.find((p: any) => p.id === selected);

  // Owner-facing per-mechanic commission report for the selected period —
  // recomputed from completed job orders so it's accurate even before payslips
  // are (re)generated. Internal visibility only; never printed on payslips/receipts.
  const [commissionReport, setCommissionReport] = useState<any[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mechanics = employees.filter((e: any) => e.user_id && Number(e.commission_rate || 0) > 0);
      if (!selectedPeriod || mechanics.length === 0) {
        if (!cancelled) setCommissionReport([]);
        return;
      }
      const { data: jobs } = await (supabase as any)
        .from("job_orders")
        .select("technician_id, labor_cost, completed_at")
        .eq("status", "completed")
        .gte("completed_at", selectedPeriod.period_start)
        .lte("completed_at", `${selectedPeriod.period_end} 23:59:59`);
      if (cancelled) return;
      const rows = mechanics
        .map((emp: any) => ({ employee: emp, ...computeJobCommission(emp, jobs || []) }))
        .filter((r) => r.jobCount > 0)
        .sort((a, b) => b.commission - a.commission);
      setCommissionReport(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPeriod?.id, employees]);

  return (
    <PageShell
      title="Payroll"
      subtitle="Semi-monthly payroll (15th & 30th) — auto-compute SSS, PhilHealth, Pag-IBIG, BIR tax."
      actions={
        <button
          onClick={() => setOpenNew(true)}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground shadow-glow inline-flex items-center gap-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> New Payroll Period
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <KpiCard icon={Calendar} tint="primary" label="Total Periods" value={stats.periodCount.toString()} />
        <KpiCard icon={CheckCircle2} tint="emerald" label="Paid Periods" value={stats.paidCount.toString()} />
        <KpiCard icon={TrendingUp} tint="sky" label="Total Gross" value={peso(stats.totalGross)} />
        <KpiCard icon={Wallet} tint="amber" label="Total Net Paid" value={peso(stats.totalNet)} />
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* Periods List */}
        <div className="glass-card rounded-2xl p-2 space-y-1 max-h-[600px] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Payroll Periods
          </div>
          {periods.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Walang periods pa. Create your first.
            </div>
          ) : (
            periods.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full text-left px-3 py-3 rounded-xl transition ${
                  selected === p.id ? "bg-accent shadow-soft" : "hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{p.period_code}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusTone(p.status)}`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {p.period_start} → {p.period_end}
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Net</span>
                  <span className="font-bold text-emerald-400">{peso(Number(p.total_net))}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Period detail */}
        <div className="glass-card rounded-2xl p-5">
          {!selectedPeriod ? (
            <div className="h-full grid place-items-center py-20 text-center">
              <div>
                <Banknote className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Select a payroll period to view payslips</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {selectedPeriod.cutoff_label} Cutoff · Pay date {selectedPeriod.pay_date}
                  </div>
                  <h2 className="text-2xl font-bold mt-1">{selectedPeriod.period_code}</h2>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedPeriod.period_start} → {selectedPeriod.period_end}
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedPeriod.status === "draft" && (
                    <button
                      onClick={() => generatePayslips(selectedPeriod)}
                      disabled={generating}
                      className="h-9 px-3 rounded-lg bg-primary text-primary-foreground shadow-glow inline-flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                      {generating ? "Computing..." : "Generate Payslips"}
                    </button>
                  )}
                  {selectedPeriod.status === "processing" && (
                    <>
                      <button
                        onClick={() => generatePayslips(selectedPeriod)}
                        disabled={generating}
                        className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Calculator className="h-3.5 w-3.5" /> Recompute
                      </button>
                      <button
                        onClick={() => markPaid(selectedPeriod)}
                        className="h-9 px-3 rounded-lg bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Paid
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <MiniStat label="Gross" value={peso(Number(selectedPeriod.total_gross))} tint="sky" />
                <MiniStat label="Deductions" value={peso(Number(selectedPeriod.total_deductions))} tint="amber" />
                <MiniStat label="Net Pay" value={peso(Number(selectedPeriod.total_net))} tint="emerald" />
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="text-left p-3">Employee</th>
                      <th className="text-right p-3">Days</th>
                      <th className="text-right p-3">Gross</th>
                      <th className="text-right p-3">Deductions</th>
                      <th className="text-right p-3">Net</th>
                      <th className="text-center p-3">Status</th>
                      <th className="text-right p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-muted-foreground">
                          Walang payslips pa. Click "Generate Payslips" para mag-auto compute.
                        </td>
                      </tr>
                    ) : (
                      payslips.map((s: any) => (
                        <tr key={s.id} className="border-t border-border/50 hover:bg-secondary/30">
                          <td className="p-3">
                            <div className="font-medium">{s.employee?.first_name} {s.employee?.last_name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{s.employee?.employee_number}</div>
                          </td>
                          <td className="p-3 text-right">{Number(s.days_worked).toFixed(1)}</td>
                          <td className="p-3 text-right">{peso(Number(s.gross_pay))}</td>
                          <td className="p-3 text-right text-amber-400">{peso(Number(s.total_deductions))}</td>
                          <td className="p-3 text-right font-bold text-emerald-400">{peso(Number(s.net_pay))}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusTone(s.status)}`}>
                              {s.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setOpenSlip(s)}
                              className="h-7 px-2 rounded-md bg-secondary/60 text-[10px] font-semibold inline-flex items-center gap-1 hover:bg-secondary"
                            >
                              <Printer className="h-3 w-3" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {commissionReport.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                    <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Mechanic Commission — {selectedPeriod.period_code}
                    </h3>
                    <span className="text-[9px] text-muted-foreground/70">(internal only · not on customer receipts)</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border/60">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="text-left p-3">Mechanic</th>
                          <th className="text-right p-3">Completed Jobs</th>
                          <th className="text-right p-3">Labor Revenue</th>
                          <th className="text-right p-3">Rate</th>
                          <th className="text-right p-3">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissionReport.map((r) => (
                          <tr key={r.employee.id} className="border-t border-border/50 hover:bg-secondary/30">
                            <td className="p-3">
                              <div className="font-medium">{r.employee.first_name} {r.employee.last_name}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">{r.employee.employee_number}</div>
                            </td>
                            <td className="p-3 text-right">{r.jobCount}</td>
                            <td className="p-3 text-right">{peso(r.laborRevenue)}</td>
                            <td className="p-3 text-right text-muted-foreground">
                              {r.employee.commission_type === "fixed" ? `${peso(r.employee.commission_rate)} / job` : `${Number(r.employee.commission_rate)}%`}
                            </td>
                            <td className="p-3 text-right font-bold text-emerald-400">{peso(r.commission)}</td>
                          </tr>
                        ))}
                        <tr className="border-t border-border bg-secondary/20">
                          <td className="p-3 font-semibold" colSpan={4}>Total Commission</td>
                          <td className="p-3 text-right font-bold text-emerald-400">
                            {peso(commissionReport.reduce((s, r) => s + r.commission, 0))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* New Period Dialog */}
      <Dialog open={openNew} onOpenChange={(o) => !o && setOpenNew(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Payroll Period</DialogTitle>
          </DialogHeader>
          <form onSubmit={createPeriod} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Year
                <input name="year" type="number" required defaultValue={new Date().getFullYear()} className="input mt-1" />
              </label>
              <label className="text-xs">
                Month
                <select name="month" required defaultValue={new Date().getMonth() + 1} className="input mt-1">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="text-xs">
              Cutoff
              <select name="cutoff" required defaultValue="1st" className="input mt-1">
                <option value="1st">1st Cutoff (1-15, pay on 15th)</option>
                <option value="2nd">2nd Cutoff (16-end, pay on 30th)</option>
              </select>
            </label>
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">
              Create Period
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payslip Viewer / Print */}
      <Dialog open={!!openSlip} onOpenChange={(o) => !o && setOpenSlip(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {openSlip && <PayslipView slip={openSlip} onClose={() => setOpenSlip(null)} />}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function MiniStat({ label, value, tint }: { label: string; value: string; tint: "sky" | "amber" | "emerald" }) {
  const tints = { sky: "text-sky-400", amber: "text-amber-400", emerald: "text-emerald-400" };
  return (
    <div className="rounded-xl bg-secondary/30 border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-bold ${tints[tint]}`}>{value}</div>
    </div>
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
  value: string;
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

function PayslipView({ slip, onClose }: { slip: any; onClose: () => void }) {
  const emp = slip.employee || {};
  const period = slip.period || {};

  const handlePrint = () => {
    const html = document.getElementById(`payslip-${slip.id}`)?.outerHTML;
    if (!html) return;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(`
      <html><head><title>${slip.payslip_number}</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:24px;color:#111;background:#fff;}
        .h{display:flex;justify-content:space-between;border-bottom:2px solid #dc2626;padding-bottom:12px;margin-bottom:16px;}
        .h h1{margin:0;font-size:20px;color:#dc2626;letter-spacing:.06em;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:16px;}
        table{width:100%;border-collapse:collapse;margin-top:8px;}
        td{padding:6px 0;font-size:13px;}
        td.r{text-align:right;font-variant-numeric:tabular-nums;}
        h3{margin:16px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#666;border-bottom:1px solid #ddd;padding-bottom:4px;}
        .net{background:#dc2626;color:#fff;padding:16px;margin-top:16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;}
        .net .v{font-size:24px;font-weight:700;}
        .meta{font-size:11px;color:#666;}
      </style></head><body>${html}</body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/60">
        <div className="text-sm font-semibold">Payslip Preview</div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadElementAsPdf(document.getElementById(`payslip-${slip.id}`), `Payslip-${slip.payslip_number}`)}
            className="h-8 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary"
          >
            <Download className="h-3.5 w-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div id={`payslip-${slip.id}`} className="p-6 bg-card">
        <div className="h flex items-start justify-between border-b-2 border-primary pb-3 mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-primary tracking-wider">ADZ GARAGE</h1>
            <div className="meta text-[11px] text-muted-foreground mt-0.5">Enterprise Suite · Payslip</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-bold">{slip.payslip_number}</div>
            <div className="meta text-[11px] text-muted-foreground mt-0.5">
              Pay Date: {period.pay_date}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4 text-sm">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border pb-1 mb-2">
              Employee
            </h3>
            <div className="font-semibold">{emp.first_name} {emp.last_name}</div>
            <div className="text-xs text-muted-foreground">#{emp.employee_number}</div>
            <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
              {emp.tin_number && <div>TIN: {emp.tin_number}</div>}
              {emp.sss_number && <div>SSS: {emp.sss_number}</div>}
              {emp.philhealth_number && <div>PhilHealth: {emp.philhealth_number}</div>}
              {emp.pagibig_number && <div>Pag-IBIG: {emp.pagibig_number}</div>}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border pb-1 mb-2">
              Pay Period
            </h3>
            <div className="text-xs space-y-1">
              <Row label="Period" value={`${period.period_start} → ${period.period_end}`} />
              <Row label="Cutoff" value={period.cutoff_label} />
              <Row label="Days Worked" value={Number(slip.days_worked).toFixed(1)} />
              <Row label="Regular Hours" value={Number(slip.regular_hours).toFixed(2)} />
              <Row label="OT Hours" value={Number(slip.overtime_hours).toFixed(2)} />
              {emp.bank_name && <Row label="Bank" value={`${emp.bank_name} · ${emp.bank_account_number || "—"}`} />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border pb-1 mb-2">
              Earnings
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <PayRow label="Basic Pay" value={slip.basic_pay} />
                <PayRow label="Allowance" value={slip.allowance} />
                <PayRow label="Overtime Pay" value={slip.overtime_pay} />
                {Number(slip.commission) > 0 && <PayRow label="Commission" value={slip.commission} />}
                {Number(slip.holiday_pay) > 0 && <PayRow label="Holiday Pay" value={slip.holiday_pay} />}
                {Number(slip.other_earnings) > 0 && <PayRow label="Other" value={slip.other_earnings} />}
                <tr className="border-t border-border">
                  <td className="py-2 font-semibold">Gross Pay</td>
                  <td className="py-2 text-right font-bold text-sky-400">{peso(Number(slip.gross_pay))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border pb-1 mb-2">
              Deductions
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <PayRow label="SSS" value={slip.sss} />
                <PayRow label="PhilHealth" value={slip.philhealth} />
                <PayRow label="Pag-IBIG" value={slip.pagibig} />
                <PayRow label="Withholding Tax" value={slip.withholding_tax} />
                {Number(slip.late_deduction) > 0 && <PayRow label="Late / Undertime" value={slip.late_deduction} />}
                {Number(slip.other_deductions) > 0 && <PayRow label="Other" value={slip.other_deductions} />}
                <tr className="border-t border-border">
                  <td className="py-2 font-semibold">Total Deductions</td>
                  <td className="py-2 text-right font-bold text-amber-400">{peso(Number(slip.total_deductions))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="net mt-5 rounded-xl bg-gradient-red text-white px-5 py-4 flex items-center justify-between shadow-glow">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">Net Pay</div>
            <div className="text-xs opacity-80 mt-0.5">Amount payable on {period.pay_date}</div>
          </div>
          <div className="v text-2xl font-extrabold">{peso(Number(slip.net_pay))}</div>
        </div>

        <div className="mt-6 text-[10px] text-muted-foreground text-center">
          This is a system-generated payslip from ADZ Garage Enterprise Suite. No signature required.
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function PayRow({ label, value }: { label: string; value: number }) {
  return (
    <tr>
      <td className="py-1.5 text-muted-foreground">{label}</td>
      <td className="py-1.5 text-right font-medium">{peso(Number(value))}</td>
    </tr>
  );
}