import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, PROCUREMENT_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Plus, Trash2, PackageCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  usePurchaseOrders,
  usePurchaseOrderItems,
  useSuppliers,
  useWarehouses,
  useProducts,
  useInsert,
  useUpdate,
  peso,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/purchase-orders")({ component: POPage });

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  ordered: "bg-blue-500/10 text-blue-500",
  partial: "bg-amber-500/10 text-amber-500",
  received: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-rose-500/10 text-rose-500",
};

function POPage() {
  const { data: pos = [], isLoading } = usePurchaseOrders();
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<any | null>(null);

  return (
    <PageShell
      title="Purchase Orders"
      subtitle="Mag-order ng stocks galing sa mga suppliers."
      actions={
        <button onClick={() =>
      setCreating(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> New PO
        </button>
      }
    >
      <SubNav items={PROCUREMENT_NAV} label="Procurement" />
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">PO #</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="text-right font-medium px-6 py-3">Total</th>
              <th className="text-left font-medium px-6 py-3">Expected</th>
              <th className="text-left font-medium px-6 py-3">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (pos as any[]).length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Wala pang PO. Gumawa ng bago.</td></tr>
            ) : (
              (pos as any[]).map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setViewing(p)}>
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div>
                      <div>{p.po_number}</div>
                      <div className="text-xs text-muted-foreground font-normal">{p.supplier?.name ?? "—"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[p.status] ?? "bg-muted"}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold">{peso(Number(p.total))}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{p.expected_at ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right text-xs text-muted-foreground">View →</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewPODialog open={creating} onClose={() => setCreating(false)} />
      <PODetailDialog po={viewing} onClose={() => setViewing(null)} />
    </PageShell>
  );
}

function NewPODialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: suppliers = [] } = useSuppliers();
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const insertPO = useInsert<any>("purchase_orders");
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({ status: "draft", po_number: "", supplier_id: "", warehouse_id: "", expected_at: "" });
  const [items, setItems] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const subtotal = items.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.unit_cost || 0), 0);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1, unit_cost: 0 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: any) => setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const save = async () => {
    if (!form.supplier_id || !form.warehouse_id || items.length === 0) {
      toast.error("Supplier, warehouse, at items required");
      return;
    }
    setBusy(true);
    try {
      const po_number = form.po_number || `PO-${Date.now().toString().slice(-6)}`;
      const total = subtotal;
      const po: any = await new Promise((resolve, reject) =>
        insertPO.mutate(
          { ...form, po_number, subtotal, tax: 0, total },
          { onSuccess: resolve, onError: reject },
        ),
      );
      const lines = items.map((i) => ({
        purchase_order_id: po.id,
        product_id: i.product_id,
        quantity: Number(i.quantity),
        unit_cost: Number(i.unit_cost),
        line_total: Number(i.quantity) * Number(i.unit_cost),
      }));
      const { error } = await supabase.from("purchase_order_items").insert(lines);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["purchase_orders"] });
      toast.success(`PO ${po_number} created`);
      onClose();
      setForm({ status: "draft", po_number: "", supplier_id: "", warehouse_id: "", expected_at: "" });
      setItems([]);
    } catch (e: any) {
      toast.error(e.message || "Failed to create PO");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Supplier" required>
              <select className="input" value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}>
                <option value="">— select —</option>
                {(suppliers as any[]).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Warehouse" required>
              <select className="input" value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}>
                <option value="">— select —</option>
                {(warehouses as any[]).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Expected Date">
              <input type="date" className="input" value={form.expected_at} onChange={(e) => setForm({ ...form, expected_at: e.target.value })} />
            </Field>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-secondary/60 px-4 py-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Line Items</div>
              <button onClick={addItem} className="text-xs text-primary hover:underline">+ Add Item</button>
            </div>
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Wala pang items. Click "+ Add Item".</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr><th className="text-left px-3 py-2">Product</th><th className="px-3 py-2 w-20">Qty</th><th className="px-3 py-2 w-28">Unit Cost</th><th className="px-3 py-2 w-28 text-right">Line</th><th className="w-10"></th></tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-3 py-2">
                        <select className="input" value={it.product_id} onChange={(e) => updateItem(idx, { product_id: e.target.value })}>
                          <option value="">—</option>
                          {(products as any[]).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2"><input type="number" className="input" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: e.target.value })} /></td>
                      <td className="px-3 py-2"><input type="number" step="0.01" className="input" value={it.unit_cost} onChange={(e) => updateItem(idx, { unit_cost: e.target.value })} /></td>
                      <td className="px-3 py-2 text-right font-mono text-xs">{peso(Number(it.quantity || 0) * Number(it.unit_cost || 0))}</td>
                      <td className="px-3 py-2"><button onClick={() => removeItem(idx)} className="p-1 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-right text-sm">
            <div className="text-lg font-bold mt-1">Total: <span className="font-mono">{peso(subtotal)}</span></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={busy} onClick={save} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
            {busy ? "Saving…" : "Create PO"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PODetailDialog({ po, onClose }: { po: any | null; onClose: () => void }) {
  const { data: items = [] } = usePurchaseOrderItems(po?.id);
  const update = useUpdate<any>("purchase_orders");
  const qc = useQueryClient();

  if (!po) return null;

  const receive = async () => {
    if (!confirm(`Mark ${po.po_number} as received and update stock?`)) return;
    try {
      // Update PO status
      await new Promise((resolve, reject) =>
        update.mutate(
          { id: po.id, patch: { status: "received", received_at: new Date().toISOString().slice(0, 10) } },
          { onSuccess: resolve, onError: reject },
        ),
      );
      // Insert stock movements + bump inventory
      for (const it of items as any[]) {
        await supabase.from("stock_movements").insert({
          product_id: it.product_id,
          warehouse_id: po.warehouse_id,
          movement_type: "purchase",
          quantity: it.quantity,
          reference_type: "purchase_order",
          reference_id: po.id,
          notes: `PO ${po.po_number}`,
        });
        // Upsert inventory_levels
        const { data: existing } = await supabase
          .from("inventory_levels")
          .select("id,quantity")
          .eq("product_id", it.product_id)
          .eq("warehouse_id", po.warehouse_id)
          .maybeSingle();
        if (existing) {
          await supabase.from("inventory_levels").update({ quantity: Number(existing.quantity) + Number(it.quantity) }).eq("id", existing.id);
        } else {
          await supabase.from("inventory_levels").insert({ product_id: it.product_id, warehouse_id: po.warehouse_id, quantity: it.quantity });
        }
        await supabase.from("purchase_order_items").update({ received_quantity: it.quantity }).eq("id", it.id);
      }
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Stocks updated!");
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog open={!!po} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {po.po_number}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[po.status] ?? "bg-muted"}`}>{po.status}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Supplier:</span> <span className="font-semibold">{po.supplier?.name}</span></div>
            <div><span className="text-muted-foreground">Warehouse:</span> <span className="font-semibold">{po.warehouse?.name}</span></div>
            <div><span className="text-muted-foreground">Expected:</span> {po.expected_at ?? "—"}</div>
            <div><span className="text-muted-foreground">Received:</span> {po.received_at ?? "—"}</div>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs"><tr><th className="text-left px-3 py-2">Product</th><th className="text-right px-3 py-2">Qty</th><th className="text-right px-3 py-2">Received</th><th className="text-right px-3 py-2">Unit Cost</th><th className="text-right px-3 py-2">Line</th></tr></thead>
              <tbody>
                {(items as any[]).map((it) => (
                  <tr key={it.id} className="border-t border-border">
                    <td className="px-3 py-2">{it.product?.name ?? it.product_id}</td>
                    <td className="px-3 py-2 text-right">{it.quantity}</td>
                    <td className="px-3 py-2 text-right">{it.received_quantity}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{peso(Number(it.unit_cost))}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{peso(Number(it.line_total))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-secondary/30 font-semibold">
                <tr><td colSpan={4} className="px-3 py-2 text-right">Total</td><td className="px-3 py-2 text-right font-mono">{peso(Number(po.total))}</td></tr>
              </tfoot>
            </table>
          </div>
          {po.notes && <div className="text-xs text-muted-foreground">Notes: {po.notes}</div>}
        </div>
        <div className="flex justify-between gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm inline-flex items-center gap-1.5"><X className="h-4 w-4" /> Close</button>
          {po.status !== "received" && po.status !== "cancelled" && (
            <button onClick={receive} className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-1.5">
              <PackageCheck className="h-4 w-4" /> Mark as Received
            </button>
          )}
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