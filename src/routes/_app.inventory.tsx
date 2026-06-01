import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, CATALOG_NAV } from "@/components/sub-nav";
import { useMemo, useState } from "react";
import { useInventoryLevels, useProducts, useWarehouses, useSuppliers,
  usePurchaseOrders, useStockMovements, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Boxes, AlertTriangle, Layers, Search, Plus, ArrowLeftRight, Truck,
  Archive, TrendingUp, Edit2, Trash2, Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({ component: Inventory });

type Tab = "Stock" | "Movements" | "Purchase Orders" | "Suppliers" | "Warehouses";

function Inventory() {
  const [tab, setTab] = useState<Tab>("Stock");
  const [adjustOpen, setAdjustOpen] = useState<any | null>(null);
  const [newStockOpen, setNewStockOpen] = useState(false);

  const { data: levels = [] } = useInventoryLevels();

  const k = useMemo(() => {
    const totalUnits = levels.reduce((s: number, r: any) => s + (r.quantity || 0), 0);
    const low = levels.filter((r: any) => r.quantity > 0 && r.quantity <= (r.reorder_point || 0)).length;
    const out = levels.filter((r: any) => r.quantity === 0).length;
    const reserved = levels.reduce((s: number, r: any) => s + (r.reserved_quantity || 0), 0);
    const totalCost = levels.reduce((s: number, r: any) => s + (r.quantity || 0) * Number(r.product?.cost_price || 0), 0);
    const totalRetail = levels.reduce((s: number, r: any) => s + (r.quantity || 0) * Number(r.product?.retail_price || r.product?.base_price || 0), 0);
    return { totalUnits, low, out, reserved, skus: levels.length, totalCost, totalRetail };
  }, [levels]);

  return (
    <PageShell title="Inventory" subtitle="Stock, movements, POs, suppliers & warehouses.">
      <SubNav items={CATALOG_NAV} label="Catalog" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Inventory Value (Cost)" value={peso(k.totalCost)} icon={Wallet} />
        <Kpi label="Inventory Value (Retail)" value={peso(k.totalRetail)} icon={TrendingUp} />
        <Kpi label="Total Units" value={k.totalUnits.toLocaleString()} icon={Layers} />
        <Kpi label="SKUs Tracked" value={k.skus} icon={Boxes} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Kpi label="Reserved" value={k.reserved} icon={TrendingUp} />
        <Kpi label="Low Stock" value={k.low} icon={AlertTriangle} tone="warn" />
        <Kpi label="Out of Stock" value={k.out} icon={Archive} tone="danger" />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 rounded-xl bg-card border border-border shadow-soft p-1 overflow-x-auto">
          {(["Stock", "Movements", "Purchase Orders", "Suppliers", "Warehouses"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition ${tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {tab === "Stock" && (
            <button onClick={() => setNewStockOpen(true)} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft hover:opacity-95">
              <Plus className="h-3.5 w-3.5" />Add Stock Record
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        {tab === "Stock" && <StockTab levels={levels} onAdjust={setAdjustOpen} />}
        {tab === "Movements" && <MovementsTab />}
        {tab === "Purchase Orders" && <POTab />}
        {tab === "Suppliers" && <SuppliersTab />}
        {tab === "Warehouses" && <WarehousesTab />}
      </div>

      <AdjustDialog row={adjustOpen} onClose={() => setAdjustOpen(null)} />
      <NewStockDialog open={newStockOpen} onClose={() => setNewStockOpen(false)} />
    </PageShell>
  );
}

function Kpi({ label, value, icon: Icon, tone }: { label: string; value: any; icon: any; tone?: "warn" | "danger" }) {
  const c = tone === "warn" ? "text-amber-600" : tone === "danger" ? "text-rose-600" : "text-foreground";
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${c}`} />
      </div>
      <div className={`text-2xl font-bold mt-1 ${c}`}>{value}</div>
    </div>
  );
}

/* ---------- Stock ---------- */
function StockTab({ levels, onAdjust }: { levels: any[]; onAdjust: (r: any) => void }) {
  const [q, setQ] = useState("");
  const filtered = levels.filter((r) => !q || r.product?.name?.toLowerCase().includes(q.toLowerCase()) || r.product?.sku?.toLowerCase().includes(q.toLowerCase()));
  const totals = useMemo(() => {
    const units = filtered.reduce((s, r: any) => s + (r.quantity || 0), 0);
    const cost = filtered.reduce((s, r: any) => s + (r.quantity || 0) * Number(r.product?.cost_price || 0), 0);
    const retail = filtered.reduce((s, r: any) => s + (r.quantity || 0) * Number(r.product?.retail_price || r.product?.base_price || 0), 0);
    return { units, cost, retail };
  }, [filtered]);
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
      <div className="p-3 border-b border-border">
        <div className="relative max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border text-sm" />
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
          <tr>
            <th className="text-left font-medium px-6 py-3">Product</th>
            <th className="text-left font-medium px-6 py-3">SKU</th>
            <th className="text-left font-medium px-6 py-3">Warehouse</th>
            <th className="text-right font-medium px-6 py-3">On Hand</th>
            <th className="text-right font-medium px-6 py-3">Reserved</th>
            <th className="text-right font-medium px-6 py-3">Reorder</th>
            <th className="text-right font-medium px-6 py-3">Cost</th>
            <th className="text-right font-medium px-6 py-3">Value</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={9} className="text-center px-6 py-10 text-muted-foreground">No stock records. Add one to get started.</td></tr>
          ) : filtered.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
              <td className="px-6 py-3 font-medium">{r.product?.name ?? "—"}</td>
              <td className="px-6 py-3 text-muted-foreground text-xs">{r.product?.sku}</td>
              <td className="px-6 py-3">{r.warehouse?.name ?? "—"}</td>
              <td className={`px-6 py-3 text-right font-semibold ${r.quantity === 0 ? "text-rose-600" : r.quantity <= r.reorder_point ? "text-amber-600" : ""}`}>{r.quantity}</td>
              <td className="px-6 py-3 text-right text-muted-foreground">{r.reserved_quantity}</td>
              <td className="px-6 py-3 text-right text-muted-foreground">{r.reorder_point}</td>
              <td className="px-6 py-3 text-right text-muted-foreground">{peso(Number(r.product?.cost_price || 0))}</td>
              <td className="px-6 py-3 text-right font-semibold">{peso((r.quantity || 0) * Number(r.product?.cost_price || 0))}</td>
              <td className="px-6 py-3 text-right">
                <button onClick={() => onAdjust(r)} className="text-xs font-semibold text-foreground hover:underline">Adjust</button>
              </td>
            </tr>
          ))}
        </tbody>
        {filtered.length > 0 && (
          <tfoot className="bg-secondary/40 border-t-2 border-border">
            <tr>
              <td className="px-6 py-3 font-bold" colSpan={3}>TOTAL</td>
              <td className="px-6 py-3 text-right font-bold">{totals.units.toLocaleString()}</td>
              <td className="px-6 py-3"></td>
              <td className="px-6 py-3"></td>
              <td className="px-6 py-3 text-right text-xs text-muted-foreground">Retail: {peso(totals.retail)}</td>
              <td className="px-6 py-3 text-right font-bold text-base">{peso(totals.cost)}</td>
              <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/* ---------- Adjust Dialog ---------- */
function AdjustDialog({ row, onClose }: { row: any | null; onClose: () => void }) {
  const [delta, setDelta] = useState(0);
  const [type, setType] = useState<"adjustment" | "in" | "out">("adjustment");
  const [note, setNote] = useState("");
  const qc = useQueryClient();

  async function submit() {
    if (!row || !delta) return;
    try {
      const newQty = type === "out" ? row.quantity - Math.abs(delta) : type === "in" ? row.quantity + Math.abs(delta) : row.quantity + delta;
      const { error: e1 } = await supabase.from("inventory_levels").update({ quantity: newQty }).eq("id", row.id);
      if (e1) throw e1;
      const { data: u } = await supabase.auth.getUser();
      const { error: e2 } = await supabase.from("stock_movements").insert({
        product_id: row.product_id, variant_id: row.variant_id, warehouse_id: row.warehouse_id,
        movement_type: type === "in" ? "purchase" : type === "out" ? "sale" : "adjustment",
        quantity: type === "out" ? -Math.abs(delta) : Math.abs(delta),
        notes: note, created_by: u.user?.id ?? null,
      });
      if (e2) throw e2;
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Stock updated");
      onClose(); setDelta(0); setNote("");
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Adjust Stock — {row?.product?.name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Current: <span className="font-semibold text-foreground">{row?.quantity}</span> @ {row?.warehouse?.name}</div>
          <div className="grid grid-cols-3 gap-2">
            {(["in", "out", "adjustment"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`h-9 rounded-lg text-xs font-semibold border ${type === t ? "bg-foreground text-background border-foreground" : "border-border"}`}>
                {t === "in" ? "Stock In" : t === "out" ? "Stock Out" : "Adjust"}
              </button>
            ))}
          </div>
          <Field label="Quantity"><input type="number" value={delta} onChange={(e) => setDelta(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <Field label="Note"><input value={note} onChange={(e) => setNote(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          <button onClick={submit} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Apply</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- New Stock Record ---------- */
function NewStockDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: products = [] } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [reorder, setReorder] = useState(0);
  const ins = useInsert("inventory_levels");
  const canEdit = useIsOwner();

  async function submit() {
    if (!productId || !warehouseId) return toast.error("Pick product and warehouse");
    await ins.mutateAsync({ product_id: productId, warehouse_id: warehouseId, quantity, reorder_point: reorder });
    toast.success("Stock record created"); onClose();
    setProductId(""); setWarehouseId(""); setQuantity(0); setReorder(0);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Stock Record</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Product">
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">Select...</option>
              {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </Field>
          <Field label="Warehouse">
            <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
              <option value="">Select...</option>
              {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Initial Qty"><input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Reorder Point"><input type="number" value={reorder} onChange={(e) => setReorder(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          </div>
          <button onClick={submit} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Create</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Movements ---------- */
function MovementsTab() {
  const { data: movs = [] } = useStockMovements();
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
          <tr>
            <th className="text-left font-medium px-6 py-3">Date</th>
            <th className="text-left font-medium px-6 py-3">Type</th>
            <th className="text-left font-medium px-6 py-3">Product</th>
            <th className="text-left font-medium px-6 py-3">Warehouse</th>
            <th className="text-right font-medium px-6 py-3">Qty</th>
            <th className="text-left font-medium px-6 py-3">Note</th>
          </tr>
        </thead>
        <tbody>
          {movs.length === 0 ? (
            <tr><td colSpan={6} className="text-center px-6 py-10 text-muted-foreground">No movements yet.</td></tr>
          ) : movs.map((m: any) => (
            <tr key={m.id} className="border-t border-border">
              <td className="px-6 py-3 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</td>
              <td className="px-6 py-3 capitalize">{m.movement_type}</td>
              <td className="px-6 py-3">{m.product?.name ?? "—"}</td>
              <td className="px-6 py-3">{m.warehouse?.name ?? "—"}</td>
              <td className={`px-6 py-3 text-right font-semibold ${m.quantity < 0 ? "text-rose-600" : "text-emerald-700"}`}>{m.quantity > 0 ? "+" : ""}{m.quantity}</td>
              <td className="px-6 py-3 text-muted-foreground">{m.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Purchase Orders ---------- */
function POTab() {
  const { data: pos = [] } = usePurchaseOrders();
  const { data: suppliers = [] } = useSuppliers();
  const { data: warehouses = [] } = useWarehouses();
  const [open, setOpen] = useState(false);
  const ins = useInsert("purchase_orders");
  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [expected, setExpected] = useState("");

  async function submit() {
    if (!supplier || !warehouse) return toast.error("Supplier and warehouse required");
    await ins.mutateAsync({
      po_number: `PO-${Date.now().toString().slice(-8)}`,
      supplier_id: supplier, warehouse_id: warehouse,
      expected_at: expected || null, status: "draft",
    });
    toast.success("PO created"); setOpen(false); setSupplier(""); setWarehouse(""); setExpected("");
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setOpen(true)} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-3.5 w-3.5" />New PO
        </button>
      </div>
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr><th className="text-left font-medium px-6 py-3">PO #</th><th className="text-left font-medium px-6 py-3">Supplier</th><th className="text-left font-medium px-6 py-3">Warehouse</th><th className="text-left font-medium px-6 py-3">Status</th><th className="text-left font-medium px-6 py-3">Expected</th><th className="text-right font-medium px-6 py-3">Total</th></tr>
          </thead>
          <tbody>
            {pos.length === 0 ? (
              <tr><td colSpan={6} className="text-center px-6 py-10 text-muted-foreground">No purchase orders yet.</td></tr>
            ) : pos.map((p: any) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-6 py-3 font-medium">{p.po_number}</td>
                <td className="px-6 py-3">{p.supplier?.name}</td>
                <td className="px-6 py-3">{p.warehouse?.name}</td>
                <td className="px-6 py-3 capitalize">{p.status}</td>
                <td className="px-6 py-3 text-xs text-muted-foreground">{p.expected_at ?? "—"}</td>
                <td className="px-6 py-3 text-right font-semibold">{peso(Number(p.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Supplier">
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
                <option value="">Select...</option>
                {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Warehouse">
              <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
                <option value="">Select...</option>
                {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Expected Date"><input type="date" value={expected} onChange={(e) => setExpected(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <button onClick={submit} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Create</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Suppliers ---------- */
function SuppliersTab() {
  const { data: suppliers = [] } = useSuppliers();
  const ins = useInsert("suppliers");
  const upd = useUpdate("suppliers");
  const del = useDelete("suppliers");
  const canEdit = useIsOwner();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-3.5 w-3.5" />New Supplier
        </button>
      </div>
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr><th className="text-left font-medium px-6 py-3">Name</th><th className="text-left font-medium px-6 py-3">Contact</th><th className="text-left font-medium px-6 py-3">Email</th><th className="text-left font-medium px-6 py-3">Phone</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr><td colSpan={5} className="text-center px-6 py-10 text-muted-foreground">No suppliers yet.</td></tr>
            ) : suppliers.map((s: any) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-6 py-3 font-medium">{s.name}</td>
                <td className="px-6 py-3">{s.contact_person}</td>
                <td className="px-6 py-3 text-muted-foreground">{s.email}</td>
                <td className="px-6 py-3 text-muted-foreground">{s.phone}</td>
                <td className="px-6 py-3 text-right">
                  <button disabled={!canEdit} onClick={() => { setEditing(s); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button disabled={!canEdit} onClick={() => { if (confirm("Delete?")) del.mutate(s.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EntityDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Supplier" : "New Supplier"}
        initial={editing ?? { name: "", contact_person: "", email: "", phone: "", address: "" }}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "contact_person", label: "Contact Person" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
        ]}
        onSubmit={async (v) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync(v);
          toast.success("Saved"); setOpen(false);
        }} />
    </div>
  );
}

/* ---------- Warehouses ---------- */
function WarehousesTab() {
  const { data: warehouses = [] } = useWarehouses();
  const ins = useInsert("warehouses");
  const upd = useUpdate("warehouses");
  const del = useDelete("warehouses");
  const canEdit = useIsOwner();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-3.5 w-3.5" />New Warehouse
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {warehouses.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground text-sm">No warehouses yet.</div>
        ) : warehouses.map((w: any) => (
          <div key={w.id} className="rounded-2xl bg-card border border-border shadow-soft p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{w.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{w.address}</div>
              </div>
              <div className="flex gap-1">
                <button disabled={!canEdit} onClick={() => { setEditing(w); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                <button disabled={!canEdit} onClick={() => { if (confirm("Delete?")) del.mutate(w.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EntityDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Warehouse" : "New Warehouse"}
        initial={editing ?? { name: "", address: "" }}
        fields={[{ key: "name", label: "Name", required: true }, { key: "address", label: "Address" }]}
        onSubmit={async (v) => {
          if (editing) await upd.mutateAsync({ id: editing.id, patch: v });
          else await ins.mutateAsync(v);
          toast.success("Saved"); setOpen(false);
        }} />
    </div>
  );
}

/* ---------- Reusable ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function EntityDialog({ open, onClose, title, initial, fields, onSubmit }: {
  open: boolean; onClose: () => void; title: string;
  initial: Record<string, any>; fields: { key: string; label: string; required?: boolean }[];
  onSubmit: (v: any) => void;
}) {
  const [v, setV] = useState(initial);
  // reset when initial changes
  useMemo(() => setV(initial), [open]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {fields.map((f) => (
            <Field key={f.key} label={f.label + (f.required ? " *" : "")}>
              <input value={v[f.key] ?? ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border" />
            </Field>
          ))}
          <button onClick={() => onSubmit(v)} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
