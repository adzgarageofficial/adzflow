import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useList, useProducts, useInsert, useUpdate, useDelete, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/fitment")({ component: FitmentPage });

function FitmentPage() {
  const { data: fitments = [] } = useList<any>("fitments", {
    select: "*, product:products(id,name,sku)",
    order: { column: "created_at", ascending: false },
  });
  const { data: products = [] } = useProducts();
  const ins = useInsert("fitments");
  const canEdit = useIsOwner();
  const upd = useUpdate("fitments");
  const del = useDelete("fitments");
  const [q, setQ] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const filtered = useMemo(() => fitments.filter((f: any) =>
    (!make || f.make?.toLowerCase().includes(make.toLowerCase())) &&
    (!model || f.model?.toLowerCase().includes(model.toLowerCase())) &&
    (!q || f.product?.name?.toLowerCase().includes(q.toLowerCase()))
  ), [fitments, q, make, model]);

  return (
    <PageShell title="Fitment" subtitle="Match products to vehicle make / model / year.">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative w-56">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Product..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make" className="w-32 h-10 px-3 rounded-xl border border-border bg-card text-sm" />
        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" className="w-32 h-10 px-3 rounded-xl border border-border bg-card text-sm" />
        <div className="flex-1" />
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />Add Fitment
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr><th className="text-left font-medium px-6 py-3">Product</th><th className="text-left font-medium px-6 py-3">Make</th><th className="text-left font-medium px-6 py-3">Model</th><th className="text-left font-medium px-6 py-3">Year Range</th><th className="text-left font-medium px-6 py-3">Notes</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No fitment data yet.</td></tr>
            ) : filtered.map((f: any) => (
              <tr key={f.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3 font-medium">{f.product?.name ?? "—"}</td>
                <td className="px-6 py-3">{f.make}</td>
                <td className="px-6 py-3">{f.model}</td>
                <td className="px-6 py-3 text-xs text-muted-foreground">{f.year_from ?? "—"} – {f.year_to ?? "—"}</td>
                <td className="px-6 py-3 text-muted-foreground truncate max-w-xs">{f.notes}</td>
                <td className="px-6 py-3 text-right">
                  <button disabled={!canEdit} onClick={() => { setEditing(f); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button disabled={!canEdit} onClick={() => { if (confirm("Delete?")) del.mutate(f.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FitmentDialog open={open} editing={editing} products={products} onClose={() => setOpen(false)}
        onSave={async (v: any) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync(v);
          toast.success("Saved"); setOpen(false);
        }} />
    </PageShell>
  );
}

function FitmentDialog({ open, editing, products, onClose, onSave }: any) {
  const [v, setV] = useState<any>({});
  useMemo(() => setV(editing ?? { product_id: "", make: "", model: "", year_from: null, year_to: null, notes: "" }), [open, editing]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit Fitment" : "New Fitment"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Product *">
            <select value={v.product_id ?? ""} onChange={(e) => setV({ ...v, product_id: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">Select...</option>
              {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Make *"><input value={v.make ?? ""} onChange={(e) => setV({ ...v, make: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Model *"><input value={v.model ?? ""} onChange={(e) => setV({ ...v, model: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Year From"><input type="number" value={v.year_from ?? ""} onChange={(e) => setV({ ...v, year_from: e.target.value ? Number(e.target.value) : null })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Year To"><input type="number" value={v.year_to ?? ""} onChange={(e) => setV({ ...v, year_to: e.target.value ? Number(e.target.value) : null })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          </div>
          <Field label="Notes"><textarea value={v.notes ?? ""} onChange={(e) => setV({ ...v, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border" /></Field>
          <button onClick={() => { if (!v.product_id || !v.make || !v.model) return toast.error("Product, make, model required"); onSave(v); }} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: any) {
  return (<div><label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label><div className="mt-1">{children}</div></div>);
}
