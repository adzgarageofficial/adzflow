import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, CATALOG_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeftRight, Plus, Trash2, Send, PackageCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStockTransfers, useWarehouses, useProducts, useInsert, useUpdate } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/stock-transfers")({ component: StockTransfersPage });

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_transit: "bg-amber-500/10 text-amber-500",
  received: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-rose-500/10 text-rose-500",
};

function StockTransfersPage() {
  const { data: transfers = [], isLoading } = useStockTransfers();
  const { data: warehouses = [] } = useWarehouses();
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<any | null>(null);

  const whName = (id: string) => (warehouses as any[]).find((w) => w.id === id)?.name ?? "—";

  return (
    <PageShell
      title="Stock Transfers"
      subtitle="Inter-warehouse stock movements between branches."
      actions={
        <button onClick={() =>
      setCreating(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> New Transfer
        </button>
      }
    >
      <SubNav items={CATALOG_NAV} label="Catalog" />
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Transfer #</th>
              <th className="text-left font-medium px-6 py-3">From → To</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="text-left font-medium px-6 py-3">Shipped</th>
              <th className="text-left font-medium px-6 py-3">Received</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (transfers as any[]).length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No stock transfers yet.</td></tr>
            ) : (
              (transfers as any[]).map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setViewing(t)}>
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <ArrowLeftRight className="h-4 w-4" />
                    </div>
                    {t.transfer_number}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="text-muted-foreground">{whName(t.source_warehouse_id)}</span>
                    <span className="mx-2 text-primary">→</span>
                    <span className="font-semibold">{whName(t.destination_warehouse_id)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[t.status]}`}>{t.status.replace("_", " ")}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{t.shipped_at ? new Date(t.shipped_at).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{t.received_at ? new Date(t.received_at).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4 text-right text-xs text-muted-foreground">View →</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewTransferDialog open={creating} onClose={() => setCreating(false)} />
      <TransferDetailDialog transfer={viewing} onClose={() => setViewing(null)} />
    </PageShell>
  );
}

function NewTransferDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const insertT = useInsert<any>("stock_transfers");
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({ source_warehouse_id: "", destination_warehouse_id: "", notes: "" });
  const [items, setItems] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const updateItem = (idx: number, patch: any) => setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const save = async () => {
    if (!form.source_warehouse_id || !form.destination_warehouse_id || form.source_warehouse_id === form.destination_warehouse_id || items.length === 0) {
      toast.error("Pumili ng different source at destination, at maglagay ng items");
      return;
    }
    setBusy(true);
    try {
      const transfer_number = `ST-${Date.now().toString().slice(-6)}`;
      const t: any = await new Promise((resolve, reject) =>
        insertT.mutate(
          { ...form, transfer_number, status: "draft" },
          { onSuccess: resolve, onError: reject },
        ),
      );
      const lines = items.map((i) => ({
        transfer_id: t.id,
        product_id: i.product_id,
        quantity: Number(i.quantity),
      }));
      const { error } = await supabase.from("stock_transfer_items").insert(lines);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["stock_transfers"] });
      toast.success(`Transfer ${transfer_number} created`);
      onClose();
      setForm({ source_warehouse_id: "", destination_warehouse_id: "", notes: "" });
      setItems([]);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Stock Transfer</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source Warehouse" required>
              <select className="input" value={form.source_warehouse_id} onChange={(e) => setForm({ ...form, source_warehouse_id: e.target.value })}>
                <option value="">— select —</option>
                {(warehouses as any[]).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Destination Warehouse" required>
              <select className="input" value={form.destination_warehouse_id} onChange={(e) => setForm({ ...form, destination_warehouse_id: e.target.value })}>
                <option value="">— select —</option>
                {(warehouses as any[]).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea className="input min-h-[60px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-secondary/60 px-4 py-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</div>
              <button onClick={addItem} className="text-xs text-primary hover:underline">+ Add Item</button>
            </div>
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No items yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground"><tr><th className="text-left px-3 py-2">Product</th><th className="px-3 py-2 w-24">Qty</th><th className="w-10"></th></tr></thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-3 py-2">
                        <select className="input" value={it.product_id} onChange={(e) => updateItem(idx, { product_id: e.target.value })}>
                          <option value="">—</option>
                          {(products as any[]).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2"><input type="number" min="1" className="input" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: e.target.value })} /></td>
                      <td className="px-3 py-2"><button onClick={() => removeItem(idx)} className="p-1 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={busy} onClick={save} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">{busy ? "Saving…" : "Create"}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TransferDetailDialog({ transfer, onClose }: { transfer: any | null; onClose: () => void }) {
  const update = useUpdate<any>("stock_transfers");
  const qc = useQueryClient();
  const { data: items = [] } = useQuery<any[]>({
    queryKey: ["stock_transfer_items", transfer?.id],
    enabled: !!transfer?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_transfer_items")
        .select("*, product:products(id,name,sku)")
        .eq("transfer_id", transfer!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!transfer) return null;

  const ship = async () => {
    if (!confirm("Mark as shipped? Stocks will be deducted from source warehouse.")) return;
    try {
      for (const it of items) {
        await supabase.from("stock_movements").insert({
          product_id: it.product_id,
          warehouse_id: transfer.source_warehouse_id,
          movement_type: "transfer_out",
          quantity: -Number(it.quantity),
          reference_type: "stock_transfer",
          reference_id: transfer.id,
        });
        const { data: lvl } = await supabase.from("inventory_levels").select("id,quantity").eq("product_id", it.product_id).eq("warehouse_id", transfer.source_warehouse_id).maybeSingle();
        if (lvl) await supabase.from("inventory_levels").update({ quantity: Number(lvl.quantity) - Number(it.quantity) }).eq("id", lvl.id);
      }
      await new Promise((resolve, reject) => update.mutate({ id: transfer.id, patch: { status: "in_transit", shipped_at: new Date().toISOString() } }, { onSuccess: resolve, onError: reject }));
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      toast.success("Shipped!");
      onClose();
    } catch (e: any) { toast.error(e.message); }
  };

  const receive = async () => {
    if (!confirm("Mark as received? Stocks will be added to destination.")) return;
    try {
      for (const it of items) {
        await supabase.from("stock_movements").insert({
          product_id: it.product_id,
          warehouse_id: transfer.destination_warehouse_id,
          movement_type: "transfer_in",
          quantity: Number(it.quantity),
          reference_type: "stock_transfer",
          reference_id: transfer.id,
        });
        const { data: lvl } = await supabase.from("inventory_levels").select("id,quantity").eq("product_id", it.product_id).eq("warehouse_id", transfer.destination_warehouse_id).maybeSingle();
        if (lvl) {
          await supabase.from("inventory_levels").update({ quantity: Number(lvl.quantity) + Number(it.quantity) }).eq("id", lvl.id);
        } else {
          await supabase.from("inventory_levels").insert({ product_id: it.product_id, warehouse_id: transfer.destination_warehouse_id, quantity: it.quantity });
        }
      }
      await new Promise((resolve, reject) => update.mutate({ id: transfer.id, patch: { status: "received", received_at: new Date().toISOString() } }, { onSuccess: resolve, onError: reject }));
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      toast.success("Received!");
      onClose();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <Dialog open={!!transfer} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {transfer.transfer_number}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[transfer.status]}`}>{transfer.status.replace("_", " ")}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs"><tr><th className="text-left px-3 py-2">Product</th><th className="text-right px-3 py-2">Qty</th></tr></thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.id} className="border-t border-border">
                  <td className="px-3 py-2">{it.product?.name ?? it.product_id}</td>
                  <td className="px-3 py-2 text-right">{it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Close</button>
          <div className="flex gap-2">
            {transfer.status === "draft" && (
              <button onClick={ship} className="h-9 px-4 rounded-lg bg-amber-600 text-white text-sm font-semibold inline-flex items-center gap-1.5"><Send className="h-4 w-4" /> Ship</button>
            )}
            {transfer.status === "in_transit" && (
              <button onClick={receive} className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-1.5"><PackageCheck className="h-4 w-4" /> Receive</button>
            )}
          </div>
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