import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useCustomers, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Mail, Phone, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers")({ component: Customers });

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  loyalty_points: number;
  lifetime_value: number;
  tags: string[] | null;
  created_at: string;
};

function Customers() {
  const { data: customers = [], isLoading } = useCustomers();
  const insert = useInsert<Customer>("customers");
  const update = useUpdate<Customer>("customers");
  const del = useDelete("customers");
  const canEdit = useIsOwner();

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Customer> | null>(null);

  const filtered = (customers as Customer[]).filter((c) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s) ||
      c.phone?.toLowerCase().includes(s)
    );
  });

  const stats = {
    total: customers.length,
    vip: (customers as Customer[]).filter((c) => c.lifetime_value > 50000).length,
    ltv: (customers as Customer[]).reduce((s, c) => s + Number(c.lifetime_value || 0), 0),
  };

  return (
    <PageShell title="Customers" subtitle="Your loyal community of garage owners.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: stats.total, icon: Users },
          { label: "VIP", value: stats.vip, icon: Users },
          { label: "Lifetime Value", value: peso(stats.ltv), icon: Users },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setEditing({})}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft inline-flex items-center gap-1.5 hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> New Customer
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-medium px-6 py-3">Customer</th>
              <th className="text-left font-medium px-6 py-3">Contact</th>
              <th className="text-left font-medium px-6 py-3">Loyalty</th>
              <th className="text-right font-medium px-6 py-3">Lifetime Value</th>
              <th className="px-6 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No customers yet. Click <strong>New Customer</strong> to add one.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-red text-primary-foreground grid place-items-center text-xs font-bold">
                        {c.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div>{c.full_name}</div>
                        {c.address && <div className="text-[11px] text-muted-foreground">{c.address}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {c.email && <div className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</div>}
                    {c.phone && <div className="inline-flex items-center gap-1 ml-3"><Phone className="h-3 w-3" />{c.phone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent text-primary border border-primary/10">
                      {c.loyalty_points} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">{peso(Number(c.lifetime_value || 0))}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${c.full_name}?`)) del.mutate(c.id, { onSuccess: () => toast.success("Deleted") });
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                      ><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CustomerDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(row) => {
          if (row.id) {
            update.mutate(
              { id: row.id, patch: row },
              { onSuccess: () => { toast.success("Customer updated"); setEditing(null); } },
            );
          } else {
            insert.mutate(row, {
              onSuccess: () => { toast.success("Customer added"); setEditing(null); },
            });
          }
        }}
        busy={insert.isPending || update.isPending}
      />
    </PageShell>
  );
}

function CustomerDialog({
  editing, onClose, onSave, busy,
}: { editing: Partial<Customer> | null; onClose: () => void; onSave: (row: Partial<Customer>) => void; busy: boolean }) {
  const [form, setForm] = useState<Partial<Customer>>({});
  // sync when editing changes
  if (editing && form !== editing && (form.id ?? undefined) !== (editing.id ?? undefined)) {
    setForm(editing);
  }

  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing?.id ? "Edit Customer" : "New Customer"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Full Name" required>
            <input
              value={form.full_name ?? ""}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
              placeholder="Juan Dela Cruz"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"><input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" /></Field>
            <Field label="Phone"><input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" /></Field>
          </div>
          <Field label="Address"><input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" /></Field>
          <Field label="Notes"><textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" /></Field>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button
            disabled={busy || !form.full_name}
            onClick={() => onSave(form)}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
          >{busy ? "Saving…" : "Save"}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
