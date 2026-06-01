import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { useEmployees, useAttendanceLogs, useLeaveRequests } from "@/lib/db";
import { CalendarCheck, Plane, Banknote, Target, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/my/")({ component: MyOverview });

function MyOverview() {
  const { currentUser, currentRole } = useRbac();
  const { data: employees = [] } = useEmployees();
  const me = employees.find((e: any) => e.email === currentUser.email) ?? employees[0];
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 8) + "01";
  const { data: monthLogs = [] } = useAttendanceLogs({ from: monthStart, to: today, employeeId: me?.id });
  const { data: leaves = [] } = useLeaveRequests();
  const myLeaves = leaves.filter((l: any) => l.employee_id === me?.id);

  const presentDays = monthLogs.filter((l: any) => l.status === "present" || l.status === "late").length;
  const lateMinutes = monthLogs.reduce((s: number, l: any) => s + (l.late_minutes || 0), 0);
  const totalHours = monthLogs.reduce((s: number, l: any) => s + Number(l.total_hours || 0), 0);
  const pendingLeaves = myLeaves.filter((l: any) => l.status === "pending").length;

  const cards = [
    { label: "Days Present (MTD)", value: presentDays, icon: CalendarCheck, tone: "text-emerald-400" },
    { label: "Total Hours (MTD)", value: totalHours.toFixed(1) + "h", icon: Clock, tone: "text-blue-400" },
    { label: "Late Minutes (MTD)", value: lateMinutes, icon: TrendingUp, tone: "text-amber-400" },
    { label: "Pending Leaves", value: pendingLeaves, icon: Plane, tone: "text-purple-400" },
  ];

  const quickLinks = [
    { title: "My Attendance", desc: "View time logs & history", url: "/my/attendance", icon: CalendarCheck },
    { title: "My Leaves", desc: "File and track leave requests", url: "/my/leaves", icon: Plane },
    { title: "My Payslips", desc: "Salary breakdown & history", url: "/my/payslips", icon: Banknote },
    { title: "My Performance", desc: "KPIs and reviews", url: "/my/performance", icon: Target },
  ];

  return (
    <PageShell title="My Workspace" subtitle={`${currentUser.name} · ${currentRole.name}`}>
      <SubNav items={MY_NAV} label="Self-Service" />

      <div className="rounded-2xl border border-border bg-gradient-surface p-6 mb-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/15 text-primary grid place-items-center font-bold text-xl">
            {currentUser.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h2 className="text-xl font-bold">Hi, {currentUser.name.split(" ")[0]} 👋</h2>
            <p className="text-sm text-muted-foreground">
              {me ? `${me.employee_number} · ${currentUser.branch}` : currentUser.branch} ·{" "}
              <span className="text-primary">{currentRole.name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className={`h-4 w-4 ${c.tone}`} />
            </div>
            <div className="mt-2 text-2xl font-bold">{c.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((l) => (
          <Link
            key={l.url}
            to={l.url}
            className="group rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary/40 transition"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:bg-primary/20 transition">
                <l.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{l.title}</div>
                <div className="text-xs text-muted-foreground">{l.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}