import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TALENT_NAV } from "@/components/sub-nav";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, Plus, BookOpen, Award, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import {
  useTrainingPrograms,
  useTrainingSessions,
  useTrainingEnrollments,
  useCertifications,
  useEmployees,
  useInsert,
  useUpdate,
} from "@/lib/db";

export const Route = createFileRoute("/_app/training")({ component: TrainingPage });

function statusTone(s: string) {
  return {
    scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    ongoing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
    enrolled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    in_progress: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    failed: "bg-red-500/15 text-red-400 border-red-500/30",
    dropped: "bg-secondary text-muted-foreground border-border",
  }[s] || "bg-secondary text-muted-foreground border-border";
}

function TrainingPage() {
  const { data: programs = [] } = useTrainingPrograms();
  const { data: sessions = [] } = useTrainingSessions();
  const { data: enrollments = [] } = useTrainingEnrollments();
  const { data: certs = [] } = useCertifications();
  const { data: employees = [] } = useEmployees();
  const insertProgram = useInsert<any>("training_programs");
  const insertSession = useInsert<any>("training_sessions");
  const insertEnrollment = useInsert<any>("training_enrollments");
  const insertCert = useInsert<any>("certifications");
  const updateEnrollment = useUpdate<any>("training_enrollments");
  const updateSession = useUpdate<any>("training_sessions");

  const [tab, setTab] = useState<"programs" | "sessions" | "enrollments" | "certifications">("programs");
  const [openProg, setOpenProg] = useState(false);
  const [openSess, setOpenSess] = useState(false);
  const [openEnroll, setOpenEnroll] = useState<any>(null);
  const [openCert, setOpenCert] = useState(false);

  const stats = useMemo(() => ({
    activePrograms: programs.filter((p: any) => p.is_active).length,
    scheduledSessions: sessions.filter((s: any) => s.status === "scheduled" || s.status === "ongoing").length,
    activeEnrollments: enrollments.filter((e: any) => e.status === "enrolled" || e.status === "in_progress").length,
    validCerts: certs.filter((c: any) => !c.expiry_date || c.expiry_date >= new Date().toISOString().slice(0, 10)).length,
  }), [programs, sessions, enrollments, certs]);

  const submitProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertProgram.mutateAsync({
        code: fd.get("code"),
        title: fd.get("title"),
        description: fd.get("description"),
        category: fd.get("category"),
        provider: fd.get("provider"),
        duration_hours: Number(fd.get("duration_hours") || 0),
        cost_per_person: Number(fd.get("cost_per_person") || 0),
        is_mandatory: fd.get("is_mandatory") === "on",
        is_active: true,
      });
      toast.success("Program created");
      setOpenProg(false);
    } catch (err: any) { toast.error(err.message); }
  };

  const submitSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertSession.mutateAsync({
        program_id: fd.get("program_id"),
        session_code: `TS-${Date.now().toString().slice(-8)}`,
        start_date: fd.get("start_date"),
        end_date: fd.get("end_date"),
        location: fd.get("location"),
        trainer: fd.get("trainer"),
        max_participants: Number(fd.get("max_participants") || 0),
        status: "scheduled",
      });
      toast.success("Session scheduled");
      setOpenSess(false);
    } catch (err: any) { toast.error(err.message); }
  };

  const submitEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertEnrollment.mutateAsync({
        session_id: openEnroll.id,
        employee_id: fd.get("employee_id"),
        status: "enrolled",
      });
      toast.success("Employee enrolled");
      setOpenEnroll(null);
    } catch (err: any) { toast.error(err.message); }
  };

  const submitCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insertCert.mutateAsync({
        employee_id: fd.get("employee_id"),
        name: fd.get("name"),
        issuing_org: fd.get("issuing_org"),
        issue_date: fd.get("issue_date"),
        expiry_date: fd.get("expiry_date") || null,
        credential_id: fd.get("credential_id"),
        credential_url: fd.get("credential_url"),
      });
      toast.success("Certification added");
      setOpenCert(false);
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <PageShell
      title="Training & Development"
      subtitle="Programs, sessions, enrollments, and certifications"
      actions={
        <button
          onClick={() =>
      {
            if (tab === "programs") setOpenProg(true);
            else if (tab === "sessions") setOpenSess(true);
            else if (tab === "certifications") setOpenCert(true);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {tab === "programs" ? "New Program" : tab === "sessions" ? "Schedule Session" : tab === "certifications" ? "Add Certificate" : "Enroll"}
        </button>
      }
    >
      <SubNav items={TALENT_NAV} label="Talent" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon={<BookOpen className="h-4 w-4" />} label="Active Programs" value={String(stats.activePrograms)} />
        <Kpi icon={<Calendar className="h-4 w-4" />} label="Upcoming/Live" value={String(stats.scheduledSessions)} />
        <Kpi icon={<Users className="h-4 w-4" />} label="Enrolled" value={String(stats.activeEnrollments)} />
        <Kpi icon={<Award className="h-4 w-4" />} label="Valid Certs" value={String(stats.validCerts)} />
      </div>

      <div className="mb-4 flex gap-2 border-b border-border overflow-x-auto">
        {(["programs", "sessions", "enrollments", "certifications"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 h-9 text-sm font-medium border-b-2 -mb-px capitalize whitespace-nowrap transition ${
              tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {tab === "programs" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground rounded-2xl border border-dashed border-border">No programs yet.</div>
          ) : programs.map((p: any) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-muted-foreground">{p.code}</div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.category} {p.provider && `· ${p.provider}`}</div>
                </div>
                {p.is_mandatory && <span className="text-[10px] uppercase px-2 py-0.5 rounded border bg-red-500/15 text-red-400 border-red-500/30">Mandatory</span>}
              </div>
              {p.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
              <div className="mt-3 flex justify-between text-xs">
                <span>{p.duration_hours} hrs</span>
                <span className="text-muted-foreground">₱{Number(p.cost_per_person).toLocaleString()}/person</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "sessions" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">Session</th>
                <th className="p-3">Program</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Trainer</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No sessions yet.</td></tr>
              ) : sessions.map((s: any) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{s.session_code}</td>
                  <td className="p-3 font-medium">{s.program?.title}</td>
                  <td className="p-3 text-xs">{s.start_date} → {s.end_date}</td>
                  <td className="p-3 text-xs">{s.trainer}</td>
                  <td className="p-3"><span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${statusTone(s.status)}`}>{s.status}</span></td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => setOpenEnroll(s)} className="text-xs text-primary hover:underline">Enroll</button>
                    {s.status === "scheduled" && <button onClick={() => updateSession.mutate({ id: s.id, patch: { status: "ongoing" } })} className="text-xs text-muted-foreground hover:text-foreground">Start</button>}
                    {s.status === "ongoing" && <button onClick={() => updateSession.mutate({ id: s.id, patch: { status: "completed" } })} className="text-xs text-emerald-400 hover:underline">Complete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "enrollments" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">Employee</th>
                <th className="p-3">Program</th>
                <th className="p-3">Enrolled</th>
                <th className="p-3">Score</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No enrollments.</td></tr>
              ) : enrollments.map((e: any) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="p-3 font-medium">{e.employee?.first_name} {e.employee?.last_name}</td>
                  <td className="p-3">{e.session?.program?.title}</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                  <td className="p-3">{e.score ?? "—"}</td>
                  <td className="p-3"><span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${statusTone(e.status)}`}>{e.status}</span></td>
                  <td className="p-3 text-right">
                    {e.status !== "completed" && (
                      <button onClick={() => {
                        const score = prompt("Final score (0-100):");
                        if (score !== null) updateEnrollment.mutate({ id: e.id, patch: { status: "completed", score: Number(score), completed_at: new Date().toISOString() } });
                      }} className="text-xs text-emerald-400 hover:underline">Mark Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "certifications" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">Employee</th>
                <th className="p-3">Certificate</th>
                <th className="p-3">Issuer</th>
                <th className="p-3">Issued</th>
                <th className="p-3">Expires</th>
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No certifications recorded.</td></tr>
              ) : certs.map((c: any) => {
                const expired = c.expiry_date && c.expiry_date < new Date().toISOString().slice(0, 10);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="p-3 font-medium">{c.employee?.first_name} {c.employee?.last_name}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-400" />
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs">{c.issuing_org}</td>
                    <td className="p-3 text-xs">{c.issue_date}</td>
                    <td className="p-3 text-xs"><span className={expired ? "text-red-400" : ""}>{c.expiry_date || "—"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={openProg} onOpenChange={setOpenProg}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Training Program</DialogTitle></DialogHeader>
          <form onSubmit={submitProgram} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <F name="code" label="Code" required />
              <F name="category" label="Category" />
            </div>
            <F name="title" label="Title" required />
            <F name="description" label="Description" textarea />
            <div className="grid grid-cols-2 gap-3">
              <F name="provider" label="Provider" />
              <F name="duration_hours" label="Duration (hrs)" type="number" defaultValue="0" />
            </div>
            <F name="cost_per_person" label="Cost per Person" type="number" defaultValue="0" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_mandatory" /> Mandatory training</label>
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Create</button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openSess} onOpenChange={setOpenSess}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Session</DialogTitle></DialogHeader>
          <form onSubmit={submitSession} className="space-y-3">
            <Sel name="program_id" label="Program" options={programs.map((p: any) => ({ value: p.id, label: p.title }))} required />
            <div className="grid grid-cols-2 gap-3">
              <F name="start_date" label="Start Date" type="date" required />
              <F name="end_date" label="End Date" type="date" required />
            </div>
            <F name="trainer" label="Trainer" />
            <F name="location" label="Location" />
            <F name="max_participants" label="Max Participants" type="number" defaultValue="0" />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Schedule</button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!openEnroll} onOpenChange={(o) => !o && setOpenEnroll(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enroll Employee</DialogTitle></DialogHeader>
          <form onSubmit={submitEnroll} className="space-y-3">
            <Sel name="employee_id" label="Employee" options={employees.map((e: any) => ({ value: e.id, label: `${e.first_name} ${e.last_name} (${e.employee_number})` }))} required />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Enroll</button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openCert} onOpenChange={setOpenCert}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Certification</DialogTitle></DialogHeader>
          <form onSubmit={submitCert} className="space-y-3">
            <Sel name="employee_id" label="Employee" options={employees.map((e: any) => ({ value: e.id, label: `${e.first_name} ${e.last_name}` }))} required />
            <F name="name" label="Certificate Name" required />
            <F name="issuing_org" label="Issuing Organization" />
            <div className="grid grid-cols-2 gap-3">
              <F name="issue_date" label="Issue Date" type="date" required />
              <F name="expiry_date" label="Expiry Date" type="date" />
            </div>
            <F name="credential_id" label="Credential ID" />
            <F name="credential_url" label="Verification URL" />
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">Add</button>
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

function F({ name, label, type = "text", required, defaultValue, textarea }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string; textarea?: boolean }) {
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

function Sel({ name, label, options, required }: { name: string; label: string; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <select name={name} required={required} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
        <option value="">—</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}