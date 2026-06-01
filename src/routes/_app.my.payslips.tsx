import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { useEmployees } from "@/lib/db";
import { useMemo, useState } from "react";
import { Banknote, Download, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/my/payslips")({ component: MyPayslips });

function peso(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function MyPayslips() {
  const { currentUser } = useRbac();
  const { data: employees = [] } = useEmployees();
  const me = employees.find((e: any) => e.email === currentUser.email) ?? employees[0];

  const basic = Number(me?.basic_salary || 18000);
  const allowance = Number(me?.allowance || 1500);

  // Mock 6 months of payslips
  const payslips = useMemo(() => {
    const out: any[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
      const gross = basic + allowance;
      const sss = +(gross * 0.045).toFixed(2);
      const phic = +(gross * 0.02).toFixed(2);
      const pagibig = 100;
      const tax = +(Math.max(0, (gross - sss - phic - pagibig - 20833) * 0.15)).toFixed(2);
      const deductions = sss + phic + pagibig + tax;
      const net = +(gross - deductions).toFixed(2);
      out.push({
        id: `PS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`,
        period: d.toLocaleString("en-PH", { month: "long", year: "numeric" }),
        date: d.toISOString().slice(0, 10),
        gross, sss, phic, pagibig, tax, deductions, net,
      });
    }
    return out;
  }, [basic, allowance]);

  const [selected, setSelected] = useState(payslips[0]);
  const ytdGross = payslips.reduce((s, p) => s + p.gross, 0);
  const ytdNet = payslips.reduce((s, p) => s + p.net, 0);

  return (
    <PageShell title="My Payslips" subtitle="Salary breakdown and history">
      <SubNav items={MY_NAV} label="Self-Service" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card label="Basic Salary" value={peso(basic)} />
        <Card label="YTD Gross" value={peso(ytdGross)} />
        <Card label="YTD Net Pay" value={peso(ytdNet)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Payslip History</h3>
          </div>
          <div className="divide-y divide-border">
            {payslips.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left p-4 hover:bg-secondary/40 transition ${selected?.id === p.id ? "bg-accent/40" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{p.period}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{peso(p.net)}</div>
                    <div className="text-[10px] text-muted-foreground">net</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
          {selected && (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Payslip</div>
                  <h2 className="text-xl font-bold">{selected.period}</h2>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{selected.id}</div>
                </div>
                <button
                  onClick={() => toast.info("Download will be available once Payroll module goes live.")}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border text-sm hover:bg-secondary"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Earnings</div>
                <div className="space-y-2 text-sm">
                  <Line label="Basic Salary" value={peso(basic)} />
                  <Line label="Allowance" value={peso(allowance)} />
                  <Line label="Gross Pay" value={peso(selected.gross)} bold />
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Deductions</div>
                <div className="space-y-2 text-sm">
                  <Line label="SSS" value={peso(selected.sss)} negative />
                  <Line label="PhilHealth" value={peso(selected.phic)} negative />
                  <Line label="Pag-IBIG" value={peso(selected.pagibig)} negative />
                  <Line label="Withholding Tax" value={peso(selected.tax)} negative />
                  <Line label="Total Deductions" value={peso(selected.deductions)} negative bold />
                </div>
              </div>

              <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Net Pay</span>
                </div>
                <span className="text-2xl font-bold text-primary">{peso(selected.net)}</span>
              </div>
            </>
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