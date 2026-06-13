import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, PROCUREMENT_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageCheck, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeliveryReceipts, usePurchaseOrders } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/deliveries")({ component: DeliveriesPage });

const DR_STATUS_COLOR: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-600",
  confirmed: "bg-emerald-500/10 text-emerald-600",
  rejected:  "bg-rose-500/10 text-rose-600",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DeliveriesPage() {
  const { data: allReceipts = [], isLoading } = useDeliveryReceipts();
  const { data: allPOs = [] } = usePurchaseOrders();
  const qc = useQueryClient();

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const receipts = allReceipts as any[];
  const pending = receipts.filter((r) => r.status === "pending");
  const history  = receipts.filter((r) => r.status !== "pending");

  // POs that are 'ordered' or 'partial' with no pending receipt submitted yet
  const pendingPoIds = new Set(pending.map((r) => r.purchase_order_id));
  const awaitingDelivery = (allPOs as any[]).filter(
    (po) => (po.status === "ordered" || po.status === "partial") && !pendingPoIds.has(po.id)
  );

  const confirmingReceipt = pending.find((r) => r.id === confirmingId) ?? null;
  const rejectingReceipt  = pending.find((r) => r.id === rejectingId)  ?? null;

  return (
    <PageShell
      title="Deliveries"
      subtitle="I-review at i-confirm ang mga delivery receipt na galing sa mga supplier."
    >
      <SubNav items={PROCUREMENT_NAV} label="Procurement" />

      {/* ── Pending Confirmation ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-semibold text-sm">Pending Confirmation</h2>
          {pending.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold">
              {pending.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : pending.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Wala pang pending delivery receipts. Clear!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((dr) => (
              <ReceiptCard
                key={dr.id}
                dr={dr}
                expanded={expandedId === dr.id}
                onToggleExpand={() => setExpandedId(expandedId === dr.id ? null : dr.id)}
                onConfirm={() => setConfirmingId(dr.id)}
                onReject={() => setRejectingId(dr.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Awaiting Delivery (no receipt submitted yet) ── */}
      {awaitingDelivery.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-semibold text-sm text-muted-foreground">Awaiting Delivery</h2>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-bold">
              {awaitingDelivery.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Mga PO na may pending/partial status pero wala pang delivery receipt na na-submit ng supplier.
          </p>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">PO #</th>
                  <th className="text-left px-6 py-3 font-medium">Supplier</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Expected</th>
                </tr>
              </thead>
              <tbody>
                {awaitingDelivery.map((po) => (
                  <tr key={po.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-6 py-3 font-semibold">{po.po_number}</td>
                    <td className="px-6 py-3 text-muted-foreground">{po.supplier?.name ?? "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${po.status === "partial" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground text-xs">{po.expected_at ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Receipt History ── */}
      {history.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm text-muted-foreground mb-3">History</h2>
          <div className="space-y-2">
            {history.map((dr) => (
              <ReceiptCard
                key={dr.id}
                dr={dr}
                expanded={expandedId === dr.id}
                onToggleExpand={() => setExpandedId(expandedId === dr.id ? null : dr.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Confirm Dialog ── */}
      {confirmingReceipt && (
        <ConfirmDialog
          receipt={confirmingReceipt}
          onClose={() => setConfirmingId(null)}
          onDone={() => {
            setConfirmingId(null);
            qc.invalidateQueries({ queryKey: ["po_delivery_receipts"] });
            qc.invalidateQueries({ queryKey: ["purchase_orders"] });
            qc.invalidateQueries({ queryKey: ["purchase_order_items"] });
            qc.invalidateQueries({ queryKey: ["inventory_levels"] });
            qc.invalidateQueries({ queryKey: ["stock_movements"] });
          }}
        />
      )}

      {/* ── Reject Dialog ── */}
      {rejectingReceipt && (
        <RejectDialog
          receipt={rejectingReceipt}
          onClose={() => setRejectingId(null)}
          onDone={() => {
            setRejectingId(null);
            qc.invalidateQueries({ queryKey: ["po_delivery_receipts"] });
          }}
        />
      )}
    </PageShell>
  );
}

// ─── Receipt Card ─────────────────────────────────────────────────────────────

function ReceiptCard({
  dr,
  expanded,
  onToggleExpand,
  onConfirm,
  onReject,
}: {
  dr: any;
  expanded: boolean;
  onToggleExpand: () => void;
  onConfirm?: () => void;
  onReject?: () => void;
}) {
  const isPending = dr.status === "pending";

  return (
    <div className={`rounded-2xl border bg-card shadow-sm overflow-hidden ${isPending ? "border-amber-200 dark:border-amber-800" : "border-border"}`}>
      {/* Header row */}
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{dr.purchase_order?.po_number ?? "—"}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${DR_STATUS_COLOR[dr.status] ?? "bg-muted"}`}>
              {dr.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dr.purchase_order?.supplier?.name ?? "—"}
            {" · "}
            <span className="font-medium text-foreground">{dr.supplier_name}</span>
            {" · "}
            Delivered {fmtDate(dr.delivery_date)}
            {" · "}
            {(dr.items ?? []).length} item{(dr.items ?? []).length !== 1 ? "s" : ""}
          </p>
          {dr.notes && <p className="text-xs text-muted-foreground mt-0.5 italic">"{dr.notes}"</p>}
          {dr.rejection_note && (
            <p className="text-xs text-rose-600 mt-0.5">Rejected: {dr.rejection_note}</p>
          )}
          {dr.status === "confirmed" && dr.confirmed_at && (
            <p className="text-xs text-emerald-600 mt-0.5">Confirmed {fmtDate(dr.confirmed_at)}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isPending && onConfirm && onReject && (
            <>
              <button
                onClick={onReject}
                className="h-8 px-3 rounded-lg border border-rose-300 dark:border-rose-700 text-rose-600 text-xs font-medium inline-flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
              <button
                onClick={onConfirm}
                className="h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold inline-flex items-center gap-1 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirm & Add to Stock
              </button>
            </>
          )}
          <button
            onClick={onToggleExpand}
            className="h-8 w-8 rounded-lg border border-border text-muted-foreground inline-flex items-center justify-center hover:bg-secondary/60"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-border">
          <table className="w-full text-xs">
            <thead className="bg-secondary/40 text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2 font-medium">Product</th>
                <th className="text-left px-5 py-2 font-medium">SKU</th>
                <th className="text-right px-5 py-2 font-medium">Qty Delivered</th>
              </tr>
            </thead>
            <tbody>
              {(dr.items ?? []).map((item: any) => (
                <tr key={item.id} className="border-t border-border/50">
                  <td className="px-5 py-2.5 font-medium">{item.product?.name ?? "—"}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{item.product?.sku ?? "—"}</td>
                  <td className="px-5 py-2.5 text-right font-semibold">{item.quantity_delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ receipt, onClose, onDone }: { receipt: any; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      const warehouseId = receipt.purchase_order?.warehouse_id;
      if (!warehouseId) throw new Error("Warehouse ID not found sa PO.");

      const today = new Date().toISOString().slice(0, 10);
      const now   = new Date().toISOString();

      for (const item of (receipt.items ?? [])) {
        // 1. Stock movement
        await (supabase as any).from("stock_movements").insert({
          product_id:     item.product_id,
          warehouse_id:   warehouseId,
          movement_type:  "purchase",
          quantity:       item.quantity_delivered,
          reference_type: "delivery_receipt",
          reference_id:   receipt.id,
          notes:          `DR Confirmed — ${receipt.purchase_order?.po_number ?? ""}`,
          created_by:     userId ?? null,
        });

        // 2. Inventory level
        const { data: existing } = await (supabase as any)
          .from("inventory_levels")
          .select("id, quantity")
          .eq("product_id", item.product_id)
          .eq("warehouse_id", warehouseId)
          .maybeSingle();

        if (existing) {
          await (supabase as any).from("inventory_levels")
            .update({ quantity: Number(existing.quantity) + item.quantity_delivered })
            .eq("id", existing.id);
        } else {
          await (supabase as any).from("inventory_levels").insert({
            product_id:   item.product_id,
            warehouse_id: warehouseId,
            quantity:     item.quantity_delivered,
          });
        }

        // 3. PO item received_quantity
        const { data: poItem } = await (supabase as any)
          .from("purchase_order_items")
          .select("id, received_quantity")
          .eq("id", item.purchase_order_item_id)
          .maybeSingle();

        if (poItem) {
          await (supabase as any).from("purchase_order_items")
            .update({ received_quantity: (poItem.received_quantity ?? 0) + item.quantity_delivered, received_at: today })
            .eq("id", poItem.id);
        }
      }

      // 4. Confirm the receipt
      await (supabase as any).from("po_delivery_receipts")
        .update({ status: "confirmed", confirmed_at: now, confirmed_by: userId ?? null })
        .eq("id", receipt.id);

      // 5. Update PO status
      const { data: allPoItems } = await (supabase as any)
        .from("purchase_order_items")
        .select("quantity, received_quantity")
        .eq("purchase_order_id", receipt.purchase_order_id);

      const allDone = (allPoItems ?? []).every((i: any) => (i.received_quantity ?? 0) >= i.quantity);
      const anyDone = (allPoItems ?? []).some((i: any) => (i.received_quantity ?? 0) > 0);
      const newStatus = allDone ? "received" : anyDone ? "partial" : "ordered";

      await (supabase as any).from("purchase_orders")
        .update({ status: newStatus, ...(allDone ? { received_at: today } : {}) })
        .eq("id", receipt.purchase_order_id);

      toast.success("Delivery confirmed! Stocks na-update.");
      onDone();
    } catch (e: any) {
      toast.error(e.message || "May error sa pag-confirm.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <PackageCheck className="h-4 w-4 text-emerald-500" />
            Confirm Delivery
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-xl bg-secondary/40 px-4 py-3 space-y-1 text-xs">
            <p><span className="text-muted-foreground">PO:</span> <strong>{receipt.purchase_order?.po_number}</strong></p>
            <p><span className="text-muted-foreground">Supplier:</span> {receipt.purchase_order?.supplier?.name}</p>
            <p><span className="text-muted-foreground">Submitted by:</span> {receipt.supplier_name}</p>
            <p><span className="text-muted-foreground">Delivery date:</span> {fmtDate(receipt.delivery_date)}</p>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-secondary/40 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Items to add to stock
            </div>
            <table className="w-full text-xs">
              <tbody>
                {(receipt.items ?? []).map((item: any) => (
                  <tr key={item.id} className="border-t border-border/50">
                    <td className="px-4 py-2.5">{item.product?.name ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-600">+{item.quantity_delivered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <p>Kapag na-confirm, mare-record agad sa stock movements at maa-update ang inventory. Hindi na ito mababago.</p>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} disabled={busy} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={busy}
              className="h-9 px-5 rounded-lg bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {busy ? "Processing…" : "Confirm & Add to Stock"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Reject Dialog ────────────────────────────────────────────────────────────

function RejectDialog({ receipt, onClose, onDone }: { receipt: any; onClose: () => void; onDone: () => void }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const handleReject = async () => {
    setBusy(true);
    try {
      const { error } = await (supabase as any)
        .from("po_delivery_receipts")
        .update({ status: "rejected", rejection_note: note.trim() || null })
        .eq("id", receipt.id);
      if (error) throw error;
      toast.success("Delivery receipt rejected.");
      onDone();
    } catch (e: any) {
      toast.error(e.message || "May error sa pag-reject.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 text-rose-500" />
            Reject Delivery Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground text-xs">
            I-reject ang delivery receipt ni <strong>{receipt.supplier_name}</strong> para sa{" "}
            <strong>{receipt.purchase_order?.po_number}</strong>.
            Hindi mag-a-update ang inventory.
          </p>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Dahilan (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Mali ang quantity, hindi tugma sa PO…"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} disabled={busy} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
            <button
              onClick={handleReject}
              disabled={busy}
              className="h-9 px-5 rounded-lg bg-rose-600 text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              {busy ? "Rejecting…" : "Reject Receipt"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
