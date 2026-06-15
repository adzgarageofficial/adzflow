import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { AmountInput } from "@/components/ui/amount-input";
import {
  useEmployees,
  useDepartments,
  usePositions,
  useBranches,
  useInsert,
  useUpdate,
  useDelete,
  useEmploymentContracts,
  useEmployeeDocuments,
  peso,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus, Search, Pencil, Trash2, Users2, UserCheck, UserX, Briefcase,
  Upload, FileText, Download, IdCard, ShieldAlert,
} from "lucide-react";
import { TableSkeleton, QueryError } from "@/components/query-states";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/employees")({ component: EmployeesPage });

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  on_leave: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  suspended: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  terminated: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  resigned: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const TYPE_LABELS: Record<string, string> = {
  regular: "Regular",
  probationary: "Probationary",
  contractual: "Contractual",
  project_based: "Project-based",
  part_time: "Part-time",
  intern: "Intern",
};

function EmployeesPage() {
  const { data: employees = [], isLoading, isError, error, refetch } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const { data: branches = [] } = useBranches();

  const insert = useInsert<any>("employees");
  const update = useUpdate<any>("employees");
  const del = useDelete("employees");

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return employees as any[];
    return (employees as any[]).filter((e) =>
      [
        e.employee_number,
        `${e.first_name} ${e.last_name}`,
        e.email,
        e.phone,
        e.position?.title,
        e.department?.name,
      ]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(s)),
    );
  }, [employees, q]);

  const stats = useMemo(() => {
    const list = employees as any[];
    return {
      total: list.length,
      active: list.filter((e) => e.status === "active").length,
      onLeave: list.filter((e) => e.status === "on_leave").length,
      payroll: list.reduce((s, e) => s + Number(e.basic_salary || 0) + Number(e.allowance || 0), 0),
    };
  }, [employees]);

  return (
    <PageShell title="Employee Directory" subtitle="Digital 201 files at workforce management ng ADZ Garage.">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi icon={Users2} label="Total Workforce" value={stats.total} accent="primary" />
        <Kpi icon={UserCheck} label="Active" value={stats.active} accent="emerald" />
        <Kpi icon={UserX} label="On Leave" value={stats.onLeave} accent="amber" />
        <Kpi icon={Briefcase} label="Monthly Payroll" value={peso(stats.payroll)} accent="primary" />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, employee #, position, department…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setEditing({})}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-glow inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> New Employee
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : isError ? (
        <QueryError message={(error as Error)?.message} onRetry={refetch} />
      ) : (
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Employee</th>
              <th className="text-left font-medium px-6 py-3">Position</th>
              <th className="text-left font-medium px-6 py-3">Department</th>
              <th className="text-left font-medium px-6 py-3">Type</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="text-right font-medium px-6 py-3">Basic Salary</th>
              <th className="px-6 py-3 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                <Users2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No employees yet. Click <strong>New Employee</strong> to get started.
              </td></tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setViewing(e)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-red text-primary-foreground grid place-items-center text-xs font-bold">
                        {(e.first_name?.[0] ?? "") + (e.last_name?.[0] ?? "")}
                      </div>
                      <div>
                        <div className="font-semibold">{e.first_name} {e.last_name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{e.employee_number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{e.position?.title ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{e.department?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{TYPE_LABELS[e.employment_type] ?? e.employment_type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex text-[11px] font-semibold rounded-full px-2.5 py-1 border ${STATUS_COLORS[e.status] ?? ""}`}>
                      {e.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{peso(Number(e.basic_salary || 0))}</td>
                  <td className="px-6 py-4" onClick={(ev) => ev.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(e)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => confirm(`Delete ${e.first_name} ${e.last_name}?`) && del.mutate(e.id, { onSuccess: () => toast.success("Deleted") })}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                      ><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      <EmployeeFormDialog
        editing={editing}
        departments={departments as any[]}
        positions={positions as any[]}
        branches={branches as any[]}
        onClose={() => setEditing(null)}
        onSave={(row: any) => {
          row.id
            ? update.mutate({ id: row.id, patch: row }, { onSuccess: () => { toast.success("Employee updated"); setEditing(null); } })
            : insert.mutate(row, { onSuccess: () => { toast.success("Employee added"); setEditing(null); } });
        }}
        busy={insert.isPending || update.isPending}
      />

      <EmployeeProfileDialog
        employee={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => { const v = viewing; setViewing(null); setEditing(v); }}
      />
    </PageShell>
  );
}

/* ---------------- KPI ---------------- */
function Kpi({ icon: Icon, label, value, accent }: any) {
  const accentClass = accent === "emerald" ? "text-emerald-400 bg-emerald-500/10"
    : accent === "amber" ? "text-amber-400 bg-amber-500/10"
    : "text-primary bg-primary/10";
  return (
    <div className="glass-card rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${accentClass}`}><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}

/* ---------------- Employee Form ---------------- */
function EmployeeFormDialog({ editing, departments, positions, branches, onClose, onSave, busy }: any) {
  const [form, setForm] = useState<any>({});
  if (editing && (form.id ?? undefined) !== (editing.id ?? undefined)) {
    setForm({
      employee_number: `EMP-${Date.now().toString().slice(-6)}`,
      employment_type: "probationary",
      status: "active",
      civil_status: "single",
      nationality: "Filipino",
      date_hired: new Date().toISOString().slice(0, 10),
      basic_salary: 0,
      allowance: 0,
      daily_rate: 0,
      hourly_rate: 0,
      commission_type: "percentage",
      commission_rate: 0,
      ...editing,
    });
  }

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing?.id ? "Edit Employee" : "New Employee"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="mt-2">
          <TabsList className="bg-secondary/60 border border-border">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="government">Government IDs</TabsTrigger>
          </TabsList>

          {/* Personal */}
          <TabsContent value="personal" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee #" required>
                <input className="input" value={form.employee_number ?? ""} onChange={(e) => set("employee_number", e.target.value)} />
              </Field>
              <Field label="Civil Status">
                <select className="input" value={form.civil_status ?? "single"} onChange={(e) => set("civil_status", e.target.value)}>
                  {["single","married","widowed","separated","divorced"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="First Name" required>
                <input className="input" value={form.first_name ?? ""} onChange={(e) => set("first_name", e.target.value)} />
              </Field>
              <Field label="Middle Name">
                <input className="input" value={form.middle_name ?? ""} onChange={(e) => set("middle_name", e.target.value)} />
              </Field>
              <Field label="Last Name" required>
                <input className="input" value={form.last_name ?? ""} onChange={(e) => set("last_name", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Birth Date"><input type="date" className="input" value={form.birth_date ?? ""} onChange={(e) => set("birth_date", e.target.value || null)} /></Field>
              <Field label="Gender"><input className="input" value={form.gender ?? ""} onChange={(e) => set("gender", e.target.value)} /></Field>
              <Field label="Nationality"><input className="input" value={form.nationality ?? ""} onChange={(e) => set("nationality", e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email"><input type="email" className="input" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Phone"><input className="input" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
            </div>
            <Field label="Address"><input className="input" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Emergency Contact"><input className="input" value={form.emergency_contact_name ?? ""} onChange={(e) => set("emergency_contact_name", e.target.value)} /></Field>
              <Field label="EC Phone"><input className="input" value={form.emergency_contact_phone ?? ""} onChange={(e) => set("emergency_contact_phone", e.target.value)} /></Field>
              <Field label="EC Relation"><input className="input" value={form.emergency_contact_relation ?? ""} onChange={(e) => set("emergency_contact_relation", e.target.value)} placeholder="Spouse, Parent…" /></Field>
            </div>
          </TabsContent>

          {/* Employment */}
          <TabsContent value="employment" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department">
                <select className="input" value={form.department_id ?? ""} onChange={(e) => set("department_id", e.target.value || null)}>
                  <option value="">—</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Position">
                <select className="input" value={form.position_id ?? ""} onChange={(e) => set("position_id", e.target.value || null)}>
                  <option value="">—</option>
                  {positions.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Branch">
                <select className="input" value={form.branch_id ?? ""} onChange={(e) => set("branch_id", e.target.value || null)}>
                  <option value="">—</option>
                  {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Employment Type">
                <select className="input" value={form.employment_type ?? "probationary"} onChange={(e) => set("employment_type", e.target.value)}>
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Status">
                <select className="input" value={form.status ?? "active"} onChange={(e) => set("status", e.target.value)}>
                  {["active","on_leave","suspended","terminated","resigned"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Date Hired"><input type="date" className="input" value={form.date_hired ?? ""} onChange={(e) => set("date_hired", e.target.value)} /></Field>
              <Field label="Date Regularized"><input type="date" className="input" value={form.date_regularized ?? ""} onChange={(e) => set("date_regularized", e.target.value || null)} /></Field>
            </div>
            <Field label="Notes"><textarea className="input min-h-[80px]" value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} /></Field>
          </TabsContent>

          {/* Compensation */}
          <TabsContent value="compensation" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Basic Salary (₱/month)"><AmountInput className="input" value={form.basic_salary ?? null} onChange={(val) => set("basic_salary", val)} /></Field>
              <Field label="Allowance (₱/month)"><AmountInput className="input" value={form.allowance ?? null} onChange={(val) => set("allowance", val)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Daily Rate (₱)"><AmountInput className="input" value={form.daily_rate ?? null} onChange={(val) => set("daily_rate", val)} /></Field>
              <Field label="Hourly Rate (₱)"><AmountInput className="input" value={form.hourly_rate ?? null} onChange={(val) => set("hourly_rate", val)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Commission Type">
                <select className="input" value={form.commission_type ?? "percentage"} onChange={(e) => set("commission_type", e.target.value)}>
                  <option value="percentage">% of labor cost per job</option>
                  <option value="fixed">Fixed ₱ per completed job</option>
                </select>
              </Field>
              <Field label={form.commission_type === "fixed" ? "Commission (₱ per job)" : "Commission Rate (%)"}>
                <AmountInput className="input" value={form.commission_rate ?? null} onChange={(val) => set("commission_rate", val)} />
              </Field>
            </div>
            <p className="text-[11px] text-muted-foreground -mt-1">Mechanic commission is computed automatically from completed job orders during payroll generation. Internal only — never shown on customer receipts.</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bank Name"><input className="input" value={form.bank_name ?? ""} onChange={(e) => set("bank_name", e.target.value)} /></Field>
              <Field label="Bank Account #"><input className="input" value={form.bank_account_number ?? ""} onChange={(e) => set("bank_account_number", e.target.value)} /></Field>
            </div>
          </TabsContent>

          {/* Government IDs */}
          <TabsContent value="government" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="SSS #"><input className="input" value={form.sss_number ?? ""} onChange={(e) => set("sss_number", e.target.value)} /></Field>
              <Field label="PhilHealth #"><input className="input" value={form.philhealth_number ?? ""} onChange={(e) => set("philhealth_number", e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pag-IBIG #"><input className="input" value={form.pagibig_number ?? ""} onChange={(e) => set("pagibig_number", e.target.value)} /></Field>
              <Field label="TIN #"><input className="input" value={form.tin_number ?? ""} onChange={(e) => set("tin_number", e.target.value)} /></Field>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Government IDs are confidential and will only be used for payroll computations (Phase 4).
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button
            disabled={busy || !form.first_name || !form.last_name || !form.employee_number}
            onClick={() => onSave(form)}
            className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-50"
          >
            {busy ? "Saving…" : editing?.id ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Employee Profile (with 201 file) ---------------- */
function EmployeeProfileDialog({ employee, onClose, onEdit }: { employee: any; onClose: () => void; onEdit: () => void }) {
  return (
    <Dialog open={!!employee} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {employee && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-red text-primary-foreground grid place-items-center text-sm font-bold">
                  {(employee.first_name?.[0] ?? "") + (employee.last_name?.[0] ?? "")}
                </div>
                <div>
                  <div className="text-lg">{employee.first_name} {employee.middle_name} {employee.last_name}</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {employee.employee_number} · {employee.position?.title ?? "—"} · {employee.department?.name ?? "—"}
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="flex justify-end mb-2">
              <button onClick={onEdit} className="h-9 px-3 rounded-lg border border-border text-xs inline-flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit Profile</button>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="bg-secondary/60 border border-border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">201 Files</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="Contact">
                    <Info label="Email" value={employee.email} />
                    <Info label="Phone" value={employee.phone} />
                    <Info label="Address" value={employee.address} />
                    <Info label="Emergency" value={[employee.emergency_contact_name, employee.emergency_contact_phone, employee.emergency_contact_relation].filter(Boolean).join(" · ")} />
                  </InfoCard>
                  <InfoCard title="Employment">
                    <Info label="Type" value={TYPE_LABELS[employee.employment_type]} />
                    <Info label="Status" value={employee.status} />
                    <Info label="Date Hired" value={employee.date_hired} />
                    <Info label="Branch" value={employee.branch?.name} />
                  </InfoCard>
                  <InfoCard title="Compensation">
                    <Info label="Basic Salary" value={peso(Number(employee.basic_salary || 0))} />
                    <Info label="Allowance" value={peso(Number(employee.allowance || 0))} />
                    <Info label="Daily Rate" value={peso(Number(employee.daily_rate || 0))} />
                    {Number(employee.commission_rate || 0) > 0 && (
                      <Info
                        label="Commission"
                        value={employee.commission_type === "fixed"
                          ? `${peso(Number(employee.commission_rate || 0))} per completed job`
                          : `${Number(employee.commission_rate || 0)}% of labor cost per job`}
                      />
                    )}
                    <Info label="Bank" value={[employee.bank_name, employee.bank_account_number].filter(Boolean).join(" · ")} />
                  </InfoCard>
                  <InfoCard title="Government IDs">
                    <Info label="SSS" value={employee.sss_number} />
                    <Info label="PhilHealth" value={employee.philhealth_number} />
                    <Info label="Pag-IBIG" value={employee.pagibig_number} />
                    <Info label="TIN" value={employee.tin_number} />
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <DocumentsSection employeeId={employee.id} />
              </TabsContent>

              <TabsContent value="contracts" className="mt-4">
                <ContractsSection employee={employee} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right truncate">{value || "—"}</span>
    </div>
  );
}

/* ---------------- 201 Documents ---------------- */
function DocumentsSection({ employeeId }: { employeeId: string }) {
  const { data: docs = [], isLoading } = useEmployeeDocuments(employeeId);
  const insert = useInsert<any>("employee_documents");
  const del = useDelete("employee_documents");
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<string>("contract");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const path = `${employeeId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("hr-documents").upload(path, file);
      if (upErr) throw upErr;
      const { data: { user } } = await supabase.auth.getUser();
      insert.mutate({
        employee_id: employeeId,
        document_type: docType,
        title: title || file.name,
        file_url: path,
        file_name: file.name,
        file_size: file.size,
        uploaded_by: user?.id ?? null,
      } as any, {
        onSuccess: () => { toast.success("Document uploaded"); setTitle(""); if (fileRef.current) fileRef.current.value = ""; },
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally { setUploading(false); }
  };

  const download = async (path: string, filename: string) => {
    const { data, error } = await supabase.storage.from("hr-documents").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    const a = document.createElement("a");
    a.href = data.signedUrl; a.download = filename; a.click();
  };

  const removeDoc = async (id: string, path?: string) => {
    if (!confirm("Delete document?")) return;
    if (path) await supabase.storage.from("hr-documents").remove([path]);
    del.mutate(id, { onSuccess: () => toast.success("Deleted") });
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-secondary/40 p-4 mb-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
          <IdCard className="h-3.5 w-3.5" /> Upload to 201 File
        </div>
        <div className="grid grid-cols-12 gap-2">
          <select className="input col-span-3" value={docType} onChange={(e) => setDocType(e.target.value)}>
            {["contract","government_id","resume","certificate","medical","clearance","training","evaluation","other"].map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
          <input className="input col-span-5" placeholder="Document title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input
            ref={fileRef}
            type="file"
            className="col-span-3 text-xs file:mr-2 file:h-9 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:text-xs file:font-medium"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <button disabled className="col-span-1 h-10 rounded-lg bg-primary/40 text-primary-foreground text-sm font-medium inline-flex items-center justify-center gap-1.5">
            <Upload className="h-4 w-4" />
          </button>
        </div>
        {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>}
      </div>

      <div className="space-y-2">
        {isLoading ? <p className="text-sm text-muted-foreground text-center py-6">Loading documents…</p>
        : (docs as any[]).length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No documents uploaded yet.</p>
        : (docs as any[]).map((d) => (
          <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-secondary/40">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><FileText className="h-4 w-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{d.title}</div>
              <div className="text-[11px] text-muted-foreground">
                {d.document_type?.replace("_", " ")} · {d.file_name} · {new Date(d.created_at).toLocaleDateString()}
              </div>
            </div>
            <button onClick={() => download(d.file_url, d.file_name)} className="p-2 rounded-lg hover:bg-secondary" title="Download"><Download className="h-4 w-4" /></button>
            <button onClick={() => removeDoc(d.id, d.file_url)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Contracts ---------------- */
function ContractsSection({ employee }: { employee: any }) {
  const { data: contracts = [], isLoading } = useEmploymentContracts(employee.id);
  const insert = useInsert<any>("employment_contracts");
  const del = useDelete("employment_contracts");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  const create = () => {
    setForm({
      contract_number: `CON-${Date.now().toString().slice(-6)}`,
      contract_type: employee.employment_type ?? "probationary",
      status: "draft",
      start_date: new Date().toISOString().slice(0, 10),
      basic_salary: employee.basic_salary ?? 0,
      allowance: employee.allowance ?? 0,
      position_title: employee.position?.title ?? "",
    });
    setOpen(true);
  };

  const save = () => {
    insert.mutate({ ...form, employee_id: employee.id }, {
      onSuccess: () => { toast.success("Contract created"); setOpen(false); },
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={create} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> New Contract</button>
      </div>
      <div className="space-y-2">
        {isLoading ? <p className="text-sm text-muted-foreground text-center py-6">Loading…</p>
        : (contracts as any[]).length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No contracts yet.</p>
        : (contracts as any[]).map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><FileText className="h-4 w-4" /></div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{c.contract_number} · {TYPE_LABELS[c.contract_type] ?? c.contract_type}</div>
              <div className="text-xs text-muted-foreground">
                {c.start_date} → {c.end_date ?? "ongoing"} · {peso(Number(c.basic_salary || 0))} basic
              </div>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              c.status === "active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : c.status === "draft" ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
              : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
            }`}>{c.status}</span>
            <button onClick={() => confirm("Delete contract?") && del.mutate(c.id, { onSuccess: () => toast.success("Deleted") })} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Contract</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Contract #" required><input className="input" value={form.contract_number ?? ""} onChange={(e) => setForm({ ...form, contract_number: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select className="input" value={form.contract_type ?? "probationary"} onChange={(e) => setForm({ ...form, contract_type: e.target.value })}>
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className="input" value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {["draft","active","expired","terminated"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date" required><input type="date" className="input" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></Field>
              <Field label="End Date"><input type="date" className="input" value={form.end_date ?? ""} onChange={(e) => setForm({ ...form, end_date: e.target.value || null })} /></Field>
            </div>
            <Field label="Position Title"><input className="input" value={form.position_title ?? ""} onChange={(e) => setForm({ ...form, position_title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Basic Salary (₱)"><AmountInput className="input" value={form.basic_salary ?? null} onChange={(val) => setForm({ ...form, basic_salary: val })} /></Field>
              <Field label="Allowance (₱)"><AmountInput className="input" value={form.allowance ?? null} onChange={(val) => setForm({ ...form, allowance: val })} /></Field>
            </div>
            <Field label="Terms"><textarea className="input min-h-[80px]" value={form.terms ?? ""} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></Field>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setOpen(false)} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
            <button disabled={insert.isPending || !form.contract_number || !form.start_date} onClick={save} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
              {insert.isPending ? "Saving…" : "Create Contract"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive"> *</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}