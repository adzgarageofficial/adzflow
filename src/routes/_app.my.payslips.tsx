import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { useEmployees, usePayslips, peso } from "@/lib/db";
import { useMemo, useState } from "react";
import { Banknote, Download, FileText } from "lucide-react";
import { downloadElementAsPdf } from "@/lib/pdf";

export const Route = createFileRoute("/_app/my/payslips")({ component: MyPayslips });

function MyPayslips() {
  const { currentUser } = useRbac();
  const { data: employees = [] } = useEmployees();
  const { data: allSlips = [] } = usePayslips();
  const me = employees.find((e: any) => e.email === currentUser.email) ?? employees[0];

  const payslips = useMemo(
    () =>
      (allSlips as any[])
        .filter((p) => p.employee_id === me?.id)
        .sort((a, b) => (b.period?.period_start ?? "").localeCompare(a.period?.period_start ?? "")),
    [allSlips, me?.id],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const selected = payslips.find((p) => p.id === selectedId) ?? payslips[0];

  const ytdGross = payslips.reduce((s, p) => s + Number(p.gross_pay || 0), 0);
  const ytdNet = payslips.reduce((s, p) => s + Number(p.net_pay || 0), 0);

  return (
    <PageShell title="My Payslips" subtitle="Salary breakdown and history">
      <SubNav items={MY_NAV} label="Self-Service" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card label="Basic Salary" value={peso(Number(me?.basic_salary || 0))} />
        <Card label="YTD Gross" value={peso(ytdGross)} />
        <Card label="YTD Net Pay" value={peso(ytdNet)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Payslip History</h3>
          </div>
          <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
            {payslips.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No payslips yet.</p>
            ) : (
              payslips.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-4 hover:bg-secondary/40 transition ${selected?.id === p.id ? "bg-accent/40" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{p.period?.cutoff_label ?? p.period?.period_code ?? "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.payslip_number}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{peso(Number(p.net_pay || 0))}</div>
                      <div className="text-[10px] text-muted-foreground">net</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          {selected ? (
            <>
              <div className="flex items-start justify-between p-6 pb-0">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Payslip</div>
                  <h2 className="text-xl font-bold">{selected.period?.cutoff_label ?? selected.period?.period_code ?? "—"}</h2>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{selected.payslip_number}</div>
                </div>
                <button
                  onClick={() =>
                    downloadElementAsPdf(
                      document.getElementById(`my-payslip-${selected.id}`),
                      `Payslip-${selected.payslip_number}`,
                    )
                  }
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border text-sm hover:bg-secondary"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>

              <div id={`my-payslip-${selected.id}`} className="p-6 bg-card">
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Earnings</div>
                  <div className="space-y-2 text-sm">
                    <Line label="Basic Pay" value={peso(Number(selected.basic_pay || 0))} />
                    <Line label="Allowance" value={peso(Number(selected.allowance || 0))} />
                    {Number(selected.overtime_pay) > 0 && (
                      <Line label="Overtime Pay" value={peso(Number(selected.overtime_pay))} />
                    )}
                    {Number(selected.commission) > 0 && (
                      <Line label="Commission" value={peso(Number(selected.commission))} />
                    )}
                    {Number(selected.holiday_pay) > 0 && (
                      <Line label="Holiday Pay" value={peso(Number(selected.holiday_pay))} />
                    )}
                    {Number(selected.other_earnings) > 0 && (
                      <Line label="Other Earnings" value={peso(Number(selected.other_earnings))} />
                    )}
                    <Line label="Gross Pay" value={peso(Number(selected.gross_pay || 0))} bold />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Deductions</div>
                  <div className="space-y-2 text-sm">
                    <Line label="SSS" value={peso(Number(selected.sss || 0))} negative />
                    <Line label="PhilHealth" value={peso(Number(selected.philhealth || 0))} negative />
                    <Line label="Pag-IBIG" value={peso(Number(selected.pagibig || 0))} negative />
                    {Number(selected.late_deduction) > 0 && (
                      <Line label="Late Deduction" value={peso(Number(selected.late_deduction))} negative />
                    )}
                    {Number(selected.other_deductions) > 0 && (
                      <Line label="Other Deductions" value={peso(Number(selected.other_deductions))} negative />
                    )}
                    <Line label="Total Deductions" value={peso(Number(selected.total_deductions || 0))} negative bold />
                  </div>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Net Pay</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{peso(Number(selected.net_pay || 0))}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">Select a payslip to view details.</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Line({ label, value, bold, negative }: { label: string; value: string; bold?: boolean; negative?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "border-t border-border pt-2 font-semibold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={negative ? "text-red-400" : ""}>{negative ? "−" : ""}{value}</span>
    </div>
  );
}
