import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, CATALOG_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Truck, Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSuppliers, useInsert, useUpdate, useDelete } from "@/lib/db";

export const Route = createFileRoute("/_app/suppliers")({ component: SuppliersPage });

function SuppliersPage() {
  const { data: suppliers = [], isLoading } = useSuppliers();
  const insert = useInsert<any>("suppliers");
  const update = useUpdate<any>("suppliers");
  const del = useDelete("suppliers");
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <PageShell
      title="Suppliers"
      subtitle="Manage parts at vendor partners ng ADZ Garage."
      actions={
        <button
          onClick={() =>
      setEditing({})}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow"
        >
          <Plus className="h-4 w-4" /> New Supplier
        </button>
      }
    >
      <SubNav items={CATALOG_NAV} label="Catalog" />
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Supplier</th>
              <th className="text-left font-medium px-6 py-3">Contact Person</th>
              <th className="text-left font-medium px-6 py-3">Contact</th>
              <th className="text-left font-medium px-6 py-3">Payment Terms</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="px-6 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (suppliers as any[]).length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No suppliers yet. Add one to get started.</td></tr>
            ) : (
              (suppliers as any[]).map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <Truck className="h-4 w-4" />
                    </div>
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{s.contact_person ?? "—"}</td>
                  <td className="px-6 py-4 text-xs space-y-0.5">
                    {s.email && <div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" /> {s.email}</div>}
                    {s.phone && <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" /> {s.phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{s.payment_terms ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => confirm(`Delete ${s.name}?`) && del.mutate(s.id, { onSuccess: () => toast.success("Deleted") })}
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

      <SupplierDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(row: any) => {
          row.id
            ? update.mutate({ id: row.id, patch: row }, { onSuccess: () => { toast.success("Saved"); setEditing(null); } })
            : insert.mutate({ ...row, is_active: row.is_active ?? true }, { onSuccess: () => { toast.success("Created"); setEditing(null); } });
        }}
        busy={insert.isPending || update.isPending}
      />
    </PageShell>
  );
}

function SupplierDialog({ editing, onClose, onSave, busy }: any) {
  const [form, setForm] = useState<any>({});
  if (editing && (form.id ?? undefined) !== (editing.id ?? undefined)) setForm(editing);
  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing?.id ? "Edit Supplier" : "New Supplier"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Company Name" required>
            <input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ABC Auto Parts Inc." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Person">
              <input className="input" value={form.contact_person ?? ""} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
            </Field>
            <Field label="Payment Terms">
              <input className="input" value={form.payment_terms ?? ""} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} placeholder="Net 30" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input type="email" className="input" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className="input" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Address">
            <textarea className="input min-h-[60px]" value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active supplier
          </label>
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

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive"> *</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}