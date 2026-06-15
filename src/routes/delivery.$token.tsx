import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import adzLogo from "@/assets/adz-logo.png";
import { useEffect, useState } from "react";
import { getPOByToken, submitDeliveryReceipt } from "@/lib/delivery-receipt";
import { PackageCheck, CheckCircle2, AlertTriangle, Clock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/delivery/$token")({ component: DeliveryPage });

type POItem = {
  id: string;
  product_id: string;
  quantity: number;
  received_quantity: number;
  unit_type: string;
  product: { id: string; name: string; sku: string } | null;
};

type POData = {
  id: string;
  po_number: string;
  status: string;
  expected_at: string | null;
  notes: string | null;
  supplier_ref: string | null;
  supplier: { id: string; name: string } | null;
  items: POItem[];
};

type PageState =
  | { phase: "loading" }
  | { phase: "invalid" }
  | { phase: "already_pending"; submittedAt: string; supplierName: string }
  | { phase: "form"; po: POData }
  | { phase: "success"; poNumber: string };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
}

function DeliveryPage() {
  const { token } = Route.useParams();
  const callGetPO = useServerFn(getPOByToken);
  const callSubmit = useServerFn(submitDeliveryReceipt);

  const [state, setState] = useState<PageState>({ phase: "loading" });

  const [supplierName, setSupplierName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    callGetPO({ data: { token } })
      .then((result) => {
        if (!result) {
          setState({ phase: "invalid" });
          return;
        }
        if (result.pendingReceipt) {
          setState({
            phase: "already_pending",
            submittedAt: result.pendingReceipt.submitted_at,
            supplierName: result.pendingReceipt.supplier_name,
          });
          return;
        }
        const po = result.po as unknown as POData;
        const initialQtys: Record<string, number> = {};
        (po.items ?? []).forEach((item) => {
          const remaining = item.quantity - item.received_quantity;
          initialQtys[item.id] = remaining > 0 ? remaining : 0;
        });
        setQtys(initialQtys);
        setState({ phase: "form", po });
      })
      .catch(() => setState({ phase: "invalid" }));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.phase !== "form") return;
    if (!supplierName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!deliveryDate) {
      setError("Please enter the delivery date.");
      return;
    }
    const hasAny = state.po.items.some((item) => (qtys[item.id] ?? 0) > 0);
    if (!hasAny) {
      setError("No items have a delivered quantity.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await callSubmit({
        data: {
          token,
          supplier_name: supplierName.trim(),
          delivery_date: deliveryDate,
          notes: notes.trim() || undefined,
          items: state.po.items.map((item) => ({
            purchase_order_item_id: item.id,
            product_id: item.product_id,
            quantity_delivered: qtys[item.id] ?? 0,
          })),
        },
      });
      setState({ phase: "success", poNumber: state.po.po_number });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <img src={adzLogo} alt="ADZ Garage" className="h-12 mx-auto mb-3 object-contain" />
          <h1 className="text-xl font-bold text-foreground">Delivery Receipt</h1>
          <p className="text-sm text-muted-foreground mt-1">ADZ Garage — Supplier Portal</p>
        </div>

        {state.phase === "loading" && (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Loading…</p>
          </div>
        )}

        {state.phase === "invalid" && (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Invalid Link</h2>
            <p className="text-sm text-muted-foreground">
              This delivery link is invalid. Please contact ADZ Garage for the correct link.
            </p>
          </div>
        )}

        {state.phase === "already_pending" && (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-8 text-center">
            <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Already Submitted</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>{state.supplierName}</strong> already submitted a delivery receipt on{" "}
              {fmtDate(state.submittedAt)}.
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait for ADZ Garage confirmation before submitting again.
            </p>
          </div>
        )}

        {state.phase === "success" && (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-1">
              ADZ Garage has received your delivery receipt for
            </p>
            <p className="text-base font-semibold text-foreground mb-4">{state.poNumber}</p>
            <p className="text-sm text-muted-foreground">
              ADZ Garage will confirm the delivery before updating inventory.
              Thank you!
            </p>
          </div>
        )}

        {state.phase === "form" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* PO Info */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Purchase Order</p>
                  <p className="font-bold text-lg leading-tight">{state.po.po_number}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="font-medium">{state.po.supplier?.name ?? "—"}</p>
                </div>
                {state.po.supplier_ref && (
                  <div>
                    <p className="text-xs text-muted-foreground">Ref #</p>
                    <p className="font-medium">{state.po.supplier_ref}</p>
                  </div>
                )}
                {state.po.expected_at && (
                  <div>
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="font-medium">{fmtDate(state.po.expected_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Supplier info */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-sm">Delivery Information</h2>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Pangalan mo (supplier contact) *</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Juan dela Cruz"
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Delivery Date *</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Partial delivery, balance next week"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h2 className="font-semibold text-sm">Items Delivered</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Enter the actual quantity delivered for each item.</p>
              </div>
              <div className="divide-y divide-border">
                {(state.po.items ?? []).map((item) => {
                  const remaining = item.quantity - item.received_quantity;
                  const qty = qtys[item.id] ?? 0;
                  return (
                    <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{item.product?.sku ?? ""}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ordered: {item.quantity} {item.unit_type} &nbsp;·&nbsp; Remaining: {remaining} {item.unit_type}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-24">
                        <label className="block text-xs text-muted-foreground mb-1 text-right">Qty delivered</label>
                        <input
                          type="number"
                          min={0}
                          max={remaining}
                          value={qty}
                          onChange={(e) =>
                            setQtys((prev) => ({
                              ...prev,
                              [item.id]: Math.min(remaining, Math.max(0, parseInt(e.target.value) || 0)),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-right outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
              {busy ? "Saving…" : "Submit Delivery Receipt"}
            </button>

            <p className="text-center text-xs text-muted-foreground pb-4">
              Hindi ma-update ang inventory hanggang hindi pa ito niko-confirm ng ADZ Garage.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
