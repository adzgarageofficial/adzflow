import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";
import { Tag, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDiscounts, useInsert, useUpdate, useDelete, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/discounts")({ component: Discounts });

const TYPES = ["percentage", "fixed"];

function Discounts() {
  const { data: discounts = [] } = useDiscounts();
  const ins = useInsert("discounts");
  const canEdit = useIsOwner();
  const upd = useUpdate("discounts");
  const del = useDelete("discounts");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const filtered = discounts.filter((d: any) =>
    !q || [d.code, d.description].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      code: (fd.get("code") as string).toUpperCase(),
      description: (fd.get("description") as string) || null,
      discount_type: fd.get("discount_type"),
      value: Number(fd.get("value")),
      starts_at: (fd.get("starts_at") as string) || null,
      ends_at: (fd.get("ends_at") as string) || null,
      usage_limit: Number(fd.get("usage_limit") || 0) || null,
      is_active: fd.get("is_active") === "on",
    };
    try {
      if (editing) await upd.mutateAsync({ id: editing.id, patch: payload });
      else await ins.mutateAsync(payload);
      toast.success(editing ? "Discount updated" : "Discount created");
      setOpen(false); setEditing(null);
    } catch { /* handled */ }
  };

  return (
    <PageShell title="Discounts & Promotions" subtitle="Create coupons and run promos.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />New Discount
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border shadow-soft p-10 text-center text-muted-foreground">No discounts yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((d: any) => (
            <div key={d.id} className="rounded-2xl bg-card border border-border shadow-soft p-5">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <span className={d.is_active
                  ? "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                }>{d.is_active ? "Active" : "Inactive"}</span>
              </div>
              <p className="mt-3 font-bold tracking-tight">{d.code}</p>
              <p className="text-sm text-muted-foreground">
                {d.discount_type === "percentage" ? `${d.value}% off` : `₱${d.value} off`}
                {d.description ? ` — ${d.description}` : ""}
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {d.usage_count || 0} uses{d.usage_limit ? ` / ${d.usage_limit}` : ""}
                {d.ends_at ? ` · ends ${d.ends_at}` : ""}
              </p>
              <div className="mt-3 flex gap-2">
                <button disabled={!canEdit} onClick={() => { setEditing(d); setOpen(true); }} className="flex-1 h-8 rounded-lg border border-border text-xs inline-flex items-center justify-center gap-1"><Edit2 className="h-3 w-3" />Edit</button>
                <button disabled={!canEdit} onClick={() => { if (confirm("Delete discount?")) del.mutate(d.id); }} className="h-8 px-3 rounded-lg border border-border text-xs text-rose-600 hover:bg-rose-50 inline-flex items-center"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Discount</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Code<input name="code" required defaultValue={editing?.code ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm uppercase" /></label>
              <label className="text-xs font-medium">Type<select name="discount_type" required defaultValue={editing?.discount_type ?? "percentage"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
              <label className="text-xs font-medium">Value<input name="value" type="number" step="0.01" required defaultValue={editing?.value ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Usage Limit<input name="usage_limit" type="number" defaultValue={editing?.usage_limit ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Starts<input name="starts_at" type="date" defaultValue={editing?.starts_at ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Ends<input name="ends_at" type="date" defaultValue={editing?.ends_at ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
            </div>
            <label className="text-xs font-medium block">Description<textarea name="description" rows={2} defaultValue={editing?.description ?? ""} className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-card text-sm" /></label>
            <label className="text-xs font-medium inline-flex items-center gap-2"><input name="is_active" type="checkbox" defaultChecked={editing?.is_active ?? true} className="h-4 w-4 rounded border-border" />Active</label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
              <button type="submit" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editing ? "Save" : "Create"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
