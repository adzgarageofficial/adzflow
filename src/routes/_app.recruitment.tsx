import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TALENT_NAV } from "@/components/sub-nav";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Plus, Users, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useJobPostings,
  useApplicants,
  useApplications,
  useInterviews,
  useDepartments,
  usePositions,
  useInsert,
  useUpdate,
} from "@/lib/db";

export const Route = createFileRoute("/_app/recruitment")({ component: RecruitmentPage });

const STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"] as const;

function stageTone(s: string) {
  return {
    applied: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    screening: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    interview: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    offer: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    hired: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    withdrawn: "bg-secondary text-muted-foreground border-border",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function postingTone(s: string) {
  return {
    draft: "bg-secondary text-muted-foreground border-border",
    open: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    closed: "bg-red-500/15 text-red-400 border-red-500/30",
    filled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function RecruitmentPage() {
  const { data: postings = [] } = useJobPostings();
  const { data: applicants = [] } = useApplicants();
  const { data: applications = [] } = useApplications();
  const { data: interviews = [] } = useInterviews();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const insertPosting = useInsert<any>("job_postings");
  const insertApplicant = useInsert<any>("applicants");
  const insertApplication = useInsert<any>("applications");
  const insertInterview = useInsert<any>("interviews");
  const updatePosting = useUpdate<any>("job_postings");
  const updateApplication = useUpdate<any>("applications");

  const [tab, setTab] = useState<"postings" | "pipeline" | "interviews">("postings");
  const [openPosting, setOpenPosting] = useState(false);
  const [openApplicant, setOpenApplicant] = useState(false);
  const [openInterview, setOpenInterview] = useState<any>(null);

  const stats = useMemo(() => ({
    openPostings: postings.filter((p: any) => p.status === "open").length,
    totalApplicants: applicants.length,
    inPipeline: applications.filter((a: any) => !["hired", "rejected", "withdrawn"].includes(a.stage)).length,
    hired: applications.filter((a: any) => a.stage === "hired").length,
  }), [postings, applicants, applications]);

  const submitPosting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertPosting.mutateAsync({
        posting_number: `JP-${Date.now().toString().slice(-8)}`,
        title: fd.get("title"),
        department_id: fd.get("department_id") || null,
        position_id: fd.get("position_id") || null,
        description: fd.get("description"),
        requirements: fd.get("requirements"),
        employment_type: fd.get("employment_type"),
        salary_min: Number(fd.get("salary_min") || 0),
        salary_max: Number(fd.get("salary_max") || 0),
        openings: Number(fd.get("openings") || 1),
        status: "open",
        posted_at: new Date().toISOString().slice(0, 10),
        closes_at: fd.get("closes_at") || null,
      });
      toast.success("Job posting created");
      setOpenPosting(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const submitApplicant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const applicant = await insertApplicant.mutateAsync({
        first_name: fd.get("first_name"),
        last_name: fd.get("last_name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        resume_url: fd.get("resume_url"),
        source: fd.get("source"),
      });
      const jobId = fd.get("job_posting_id") as string;
      if (jobId) {
        await insertApplication.mutateAsync({
          application_number: `APP-${Date.now().toString().slice(-8)}`,
          applicant_id: (applicant as any).id,
          job_posting_id: jobId,
          stage: "applied",
        });
      }
      toast.success("Applicant added");
      setOpenApplicant(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const submitInterview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertInterview.mutateAsync({
        application_id: openInterview.id,
        scheduled_at: new Date(fd.get("scheduled_at") as string).toISOString(),
        duration_minutes: Number(fd.get("duration_minutes") || 60),
        location: fd.get("location"),
        meeting_link: fd.get("meeting_link"),
        interview_type: fd.get("interview_type"),
        status: "scheduled",
      });
      await updateApplication.mutateAsync({ id: openInterview.id, patch: { stage: "interview" } });
      toast.success("Interview scheduled");
      setOpenInterview(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <PageShell
      title="Recruitment"
      subtitle="Job postings, applicants, and hiring pipeline"
      actions={
        <button
          onClick={() =>
      (tab === "postings" ? setOpenPosting(true) : setOpenApplicant(true))}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {tab === "postings" ? "New Posting" : "Add Applicant"}
        </button>
      }
    >
      <SubNav items={TALENT_NAV} label="Talent" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon={<Briefcase className="h-4 w-4" />} label="Open Postings" value={String(stats.openPostings)} />
        <Kpi icon={<Users className="h-4 w-4" />} label="Applicants" value={String(stats.totalApplicants)} />
        <Kpi icon={<Calendar className="h-4 w-4" />} label="In Pipeline" value={String(stats.inPipeline)} />
        <Kpi icon={<CheckCircle2 className="h-4 w-4" />} label="Hired" value={String(stats.hired)} />
      </div>

      <div className="mb-4 flex gap-2 border-b border-border">
        {(["postings", "pipeline", "interviews"] as const).map((k) => (
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

      {tab === "postings" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postings.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground rounded-2xl border border-dashed border-border">No postings yet.</div>
          ) : postings.map((p: any) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-muted-foreground">{p.posting_number}</div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.department?.name} · {p.employment_type}</div>
                </div>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${postingTone(p.status)}`}>{p.status}</span>
              </div>
              {p.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span>{p.openings} opening{p.openings !== 1 ? "s" : ""}</span>
                <span className="text-muted-foreground">₱{Number(p.salary_min).toLocaleString()} – ₱{Number(p.salary_max).toLocaleString()}</span>
              </div>
              <div className="mt-3 flex gap-2">
                {p.status === "open" && (
                  <button onClick={() => updatePosting.mutate({ id: p.id, patch: { status: "closed" } })} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
                )}
                {p.status === "draft" && (
                  <button onClick={() => updatePosting.mutate({ id: p.id, patch: { status: "open", posted_at: new Date().toISOString().slice(0, 10) } })} className="text-xs text-primary hover:underline">Publish</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {(["applied", "screening", "interview", "offer", "hired"] as const).map((stage) => {
            const items = applications.filter((a: any) => a.stage === stage);
            return (
              <div key={stage} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase">{stage}</span>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="text-[10px] text-muted-foreground text-center py-4">—</div>
                  ) : items.map((a: any) => (
                    <div key={a.id} className="rounded-lg border border-border bg-background p-2.5">
                      <div className="font-medium text-xs truncate">{a.applicant?.first_name} {a.applicant?.last_name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{a.posting?.title}</div>
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {stage !== "interview" && stage !== "hired" && (
                          <button onClick={() => setOpenInterview(a)} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 hover:bg-amber-500/25">Interview</button>
                        )}
                        {stage !== "hired" && (
                          <select
                            value={a.stage}
                            onChange={(e) => updateApplication.mutate({ id: a.id, patch: { stage: e.target.value, ...(e.target.value === "hired" ? { hired_at: new Date().toISOString().slice(0, 10) } : {}) } })}
                            className="text-[10px] rounded border border-border bg-background px-1 py-0.5"
                          >
                            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "interviews" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">When</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Position</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {interviews.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No interviews scheduled.</td></tr>
              ) : interviews.map((i: any) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="p-3 text-xs">{new Date(i.scheduled_at).toLocaleString()}</td>
                  <td className="p-3 font-medium">{i.application?.applicant?.first_name} {i.application?.applicant?.last_name}</td>
                  <td className="p-3">{i.application?.posting?.title}</td>
                  <td className="p-3 text-xs capitalize">{i.interview_type?.replace(/_/g, " ")}</td>
                  <td className="p-3"><span className="text-[10px] uppercase px-2 py-0.5 rounded border bg-secondary">{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Posting */}
      <Dialog open={openPosting} onOpenChange={setOpenPosting}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New Job Posting</DialogTitle></DialogHeader>
          <form onSubmit={submitPosting} className="space-y-3">
            <Field name="title" label="Job Title" required />
            <div className="grid grid-cols-2 gap-3">
              <Sel name="department_id" label="Department" options={departments.map((d: any) => ({ value: d.id, label: d.name }))} />
              <Sel name="position_id" label="Position" options={positions.map((p: any) => ({ value: p.id, label: p.title }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Sel name="employment_type" label="Type" options={[
                { value: "full_time", label: "Full-time" }, { value: "part_time", label: "Part-time" },
                { value: "contract", label: "Contract" }, { value: "intern", label: "Intern" },
              ]} defaultValue="full_time" />
              <Field name="openings" label="Openings" type="number" defaultValue="1" />
              <Field name="closes_at" label="Closes At" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field name="salary_min" label="Min Salary" type="number" defaultValue="0" />
              <Field name="salary_max" label="Max Salary" type="number" defaultValue="0" />
            </div>
            <Field name="description" label="Description" textarea />
            <Field name="requirements" label="Requirements" textarea />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Publish</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Applicant */}
      <Dialog open={openApplicant} onOpenChange={setOpenApplicant}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Applicant</DialogTitle></DialogHeader>
          <form onSubmit={submitApplicant} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field name="first_name" label="First Name" required />
              <Field name="last_name" label="Last Name" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field name="email" label="Email" type="email" />
              <Field name="phone" label="Phone" />
            </div>
            <Field name="resume_url" label="Resume URL" />
            <div className="grid grid-cols-2 gap-3">
              <Field name="source" label="Source (e.g. LinkedIn)" />
              <Sel name="job_posting_id" label="Apply to Posting" options={postings.filter((p: any) => p.status === "open").map((p: any) => ({ value: p.id, label: p.title }))} />
            </div>
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Add</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview */}
      <Dialog open={!!openInterview} onOpenChange={(o) => !o && setOpenInterview(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
          <form onSubmit={submitInterview} className="space-y-3">
            <Field name="scheduled_at" label="Date & Time" type="datetime-local" required />
            <div className="grid grid-cols-2 gap-3">
              <Field name="duration_minutes" label="Duration (min)" type="number" defaultValue="60" />
              <Sel name="interview_type" label="Type" options={[
                { value: "in_person", label: "In-person" }, { value: "phone", label: "Phone" },
                { value: "video", label: "Video Call" }, { value: "panel", label: "Panel" },
              ]} defaultValue="in_person" />
            </div>
            <Field name="location" label="Location" />
            <Field name="meeting_link" label="Meeting Link" />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Schedule</button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Field({ name, label, type = "text", required, defaultValue, textarea }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea name={name} required={required} rows={3} defaultValue={defaultValue} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
      ) : (
        <input type={type} name={name} required={required} defaultValue={defaultValue} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" />
      )}
    </div>
  );
}

function Sel({ name, label, options, defaultValue }: { name: string; label: string; options: { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <select name={name} defaultValue={defaultValue} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
        <option value="">—</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}