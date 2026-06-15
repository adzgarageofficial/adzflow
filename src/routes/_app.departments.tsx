import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDepartments,
  usePositions,
  useInsert,
  useUpdate,
  useDelete,
  peso,
} from "@/lib/db";

export const Route = createFileRoute("/_app/departments")({ component: DepartmentsPage });

function DepartmentsPage() {
  return (
    <PageShell title="Departments & Positions" subtitle="Organizational structure ng ADZ Garage.">
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="h-4 w-4" /> Departments
          </TabsTrigger>
          <TabsTrigger value="positions" className="gap-2">
            <Briefcase className="h-4 w-4" /> Positions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="mt-5">
          <DepartmentsTab />
        </TabsContent>
        <TabsContent value="positions" className="mt-5">
          <PositionsTab />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

/* ---------------- Departments ---------------- */
function DepartmentsTab() {
  const { data: departments = [], isLoading } = useDepartments();
  const insert = useInsert<any>("departments");
  const update = useUpdate<any>("departments");
  const del = useDelete("departments");
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing({})}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow"
        >
          <Plus className="h-4 w-4" /> New Department
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Department</th>
              <th className="text-left font-medium px-6 py-3">Code</th>
              <th className="text-left font-medium px-6 py-3">Description</th>
              <th className="px-6 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (departments as any[]).length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No departments yet. Add one to get started.</td></tr>
            ) : (
              (departments as any[]).map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    {d.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{d.code ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{d.description ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(d)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => confirm(`Delete ${d.name}?`) && del.mutate(d.id, { onSuccess: () => toast.success("Deleted") })}
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

      <DeptDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(row: any) => {
          const op = row.id ? update.mutate({ id: row.id, patch: row }, { onSuccess: () => { toast.success("Saved"); setEditing(null); } })
                            : insert.mutate(row, { onSuccess: () => { toast.success("Created"); setEditing(null); } });
          return op;
        }}
        busy={insert.isPending || update.isPending}
      />
    </div>
  );
}

function DeptDialog({ editing, onClose, onSave, busy }: any) {
  const [form, setForm] = useState<any>({});
  if (editing && (form.id ?? undefined) !== (editing.id ?? undefined)) setForm(editing);
  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{editing?.id ? "Edit Department" : "New Department"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Name" required>
            <input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Service & Operations" />
          </Field>
          <Field label="Code">
            <input className="input" value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="OPS" />
          </Field>
          <Field label="Description">
            <textarea className="input min-h-[80px]" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={busy || !form.name} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Positions ---------------- */
function PositionsTab() {
  const { data: positions = [], isLoading } = usePositions();
  const { data: departments = [] } = useDepartments();
  const insert = useInsert<any>("positions");
  const update = useUpdate<any>("positions");
  const del = useDelete("positions");
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> New Position
        </button>
      </div>
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Title</th>
              <th className="text-left font-medium px-6 py-3">Department</th>
              <th className="text-left font-medium px-6 py-3">Level</th>
              <th className="text-right font-medium px-6 py-3">Salary Range</th>
              <th className="px-6 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (positions as any[]).length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No positions yet.</td></tr>
            ) : (
              (positions as any[]).map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-6 py-4 font-semibold">{p.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.department?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.level ?? "—"}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">
                    {peso(Number(p.min_salary || 0))} – {peso(Number(p.max_salary || 0))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => confirm(`Delete ${p.title}?`) && del.mutate(p.id, { onSuccess: () => toast.success("Deleted") })}
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

      <PositionDialog
        editing={editing}
        departments={departments as any[]}
        onClose={() => setEditing(null)}
        onSave={(row: any) => {
          row.id
            ? update.mutate({ id: row.id, patch: row }, { onSuccess: () => { toast.success("Saved"); setEditing(null); } })
            : insert.mutate(row, { onSuccess: () => { toast.success("Created"); setEditing(null); } });
        }}
        busy={insert.isPending || update.isPending}
      />
    </div>
  );
}

function PositionDialog({ editing, departments, onClose, onSave, busy }: any) {
  const [form, setForm] = useState<any>({});
  if (editing && (form.id ?? undefined) !== (editing.id ?? undefined)) setForm(editing);
  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing?.id ? "Edit Position" : "New Position"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Title" required>
            <input className="input" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Mechanic" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <select className="input" value={form.department_id ?? ""} onChange={(e) => setForm({ ...form, department_id: e.target.value || null })}>
                <option value="">—</option>
                {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Level">
              <input className="input" value={form.level ?? ""} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Senior / Junior" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min Salary (₱)">
              <input type="number" className="input" value={form.min_salary ?? 0} onChange={(e) => setForm({ ...form, min_salary: Number(e.target.value) })} />
            </Field>
            <Field label="Max Salary (₱)">
              <input type="number" className="input" value={form.max_salary ?? 0} onChange={(e) => setForm({ ...form, max_salary: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea className="input min-h-[80px]" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={busy || !form.title} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
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