import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, MY_NAV } from "@/components/sub-nav";
import { useRbac } from "@/lib/rbac";
import { Target, Award, TrendingUp, Star, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_app/my/performance")({ component: MyPerformance });

const KPIS = [
  { name: "Customer Satisfaction", score: 4.6, target: 4.5, weight: 25 },
  { name: "Productivity", score: 92, target: 90, weight: 25, unit: "%" },
  { name: "Punctuality", score: 95, target: 95, weight: 20, unit: "%" },
  { name: "Teamwork", score: 4.4, target: 4.0, weight: 15 },
  { name: "Quality of Work", score: 4.5, target: 4.0, weight: 15 },
];

const REVIEWS = [
  { period: "Q1 2026", rating: 4.5, reviewer: "Mark Villanueva", status: "Completed", notes: "Consistently exceeds expectations on POS workflow." },
  { period: "Q4 2025", rating: 4.3, reviewer: "Adrian Zamora", status: "Completed", notes: "Strong customer rapport. Improve upselling." },
  { period: "Q3 2025", rating: 4.1, reviewer: "Mark Villanueva", status: "Completed", notes: "Great attendance record." },
];

const TRAININGS = [
  { name: "POS Advanced Training", date: "Mar 2026", status: "Completed" },
  { name: "Customer Service Excellence", date: "Jan 2026", status: "Completed" },
  { name: "Fire Safety Orientation", date: "Nov 2025", status: "Completed" },
  { name: "Inventory Best Practices", date: "Q2 2026", status: "Scheduled" },
];

function MyPerformance() {
  const { currentUser, currentRole } = useRbac();
  const overall = (
    KPIS.reduce((s, k) => {
      const norm = k.unit === "%" ? k.score / 100 * 5 : k.score;
      return s + norm * (k.weight / 100);
    }, 0)
  ).toFixed(2);

  return (
    <PageShell title="My Performance" subtitle="KPIs, reviews, and growth">
      <SubNav items={MY_NAV} label="Self-Service" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 rounded-2xl border border-border bg-gradient-surface p-6 shadow-soft">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Award className="h-4 w-4 text-primary" /> Overall Rating
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-primary">{overall}</span>
            <span className="text-muted-foreground">/ 5.0</span>
          </div>
          <div className="mt-3 flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-5 w-5 ${i <= Math.round(Number(overall)) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{currentRole.name} · {currentUser.branch}</div>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">KPI Scorecard</h3>
          </div>
          <div className="space-y-3">
            {KPIS.map((k) => {
              const pct = k.unit === "%" ? k.score : (k.score / 5) * 100;
              const targetPct = k.unit === "%" ? k.target : (k.target / 5) * 100;
              const meets = k.score >= k.target;
              return (
                <div key={k.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{k.name}</span>
                    <span className={meets ? "text-emerald-400" : "text-amber-400"}>
                      {k.score}{k.unit || "/5"} · target {k.target}{k.unit || ""}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden relative">
                    <div
                      className={`h-full ${meets ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                    <div className="absolute top-0 h-full w-px bg-foreground/40" style={{ left: `${targetPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Performance Reviews</h3>
          </div>
          <div className="divide-y divide-border">
            {REVIEWS.map((r) => (
              <div key={r.period} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">{r.period}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {r.rating}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">Reviewed by {r.reviewer} · {r.status}</div>
                <p className="text-sm">{r.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Trainings & Certifications</h3>
          </div>
          <div className="divide-y divide-border">
            {TRAININGS.map((t) => (
              <div key={t.name} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
                <span className={`inline-flex px-2 py-0.5 text-[11px] rounded-md border ${
                  t.status === "Completed"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}