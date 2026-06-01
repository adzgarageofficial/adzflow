import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TALENT_NAV } from "@/components/sub-nav";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Target, Plus, Award, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  usePerformanceReviews,
  usePerformanceGoals,
  useRecognitions,
  useEmployees,
  useInsert,
  useUpdate,
} from "@/lib/db";

export const Route = createFileRoute("/_app/performance")({ component: PerformancePage });

function tone(s: string) {
  return {
    draft: "bg-secondary text-muted-foreground border-border",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    acknowledged: "bg-primary/15 text-primary border-primary/30",
    not_started: "bg-secondary text-muted-foreground border-border",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function PerformancePage() {
  const { data: reviews = [] } = usePerformanceReviews();
  const { data: goals = [] } = usePerformanceGoals();
  const { data: recogs = [] } = useRecognitions();
  const { data: employees = [] } = useEmployees();
  const insertReview = useInsert<any>("performance_reviews");
  const insertGoal = useInsert<any>("performance_goals");
  const insertRecog = useInsert<any>("recognitions");
  const updateGoal = useUpdate<any>("performance_goals");
  const updateReview = useUpdate<any>("performance_reviews");

  const [tab, setTab] = useState<"reviews" | "goals" | "recognition">("reviews");
  const [openReview, setOpenReview] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [openRecog, setOpenRecog] = useState(false);

  const stats = useMemo(() => {
    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((s: number, r: any) => s + Number(r.overall_rating || 0), 0) / reviews.length;
    const completedGoals = goals.filter((g: any) => g.status === "completed").length;
    const activeGoals = goals.filter((g: any) => g.status === "in_progress").length;
    return {
      reviewCount: reviews.length,
      avgRating: avgRating.toFixed(1),
      completedGoals,
      activeGoals,
      recogCount: recogs.length,
    };
  }, [reviews, goals, recogs]);

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertReview.mutateAsync({
        review_number: `PR-${Date.now().toString().slice(-8)}`,
        employee_id: fd.get("employee_id"),
        period_start: fd.get("period_start"),
        period_end: fd.get("period_end"),
        overall_rating: Number(fd.get("overall_rating") || 0),
        strengths: fd.get("strengths"),
        improvements: fd.get("improvements"),
        comments: fd.get("comments"),
        status: "draft",
      });
      toast.success("Review created");
      setOpenReview(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const submitGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertGoal.mutateAsync({
        employee_id: fd.get("employee_id"),
        title: fd.get("title"),
        description: fd.get("description"),
        target_value: fd.get("target_value"),
        due_date: fd.get("due_date") || null,
        status: "not_started",
        progress: 0,
      });
      toast.success("Goal created");
      setOpenGoal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const submitRecog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertRecog.mutateAsync({
        employee_id: fd.get("employee_id"),
        title: fd.get("title"),
        message: fd.get("message"),
        category: fd.get("category"),
        points: Number(fd.get("points") || 0),
        awarded_at: fd.get("awarded_at") || new Date().toISOString().slice(0, 10),
      });
      toast.success("Recognition awarded");
      setOpenRecog(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <PageShell
      title="Performance Management"
      subtitle="Reviews, goals, and employee recognition"
      actions={
        <button
          onClick={() =>
      {
            if (tab === "reviews") setOpenReview(true);
            else if (tab === "goals") setOpenGoal(true);
            else setOpenRecog(true);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {tab === "reviews" ? "New Review" : tab === "goals" ? "New Goal" : "Give Recognition"}
        </button>
      }
    >
      <SubNav items={TALENT_NAV} label="Talent" />
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon={<Star className="h-4 w-4" />} label="Avg Rating" value={stats.avgRating} sub={`${stats.reviewCount} reviews`} />
        <Kpi icon={<Target className="h-4 w-4" />} label="Active Goals" value={String(stats.activeGoals)} sub="in progress" />
        <Kpi icon={<CheckCircle2 className="h-4 w-4" />} label="Goals Done" value={String(stats.completedGoals)} sub="completed" />
        <Kpi icon={<Award className="h-4 w-4" />} label="Recognitions" value={String(stats.recogCount)} sub="awarded" />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-border">
        {(["reviews", "goals", "recognition"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 h-9 text-sm font-medium border-b-2 -mb-px capitalize transition ${
              tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {tab === "reviews" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">Review #</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Period</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No reviews yet.</td></tr>
              ) : reviews.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{r.review_number}</td>
                  <td className="p-3 font-medium">{r.employee?.first_name} {r.employee?.last_name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{r.period_start} → {r.period_end}</td>
                  <td className="p-3"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{Number(r.overall_rating).toFixed(1)}</span></td>
                  <td className="p-3"><span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${tone(r.status)}`}>{r.status}</span></td>
                  <td className="p-3 text-right">
                    {r.status === "draft" && (
                      <button onClick={() => updateReview.mutate({ id: r.id, patch: { status: "completed" } })} className="text-xs text-primary hover:underline">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Goals */}
      {tab === "goals" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground rounded-2xl border border-dashed border-border">No goals yet.</div>
          ) : goals.map((g: any) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{g.title}</div>
                  <div className="text-xs text-muted-foreground">{g.employee?.first_name} {g.employee?.last_name}</div>
                </div>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${tone(g.status)}`}>{g.status}</span>
              </div>
              {g.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{g.description}</p>}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1"><span>Progress</span><span>{g.progress}%</span></div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary" style={{ width: `${g.progress}%` }} /></div>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="number" min="0" max="100" defaultValue={g.progress}
                  className="w-20 h-8 rounded border border-border bg-background px-2 text-xs"
                  onBlur={(e) => {
                    const v = Math.max(0, Math.min(100, Number(e.target.value)));
                    if (v !== g.progress) updateGoal.mutate({ id: g.id, patch: { progress: v, status: v >= 100 ? "completed" : v > 0 ? "in_progress" : "not_started", completed_at: v >= 100 ? new Date().toISOString() : null } });
                  }}
                />
                {g.due_date && <span className="text-xs text-muted-foreground self-center">Due {g.due_date}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recognition */}
      {tab === "recognition" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recogs.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground rounded-2xl border border-dashed border-border">No recognitions yet.</div>
          ) : recogs.map((r: any) => (
            <div key={r.id} className="rounded-2xl border border-border bg-gradient-surface p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/15 text-amber-400 grid place-items-center"><Award className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.employee?.first_name} {r.employee?.last_name} · {r.awarded_at}</div>
                </div>
              </div>
              {r.message && <p className="mt-3 text-sm">{r.message}</p>}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-secondary capitalize">{r.category}</span>
                {r.points > 0 && <span className="text-primary font-semibold">+{r.points} pts</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Review Dialog */}
      <Dialog open={openReview} onOpenChange={setOpenReview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New Performance Review</DialogTitle></DialogHeader>
          <form onSubmit={submitReview} className="space-y-3">
            <EmpSelect employees={employees} />
            <div className="grid grid-cols-2 gap-3">
              <FieldDate name="period_start" label="Period Start" required />
              <FieldDate name="period_end" label="Period End" required />
            </div>
            <FieldNum name="overall_rating" label="Overall Rating (0-5)" step="0.1" max="5" />
            <FieldText name="strengths" label="Strengths" textarea />
            <FieldText name="improvements" label="Areas for Improvement" textarea />
            <FieldText name="comments" label="Comments" textarea />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Save Review</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Goal Dialog */}
      <Dialog open={openGoal} onOpenChange={setOpenGoal}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Goal</DialogTitle></DialogHeader>
          <form onSubmit={submitGoal} className="space-y-3">
            <EmpSelect employees={employees} />
            <FieldText name="title" label="Goal Title" required />
            <FieldText name="description" label="Description" textarea />
            <FieldText name="target_value" label="Target / Metric" />
            <FieldDate name="due_date" label="Due Date" />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Create Goal</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Recognition Dialog */}
      <Dialog open={openRecog} onOpenChange={setOpenRecog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Give Recognition</DialogTitle></DialogHeader>
          <form onSubmit={submitRecog} className="space-y-3">
            <EmpSelect employees={employees} />
            <FieldText name="title" label="Title (e.g. Employee of the Month)" required />
            <FieldText name="message" label="Message" textarea />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <select name="category" defaultValue="kudos" className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
                  <option value="kudos">Kudos</option>
                  <option value="award">Award</option>
                  <option value="milestone">Milestone</option>
                  <option value="teamwork">Teamwork</option>
                </select>
              </div>
              <FieldNum name="points" label="Points" />
            </div>
            <FieldDate name="awarded_at" label="Date" />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Award</button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function Kpi({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function EmpSelect({ employees }: { employees: any[] }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">Employee</label>
      <select name="employee_id" required className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
        <option value="">Select employee...</option>
        {employees.map((e: any) => (<option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_number})</option>))}
      </select>
    </div>
  );
}

function FieldText({ name, label, required, textarea }: { name: string; label: string; required?: boolean; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea name={name} required={required} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
      ) : (
        <input name={name} required={required} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" />
      )}
    </div>
  );
}

function FieldDate({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type="date" name={name} required={required} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" />
    </div>
  );
}

function FieldNum({ name, label, step, max }: { name: string; label: string; step?: string; max?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type="number" name={name} step={step} max={max} min="0" defaultValue={0} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" />
    </div>
  );
}