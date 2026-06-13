import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, PROCUREMENT_NAV } from "@/components/sub-nav";
import { AmountInput } from "@/components/ui/amount-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Plus, Trash2, PackageCheck, X, CheckSquare, Square, Printer, Link2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  usePurchaseOrders,
  usePurchaseOrderItems,
  useSuppliers,
  useWarehouses,
  useProducts,
  useInsert,
  useUpdate,
  useMyProfile,
  peso,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/purchase-orders")({ component: POPage });

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  ordered: "bg-blue-500/10 text-blue-500",
  partial: "bg-amber-500/10 text-amber-500",
  received: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-rose-500/10 text-rose-500",
};

const UNIT_TYPES = ["Pc", "Set", "Pair", "Box", "Liter", "Gallon", "Kg", "Roll", "Sheet"];

// ─── List page ───────────────────────────────────────────────────────────────

function POPage() {
  const { data: pos = [], isLoading } = usePurchaseOrders();
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<any | null>(null);

  return (
    <PageShell
      title="Purchase Orders"
      subtitle="Mag-order ng stocks galing sa mga suppliers."
      actions={
        <button onClick={() => setCreating(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
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
              <th className="text-left font-medium px-6 py-3">Supplier Ref</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="text-right font-medium px-6 py-3">Total</th>
              <th className="text-left font-medium px-6 py-3">Expected</th>
              <th className="text-left font-medium px-6 py-3">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (pos as any[]).length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Wala pang PO. Gumawa ng bago.</td></tr>
            ) : (
              (pos as any[]).map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setViewing(p)}>
                  <td className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <div>
                        <div>{p.po_number}</div>
                        <div className="text-xs text-muted-foreground font-normal">{p.supplier?.name ?? "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{p.supplier_ref ?? "—"}</td>
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

// ─── New PO — Proforma-style form ────────────────────────────────────────────

function NewPODialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: suppliers = [] } = useSuppliers();
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const { data: myProfile } = useMyProfile();
  const insertPO = useInsert<any>("purchase_orders");
  const qc = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);
  const blank = {
    order_date: today, supplier_id: "", supplier_ref: "", warehouse_id: "",
    expected_at: "", credit_term: "", shipping_method: "",
    shipping_charges: "0", adjustments: "0", overall_discount_pct: "0", notes: "",
    bill_to: "ADZ GARAGE",
    bill_to_address: "Cabanatuan City, Nueva Ecija",
    prepared_by: "",
    status: "ordered",
  };
  const [form, setForm] = useState<any>(blank);
  const [items, setItems] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const selectedSupplier = (suppliers as any[]).find((s) => s.id === form.supplier_id);

  // Pre-fill Prepared By from profile once loaded
  useEffect(() => {
    if (myProfile && !form.prepared_by) {
      const name = `${myProfile.first_name ?? ""} ${myProfile.last_name ?? ""}`.trim() || myProfile.email || "";
      setForm((prev: any) => ({ ...prev, prepared_by: name }));
    }
  }, [myProfile]);

  const calcDiscountedUnitCost = (unitCost: number, discStr: string) => {
    if (!discStr || discStr === "0") return unitCost;
    const parts = String(discStr).split("/").map(Number).filter((n) => !isNaN(n) && n > 0);
    let price = unitCost;
    for (const d of parts) price = price * (1 - d / 100);
    return Math.round(price * 100) / 100;
  };

  const itemGross = (it: any) => Number(it.quantity || 0) * Number(it.unit_cost || 0);
  const itemNet = (it: any) => Number(it.quantity || 0) * calcDiscountedUnitCost(Number(it.unit_cost || 0), it.discount_pct);

  const grossTotal = items.reduce((s, i) => s + itemGross(i), 0);
  const subTotal = items.reduce((s, i) => s + itemNet(i), 0);
  const overallDiscPct = Number(form.overall_discount_pct || 0);
  const overallDiscAmt = subTotal * overallDiscPct / 100;
  const afterDiscount = subTotal - overallDiscAmt;
  const shippingCharges = Number(form.shipping_charges || 0);
  const adjustments = Number(form.adjustments || 0);
  const totalPrice = afterDiscount + shippingCharges + adjustments;

  const addItem = () => setItems([...items, { product_id: "", unit_type: "Pc", quantity: 1, unit_cost: 0, discount_pct: "" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: any) => setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const reset = () => { setForm(blank); setItems([]); };

  const save = async () => {
    if (!form.supplier_id || !form.warehouse_id || items.length === 0) {
      toast.error("Supplier, warehouse, at items ay required"); return;
    }
    setBusy(true);
    try {
      const po_number = `PO-${Date.now().toString().slice(-6)}`;
      const po: any = await new Promise((resolve, reject) =>
        insertPO.mutate(
          { ...form, po_number, subtotal: subTotal, tax: 0, total: totalPrice,
            shipping_charges: shippingCharges, adjustments, overall_discount_pct: overallDiscPct },
          { onSuccess: resolve, onError: reject },
        ),
      );
      const lines = items.map((i) => {
        const discounted_unit_cost = calcDiscountedUnitCost(Number(i.unit_cost), i.discount_pct);
        return {
          purchase_order_id: po.id,
          product_id: i.product_id,
          unit_type: i.unit_type || "Pc",
          quantity: Number(i.quantity),
          unit_cost: Number(i.unit_cost),
          discount_pct: i.discount_pct || "0",
          discounted_unit_cost,
          line_total: Number(i.quantity) * discounted_unit_cost,
        };
      });
      const { error } = await supabase.from("purchase_order_items").insert(lines as any);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["purchase_orders"] });
      toast.success(`${po_number} created`);
      reset(); onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to create PO");
    } finally {
      setBusy(false);
    }
  };

  const f = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">

        {/* Top bar */}
        <div className="sticky top-0 z-10 px-6 py-3 border-b border-border bg-card/95 backdrop-blur flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold">New Purchase Order</DialogTitle>
          <div className="flex gap-2">
            <button onClick={() => { reset(); onClose(); }} className="h-8 px-3 rounded-lg border border-border text-xs">Cancel</button>
            <button disabled={busy} onClick={save} className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50">
              {busy ? "Saving…" : "Create PO"}
            </button>
          </div>
        </div>

        {/* ═══ Proforma Document ═══ */}
        <div className="p-5">
          <div className="border border-border rounded-xl overflow-hidden bg-card text-sm shadow-sm">

            {/* ── Section 1: Date | Supplier letterhead | Ref # ── */}
            <div className="grid grid-cols-[180px_1fr_180px] border-b border-border">
              <div className="p-3 border-r border-border flex flex-col justify-center gap-1 bg-secondary/10">
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Proforma Date</div>
                <input type="date" className="input text-xs" value={form.order_date} onChange={(e) => f("order_date", e.target.value)} />
              </div>

              {/* Supplier info — looks like a letterhead */}
              <div className="p-3 text-center flex flex-col items-center justify-center gap-0.5 bg-secondary/5">
                {form.supplier_id ? (
                  <>
                    <div className="text-xl font-black uppercase tracking-tight leading-tight">{selectedSupplier?.name}</div>
                    {selectedSupplier?.address && <div className="text-xs text-muted-foreground">{selectedSupplier.address}</div>}
                    {(selectedSupplier?.phone || selectedSupplier?.email) && (
                      <div className="text-xs text-muted-foreground">
                        {[selectedSupplier.phone, selectedSupplier.email].filter(Boolean).join("  /  ")}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground italic py-2">Pumili ng supplier sa ibaba para lumabas ang info dito</div>
                )}
              </div>

              <div className="p-3 border-l border-border flex flex-col justify-center gap-1 items-end bg-secondary/10">
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Print Date</div>
                <div className="text-xs font-mono">{new Date().toLocaleDateString()}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">Ref / Proforma #</div>
                <input className="input text-xs text-right w-full" placeholder="PRO-204895" value={form.supplier_ref} onChange={(e) => f("supplier_ref", e.target.value)} />
              </div>
            </div>

            {/* ── Section 2: Bill To (left) | Order Details (right) ── */}
            <div className="grid grid-cols-2 border-b border-border">
              <div className="p-4 border-r border-border space-y-2 text-xs">
                <Row label="Bill To">
                  <input className="input text-xs flex-1 font-bold" value={form.bill_to} onChange={(e) => f("bill_to", e.target.value)} />
                </Row>
                <Row label="Address">
                  <input className="input text-xs flex-1" value={form.bill_to_address} onChange={(e) => f("bill_to_address", e.target.value)} />
                </Row>
                <Row label="Prepared By">
                  <input className="input text-xs flex-1" value={form.prepared_by} onChange={(e) => f("prepared_by", e.target.value)} />
                </Row>
                <Row label="Receive to" required>
                  <select className="input text-xs flex-1" value={form.warehouse_id} onChange={(e) => f("warehouse_id", e.target.value)}>
                    <option value="">— select warehouse —</option>
                    {(warehouses as any[]).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </Row>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <Row label="Supplier" required>
                  <select className="input text-xs flex-1" value={form.supplier_id} onChange={(e) => f("supplier_id", e.target.value)}>
                    <option value="">— select —</option>
                    {(suppliers as any[]).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Row>
                <Row label="Credit Term">
                  <input className="input text-xs flex-1" placeholder="—" value={form.credit_term} onChange={(e) => f("credit_term", e.target.value)} />
                </Row>
                <Row label="Shipping">
                  <input className="input text-xs flex-1" placeholder="TRUCKING - VIA AP CARGO RORO" value={form.shipping_method} onChange={(e) => f("shipping_method", e.target.value)} />
                </Row>
                <Row label="PO Number">
                  <span className="text-muted-foreground italic text-[11px]">Auto-generated on save</span>
                </Row>
                <Row label="Expected Date">
                  <input type="date" className="input text-xs flex-1" value={form.expected_at} onChange={(e) => f("expected_at", e.target.value)} />
                </Row>
              </div>
            </div>

            {/* ── Section 3: Item Details table ── */}
            <div>
              <div className="px-4 py-2 bg-secondary/30 border-b border-border flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Item Details</span>
                <button onClick={addItem} className="text-xs text-primary hover:underline font-medium">+ Add Item</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary/20 text-muted-foreground text-center">
                      <th className="px-3 py-2 font-medium w-16 border-b border-border">Qty</th>
                      <th className="px-3 py-2 font-medium w-20 border-b border-border">Unit Type</th>
                      <th className="px-3 py-2 font-medium text-left border-b border-border">Item Name</th>
                      <th className="px-3 py-2 font-medium w-28 border-b border-border text-right">Unit Price</th>
                      <th className="px-3 py-2 font-medium w-28 border-b border-border text-right">Cost</th>
                      <th className="px-3 py-2 font-medium w-24 border-b border-border">Discount(%)</th>
                      <th className="px-3 py-2 font-medium w-32 border-b border-border text-right">Discounted Cost</th>
                      <th className="w-8 border-b border-border"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground italic">
                          Wala pang items. Click "+ Add Item" sa taas.
                        </td>
                      </tr>
                    ) : (
                      items.map((it, idx) => {
                        const gross = itemGross(it);
                        const net = itemNet(it);
                        const hasDisc = it.discount_pct && it.discount_pct !== "0" && it.discount_pct !== "";
                        return (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/10">
                            <td className="px-2 py-1.5">
                              <input type="number" min="1" className="input text-center text-xs" value={it.quantity}
                                onChange={(e) => updateItem(idx, { quantity: e.target.value })} />
                            </td>
                            <td className="px-2 py-1.5">
                              <select className="input text-xs text-center" value={it.unit_type}
                                onChange={(e) => updateItem(idx, { unit_type: e.target.value })}>
                                {UNIT_TYPES.map((u) => <option key={u}>{u}</option>)}
                              </select>
                            </td>
                            <td className="px-2 py-1.5">
                              <select className="input text-xs" value={it.product_id}
                                onChange={(e) => updateItem(idx, { product_id: e.target.value })}>
                                <option value="">— select product —</option>
                                {(products as any[]).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                            </td>
                            <td className="px-2 py-1.5">
                              <AmountInput className="input text-right text-xs" value={Number(it.unit_cost) || null}
                                onChange={(val) => updateItem(idx, { unit_cost: val })} />
                            </td>
                            <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{peso(gross)}</td>
                            <td className="px-2 py-1.5">
                              <input className="input text-center text-xs" placeholder="20 / 20/5"
                                value={it.discount_pct}
                                onChange={(e) => updateItem(idx, { discount_pct: e.target.value })} />
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <div className="font-mono font-semibold">{peso(net)}</div>
                              {hasDisc && <div className="text-[10px] text-muted-foreground line-through">{peso(gross)}</div>}
                            </td>
                            <td className="px-2 py-1.5">
                              <button onClick={() => removeItem(idx)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Section 4: Remarks (left) | Totals breakdown (right) ── */}
            <div className="grid grid-cols-2 border-t border-border">
              <div className="p-4 border-r border-border">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Remarks:</div>
                <textarea
                  className="input w-full min-h-[110px] text-xs resize-none"
                  placeholder={"NO DR\nvia AP CARGO - RORO"}
                  value={form.notes}
                  onChange={(e) => f("notes", e.target.value)}
                />
              </div>

              <div className="p-4 text-xs space-y-2.5">
                {/* Item Total */}
                <div className="flex justify-between items-end">
                  <span className="text-muted-foreground font-medium">Item Total:</span>
                  <div className="text-right">
                    {grossTotal !== subTotal && (
                      <div className="line-through text-muted-foreground font-mono text-[11px]">{peso(grossTotal)}</div>
                    )}
                    <div className="font-mono font-semibold">{peso(subTotal)}</div>
                  </div>
                </div>

                {/* Sub Total */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Sub Total:</span>
                  <span className="font-mono font-semibold">{peso(subTotal)}</span>
                </div>

                {/* Overall Discount */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium whitespace-nowrap">Overall Discount:</span>
                  <div className="flex items-center gap-1.5 justify-end flex-1">
                    {overallDiscPct > 0 && (
                      <span className="line-through text-muted-foreground font-mono text-[10px]">{peso(subTotal)}</span>
                    )}
                    <input
                      type="number" min="0" max="100" step="0.01"
                      className="input text-center text-xs w-14"
                      value={form.overall_discount_pct}
                      onChange={(e) => f("overall_discount_pct", e.target.value)}
                    />
                    <span className="text-muted-foreground">%</span>
                    <span className="font-mono text-[11px]">{peso(afterDiscount)}</span>
                  </div>
                </div>

                {/* Shipping Charges */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium whitespace-nowrap">Shipping Charges:</span>
                  <AmountInput
                    className="input text-right text-xs w-28"
                    value={Number(form.shipping_charges) || null}
                    onChange={(val) => f("shipping_charges", String(val))}
                  />
                </div>

                {/* Adjustments */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium whitespace-nowrap">Adjustments:</span>
                  <AmountInput
                    className="input text-right text-xs w-28"
                    value={Number(form.adjustments) || null}
                    onChange={(val) => f("adjustments", String(val))}
                  />
                </div>

                {/* Total Price */}
                <div className="border-t border-border pt-2.5 flex justify-between items-center">
                  <span className="font-bold text-sm">Total Price:</span>
                  <span className="font-mono font-bold text-base text-primary">{peso(totalPrice)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── PO Detail / Receiving Checklist ─────────────────────────────────────────

const DR_STATUS_COLOR: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-600",
  confirmed: "bg-emerald-500/10 text-emerald-600",
  rejected:  "bg-rose-500/10 text-rose-600",
};

function PODetailDialog({ po, onClose }: { po: any | null; onClose: () => void }) {
  const { data: rawItems = [] } = usePurchaseOrderItems(po?.id);
  const items = rawItems as any[];
  const update = useUpdate<any>("purchase_orders");
  const qc = useQueryClient();

  const [checks, setChecks] = useState<Record<string, { checked: boolean; recvQty: number }>>({});
  const [busy, setBusy] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [deliveryToken, setDeliveryToken] = useState<string | null>(po?.delivery_token ?? null);
  const [linkBusy, setLinkBusy] = useState(false);

  const { data: deliveryReceipts = [] } = useQuery<any[]>({
    queryKey: ["po_delivery_receipts", po?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("po_delivery_receipts")
        .select("*, items:po_delivery_receipt_items(*, product:products(id,name,sku))")
        .eq("purchase_order_id", po!.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
    enabled: !!po?.id,
  });

  if (!po) return null;

  const generateOrCopyLink = async () => {
    let token = deliveryToken ?? po.delivery_token;
    if (!token) {
      setLinkBusy(true);
      try {
        const uuid = crypto.randomUUID();
        const { error } = await (supabase as any).from("purchase_orders").update({ delivery_token: uuid }).eq("id", po.id);
        if (error) throw error;
        token = uuid;
        setDeliveryToken(uuid);
        qc.invalidateQueries({ queryKey: ["purchase_orders"] });
      } catch (e: any) {
        toast.error(e.message || "Hindi ma-generate ang link");
        setLinkBusy(false);
        return;
      }
      setLinkBusy(false);
    }
    const url = `${window.location.origin}/delivery/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied! I-send sa supplier via Viber/SMS.");
    } catch {
      toast.info(`Delivery link: ${url}`);
    }
  };

  if (printing) {
    return <POPrintPreviewDialog po={po} items={items} onClose={() => setPrinting(false)} />;
  }

  const getCheck = (it: any) => checks[it.id] ?? { checked: false, recvQty: it.quantity - (it.received_quantity ?? 0) };
  const toggleCheck = (it: any) => { const c = getCheck(it); setChecks({ ...checks, [it.id]: { ...c, checked: !c.checked } }); };
  const setRecvQty = (it: any, val: number) => { const c = getCheck(it); setChecks({ ...checks, [it.id]: { ...c, recvQty: val } }); };
  const checkedItems = items.filter((it) => getCheck(it).checked);
  const fullyReceived = (it: any) => (it.received_quantity ?? 0) >= it.quantity;
  const canReceive = po.status !== "received" && po.status !== "cancelled";

  const receiveSelected = async () => {
    if (checkedItems.length === 0) { toast.error("Walang na-check na item"); return; }
    setBusy(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      for (const it of checkedItems) {
        const { recvQty } = getCheck(it);
        const newReceived = Math.min((it.received_quantity ?? 0) + recvQty, it.quantity);
        await supabase.from("stock_movements").insert({
          product_id: it.product_id, warehouse_id: po.warehouse_id,
          movement_type: "purchase", quantity: recvQty,
          reference_type: "purchase_order", reference_id: po.id,
          notes: `PO ${po.po_number}${po.supplier_ref ? ` / ${po.supplier_ref}` : ""}`,
        });
        const { data: existing } = await supabase.from("inventory_levels").select("id,quantity")
          .eq("product_id", it.product_id).eq("warehouse_id", po.warehouse_id).maybeSingle();
        if (existing) {
          await supabase.from("inventory_levels").update({ quantity: Number(existing.quantity) + recvQty }).eq("id", existing.id);
        } else {
          await supabase.from("inventory_levels").insert({ product_id: it.product_id, warehouse_id: po.warehouse_id, quantity: recvQty });
        }
        await (supabase.from("purchase_order_items") as any).update({ received_quantity: newReceived, received_at: today }).eq("id", it.id);
      }
      const { data: updatedItems } = await supabase.from("purchase_order_items").select("quantity,received_quantity").eq("purchase_order_id", po.id);
      const allDone = (updatedItems ?? []).every((i: any) => (i.received_quantity ?? 0) >= i.quantity);
      const anyDone = (updatedItems ?? []).some((i: any) => (i.received_quantity ?? 0) > 0);
      const newStatus = allDone ? "received" : anyDone ? "partial" : po.status;
      await new Promise((resolve, reject) =>
        update.mutate({ id: po.id, patch: { status: newStatus, ...(allDone ? { received_at: today } : {}) } }, { onSuccess: resolve, onError: reject }),
      );
      qc.invalidateQueries({ queryKey: ["purchase_orders"] });
      qc.invalidateQueries({ queryKey: ["purchase_order_items", po.id] });
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      setChecks({});
      toast.success(allDone ? "Lahat natanggap! Stocks updated." : "Partial delivery na-record. Stocks updated.");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!po} onOpenChange={(o) => { if (!o) { setChecks({}); onClose(); } }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            {po.po_number}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[po.status] ?? "bg-muted"}`}>{po.status}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 rounded-xl p-3">
          <div><span className="text-muted-foreground">Supplier:</span> <span className="font-semibold">{po.supplier?.name ?? "—"}</span></div>
          <div><span className="text-muted-foreground">Supplier Ref:</span> <span className="font-semibold">{po.supplier_ref ?? "—"}</span></div>
          <div><span className="text-muted-foreground">Warehouse:</span> <span className="font-semibold">{po.warehouse?.name ?? "—"}</span></div>
          <div><span className="text-muted-foreground">Shipping:</span> {po.shipping_method ?? "—"}</div>
          <div><span className="text-muted-foreground">Expected:</span> {po.expected_at ?? "—"}</div>
          <div><span className="text-muted-foreground">Received:</span> {po.received_at ?? "—"}</div>
          {po.notes && <div className="col-span-2"><span className="text-muted-foreground">Remarks:</span> {po.notes}</div>}
        </div>

        {/* Receiving checklist */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="bg-secondary/60 px-4 py-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items — Receiving Checklist</div>
            {canReceive && <div className="text-[10px] text-muted-foreground">I-check ang dumating, i-adjust qty kung partial, tapos "Receive"</div>}
          </div>
          <table className="w-full text-xs">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                {canReceive && <th className="px-3 py-2 w-8"></th>}
                <th className="text-left px-3 py-2">Product</th>
                <th className="px-3 py-2 w-12 text-center">Unit</th>
                <th className="text-right px-3 py-2 w-16">Ordered</th>
                <th className="text-right px-3 py-2 w-20 text-emerald-500">Received</th>
                <th className="text-right px-3 py-2 w-16 text-amber-500">Pending</th>
                {canReceive && <th className="text-right px-3 py-2 w-24">Recv Now</th>}
                <th className="text-right px-3 py-2 w-28">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const received = it.received_quantity ?? 0;
                const pending = it.quantity - received;
                const done = fullyReceived(it);
                const ch = getCheck(it);
                const lineTotal = Number(it.discounted_unit_cost ?? it.unit_cost) * it.quantity;
                return (
                  <tr key={it.id} className={`border-t border-border ${ch.checked ? "bg-emerald-500/5" : ""} ${done ? "opacity-60" : ""}`}>
                    {canReceive && (
                      <td className="px-3 py-2">
                        {!done ? (
                          <button onClick={() => toggleCheck(it)} className={ch.checked ? "text-emerald-500" : "text-muted-foreground"}>
                            {ch.checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                          </button>
                        ) : (
                          <CheckSquare className="h-4 w-4 text-emerald-500 opacity-50" />
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2">
                      <div className="font-medium">{it.product?.name ?? it.product_id}</div>
                      {it.discount_pct && it.discount_pct !== "0" && (
                        <div className="text-[10px] text-amber-500">Disc: {it.discount_pct}%</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{it.unit_type ?? "Pc"}</td>
                    <td className="px-3 py-2 text-right">{it.quantity}</td>
                    <td className="px-3 py-2 text-right text-emerald-500 font-semibold">{received}</td>
                    <td className="px-3 py-2 text-right text-amber-500">{pending > 0 ? pending : "—"}</td>
                    {canReceive && (
                      <td className="px-3 py-2 text-right">
                        {!done && ch.checked ? (
                          <input type="number" min={1} max={pending} className="input text-xs w-20 text-right"
                            value={ch.recvQty} onChange={(e) => setRecvQty(it, Number(e.target.value))} />
                        ) : (
                          <span className="text-muted-foreground">{done ? "Done" : "—"}</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2 text-right font-mono">
                      <div>{peso(lineTotal)}</div>
                      {it.discount_pct && it.discount_pct !== "0" && (
                        <div className="text-[10px] text-muted-foreground line-through">{peso(Number(it.unit_cost) * it.quantity)}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-secondary/30 font-semibold text-xs">
              <tr>
                <td colSpan={canReceive ? 7 : 6} className="px-3 py-2 text-right">Total</td>
                <td className="px-3 py-2 text-right font-mono">{peso(Number(po.total))}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Delivery Receipts history */}
        {deliveryReceipts.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-secondary/60 px-4 py-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <PackageCheck className="h-3.5 w-3.5" /> Delivery Receipts
              </div>
              <Link to="/deliveries" className="text-[10px] text-primary hover:underline">Manage in Deliveries →</Link>
            </div>
            <div className="divide-y divide-border">
              {(deliveryReceipts as any[]).map((dr) => (
                <div key={dr.id} className="px-4 py-3 flex items-start gap-3 text-xs">
                  <span className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${DR_STATUS_COLOR[dr.status] ?? "bg-muted"}`}>
                    {dr.status}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{dr.supplier_name}</p>
                    <p className="text-muted-foreground">
                      {new Date(dr.delivery_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      {" · "}{(dr.items ?? []).length} item{(dr.items ?? []).length !== 1 ? "s" : ""}
                    </p>
                    {dr.status === "pending" && (
                      <p className="text-amber-600 mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" /> Naghihintay ng confirmation</p>
                    )}
                    {dr.rejection_note && (
                      <p className="text-rose-600 mt-0.5">Dahilan: {dr.rejection_note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2">
          <button onClick={() => { setChecks({}); onClose(); }} className="h-9 px-4 rounded-lg border border-border text-sm inline-flex items-center gap-1.5">
            <X className="h-4 w-4" /> Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={generateOrCopyLink}
              disabled={linkBusy}
              className="h-9 px-4 rounded-lg border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-secondary/60 disabled:opacity-50"
            >
              <Link2 className="h-4 w-4" />
              {linkBusy ? "Generating…" : (deliveryToken ?? po.delivery_token) ? "Copy Delivery Link" : "Share Delivery Link"}
            </button>
            <button onClick={() => setPrinting(true)} className="h-9 px-4 rounded-lg border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-secondary/60">
              <Printer className="h-4 w-4" /> Preview & Print
            </button>
            {canReceive && (
              <button onClick={receiveSelected} disabled={busy || checkedItems.length === 0}
                className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-40">
                <PackageCheck className="h-4 w-4" />
                {busy ? "Processing…" : `Receive${checkedItems.length > 0 ? ` (${checkedItems.length})` : ""} Items`}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Print Preview ───────────────────────────────────────────────────────────

function POPrintPreviewDialog({ po, items, onClose }: { po: any; items: any[]; onClose: () => void }) {
  const todayStr = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
  const orderDateStr = po.order_date
    ? new Date(po.order_date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
    : todayStr;

  const grossTotal = items.reduce((s, it) => s + Number(it.unit_cost) * it.quantity, 0);
  const subTotal = Number(po.subtotal ?? 0);
  const overallDiscPct = Number(po.overall_discount_pct ?? 0);
  const overallDiscAmt = subTotal * overallDiscPct / 100;
  const afterDiscount = subTotal - overallDiscAmt;
  const shippingCharges = Number(po.shipping_charges ?? 0);
  const adjustments = Number(po.adjustments ?? 0);
  const totalPrice = Number(po.total ?? 0);

  const handlePrint = () => {
    const style = document.createElement("style");
    style.id = "__po_print__";
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #po-print-area, #po-print-area * { visibility: visible !important; }
        #po-print-area {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          width: 100vw !important;
          padding: 24px !important;
          box-sizing: border-box !important;
          background: white !important;
        }
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => {
      window.print();
      setTimeout(() => document.head.removeChild(style), 800);
    }, 150);
  };

  const tdBase: React.CSSProperties = { padding: "6px 10px", border: "1px solid #bbb" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.78)", overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* ── Control bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#111827", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #374151", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "6px 16px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            ← Back
          </button>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{po.po_number} — Print Preview</span>
        </div>
        <button onClick={handlePrint} style={{ padding: "7px 22px", borderRadius: 8, background: "#059669", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          🖨 Print
        </button>
      </div>

      {/* ── Document ── */}
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px 48px", flex: 1 }}>
        <div id="po-print-area" style={{ background: "#fff", width: 800, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#000", boxShadow: "0 8px 48px rgba(0,0,0,0.45)", padding: 28 }}>

          {/* ── Row 1: Date | ADZ GARAGE | Print info ── */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ ...tdBase, width: 160, verticalAlign: "top" }}>
                  <div style={{ fontSize: 9, color: "#777", marginBottom: 3 }}>Proforma Date:</div>
                  <div style={{ fontWeight: "bold" }}>{orderDateStr}</div>
                </td>
                <td style={{ ...tdBase, textAlign: "center", verticalAlign: "middle", padding: "10px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1 }}>{po.supplier?.name ?? "—"}</div>
                  {po.supplier?.address && <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>{po.supplier.address}</div>}
                  {(po.supplier?.phone || po.supplier?.email) && (
                    <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
                      {[po.supplier?.phone, po.supplier?.email].filter(Boolean).join("  /  ")}
                    </div>
                  )}
                </td>
                <td style={{ ...tdBase, width: 170, textAlign: "right", verticalAlign: "top" }}>
                  <div style={{ fontSize: 9, color: "#777" }}>Print Date</div>
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>{todayStr}</div>
                  {po.supplier_ref && (
                    <>
                      <div style={{ fontSize: 9, color: "#777" }}>Ref / Proforma #</div>
                      <div style={{ fontWeight: "bold" }}>{po.supplier_ref}</div>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Row 2: Bill To | Order details ── */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "none" }}>
            <tbody>
              <tr>
                <td style={{ ...tdBase, width: "50%", verticalAlign: "top", borderTop: "none", lineHeight: 1.7 }}>
                  <div><strong>Bill To:</strong>&nbsp; {po.bill_to || "ADZ GARAGE"}</div>
                  <div><strong>Address:</strong>&nbsp; {po.bill_to_address || "Cabanatuan City, Nueva Ecija"}</div>
                  <div><strong>Prepared By:</strong>&nbsp; {po.prepared_by || "—"}</div>
                </td>
                <td style={{ ...tdBase, verticalAlign: "top", borderTop: "none", lineHeight: 1.7 }}>
                  <div><strong>Credit Term:</strong>&nbsp; {po.credit_term || "—"}</div>
                  <div><strong>Shipping:</strong>&nbsp; {po.shipping_method || "—"}</div>
                  <div><strong>PO Number:</strong>&nbsp; {po.supplier_ref || po.po_number}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Item Details ── */}
          <div style={{ border: "1px solid #bbb", borderTop: "none" }}>
            <div style={{ padding: "5px 10px", background: "#f0f0f0", fontWeight: "bold", fontSize: 10, letterSpacing: 0.5, borderBottom: "1px solid #bbb" }}>
              Item Details
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f7f7f7" }}>
                  {(["Qty", "Unit Type", "Item Name", "Unit Price", "Cost", "Discount(%)", "Discounted Cost"] as const).map((h, i) => (
                    <th key={h} style={{ padding: "4px 8px", border: "1px solid #ddd", textAlign: i === 2 ? "left" : i >= 3 ? "right" : "center", fontWeight: 600, fontSize: 10 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: "12px", textAlign: "center", color: "#999" }}>No items</td></tr>
                ) : items.map((it, idx) => {
                  const grossLine = Number(it.unit_cost) * it.quantity;
                  const netLine = Number(it.line_total ?? grossLine);
                  return (
                    <tr key={it.id ?? idx} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee", textAlign: "center" }}>{it.quantity}</td>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee", textAlign: "center" }}>{it.unit_type || "Pc"}</td>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee" }}>{it.product?.name ?? "—"}</td>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee", textAlign: "right", fontFamily: "monospace" }}>{peso(Number(it.unit_cost))}</td>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee", textAlign: "right", fontFamily: "monospace" }}>{peso(grossLine)}</td>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee", textAlign: "center" }}>
                        {it.discount_pct && it.discount_pct !== "0" ? it.discount_pct : "—"}
                      </td>
                      <td style={{ padding: "4px 8px", border: "1px solid #eee", textAlign: "right", fontFamily: "monospace", fontWeight: "bold" }}>{peso(netLine)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Remarks | Totals ── */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "none" }}>
            <tbody>
              <tr>
                <td style={{ ...tdBase, width: "45%", verticalAlign: "top", borderTop: "none" }}>
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>Remarks:</div>
                  <div style={{ color: "#cc0000", whiteSpace: "pre-line", lineHeight: 1.6 }}>{po.notes || ""}</div>
                </td>
                <td style={{ ...tdBase, verticalAlign: "top", borderTop: "none" }}>
                  {/* Item Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", alignItems: "flex-end" }}>
                    <span>Item Total:</span>
                    <div style={{ textAlign: "right" }}>
                      {grossTotal !== subTotal && <div style={{ textDecoration: "line-through", color: "#aaa", fontFamily: "monospace", fontSize: 10 }}>{peso(grossTotal)}</div>}
                      <div style={{ fontFamily: "monospace" }}>{peso(subTotal)}</div>
                    </div>
                  </div>
                  {/* Sub Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span>Sub Total:</span>
                    <span style={{ fontFamily: "monospace" }}>{peso(subTotal)}</span>
                  </div>
                  {/* Overall Discount */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", alignItems: "flex-end" }}>
                    <span>Overall Discount:</span>
                    <div style={{ textAlign: "right" }}>
                      {overallDiscPct > 0 && <div style={{ textDecoration: "line-through", color: "#aaa", fontFamily: "monospace", fontSize: 10 }}>{peso(subTotal)}</div>}
                      <div style={{ fontFamily: "monospace" }}>- {overallDiscPct}%</div>
                      <div style={{ fontFamily: "monospace" }}>{peso(afterDiscount)}</div>
                    </div>
                  </div>
                  {/* Shipping */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span>Shipping Charges:</span>
                    <span style={{ fontFamily: "monospace" }}>{peso(shippingCharges)}</span>
                  </div>
                  {/* Adjustments */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span>Adjustments:</span>
                    <span style={{ fontFamily: "monospace" }}>{peso(adjustments)}</span>
                  </div>
                  {/* Total Price */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0 3px", borderTop: "1.5px solid #bbb", marginTop: 4, fontWeight: "bold" }}>
                    <span style={{ fontSize: 12 }}>Total Price:</span>
                    <span style={{ fontFamily: "monospace", fontSize: 13 }}>{peso(totalPrice)}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-24 flex-shrink-0">
        {label}{required && <span className="text-destructive"> *</span>}:
      </span>
      {children}
    </div>
  );
}
