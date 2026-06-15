import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useOrders, useOrderItems, useOrderPayments, peso, useUpdate, useIsOwner } from "@/lib/db";
import { TableSkeleton, QueryError } from "@/components/query-states";
import { useState } from "react";
import { Search, Eye, X, CreditCard, ShoppingBag, Truck, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/orders")({ component: Orders });

const FULFILLMENT_META: Record<string, { label: string; icon: any; cls: string }> = {
  takeout: { label: "Takeout", icon: ShoppingBag, cls: "text-zinc-600 bg-zinc-50 border-zinc-200" },
  shipping: { label: "Shipping", icon: Truck, cls: "text-blue-700 bg-blue-50 border-blue-200" },
  installation: { label: "Ikakabit", icon: Wrench, cls: "text-amber-700 bg-amber-50 border-amber-200" },
};

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  partial: "bg-blue-50 text-blue-700 border-blue-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  refunded: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

function Orders() {
  const { data: orders = [], isLoading, isError, error, refetch } = useOrders();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const updateOrder = useUpdate("orders");
  const canEdit = useIsOwner();
  const navigate = useNavigate();

  async function payNow(o: any) {
    const { data: items = [], error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", o.id);
    if (error) return toast.error(error.message);
    const cart = (items as any[]).map((it) => ({
      id: it.product_id ?? `custom-${it.id}`,
      name: it.name,
      sku: it.sku,
      price: Number(it.unit_price),
      qty: Number(it.quantity),
      custom: !it.product_id,
    }));
    localStorage.setItem(
      "pos.preload",
      JSON.stringify({
        cart,
        customerId: o.customer_id ?? "",
        discountAmount: Number(o.discount || 0),
        label: `${o.order_number} (pending payment)`,
        pendingOrderId: o.id,
        notes: o.notes ?? "",
      }),
    );
    toast.success("Loaded into POS — complete payment");
    navigate({ to: "/pos" });
  }

  const filtered = orders.filter((o: any) =>
    [o.order_number, o.customer?.full_name].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageShell title="Orders" subtitle="Every transaction in real time.">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order # or customer..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm"
          />
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} orders</span>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : isError ? (
        <QueryError message={(error as Error)?.message} onRetry={refetch} />
      ) : (
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-medium px-6 py-3">Order</th>
              <th className="text-left font-medium px-6 py-3">Customer</th>
              <th className="text-left font-medium px-6 py-3">Type</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="text-left font-medium px-6 py-3">Date</th>
              <th className="text-right font-medium px-6 py-3">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">No orders yet. Process a sale in POS.</td></tr>
            ) : filtered.map((o: any) => (
              <tr key={o.id} onClick={() => setSelectedId(o.id)} className="border-t border-border hover:bg-secondary/40 cursor-pointer">
                <td className="px-6 py-4 font-medium">{o.order_number}</td>
                <td className="px-6 py-4">{o.customer?.full_name ?? <span className="text-muted-foreground">Walk-in</span>}</td>
                <td className="px-6 py-4">
                  {(() => {
                    const ft = FULFILLMENT_META[o.fulfillment_type ?? "takeout"] ?? FULFILLMENT_META.takeout;
                    const Icon = ft.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ft.cls}`}>
                        <Icon className="h-3 w-3" />{ft.label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status] ?? "bg-secondary"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-semibold">{peso(Number(o.total))}</td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {o.status === "pending" && (
                      <button
                        onClick={() => payNow(o)}
                        className="h-8 px-3 inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95"
                        title="Send back to POS for payment"
                      >
                        <CreditCard className="h-3.5 w-3.5" />Pay Now
                      </button>
                    )}
                    <button onClick={() => setSelectedId(o.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-secondary">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <OrderDialog
        orderId={selectedId}
        order={orders.find((o: any) => o.id === selectedId)}
        onClose={() => setSelectedId(null)}
        onCancel={async () => {
          if (!selectedId) return;
          const o = orders.find((x: any) => x.id === selectedId);
          await updateOrder.mutateAsync({ id: selectedId, patch: { status: "cancelled" } });
          // If the order was already paid, restore its stock
          if (o && (o.status === "paid" || o.status === "partial")) {
            const { error } = await supabase.rpc("adjust_stock_for_order", {
              p_order_id: selectedId, p_direction: "restore",
            });
            if (error) toast.error(`Stock restore failed: ${error.message}`);
          }
          toast.success("Order cancelled");
          setSelectedId(null);
        }}
      />
    </PageShell>
  );
}

function OrderDialog({ orderId, order, onClose, onCancel }: { orderId: string | null; order: any; onClose: () => void; onCancel: () => void }) {
  const { data: items = [] } = useOrderItems(orderId ?? undefined);
  const { data: payments = [] } = useOrderPayments(orderId ?? undefined);
  return (
    <Dialog open={!!orderId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{order?.order_number}</DialogTitle></DialogHeader>
        {order && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Info label="Customer" value={order.customer?.full_name ?? "Walk-in"} />
              <Info label="Status" value={order.status} />
              <Info label="Type" value={FULFILLMENT_META[order.fulfillment_type ?? "takeout"]?.label ?? "Takeout"} />
              <Info label="Total" value={peso(Number(order.total))} />
              <Info label="Subtotal" value={peso(Number(order.subtotal))} />

              <Info label="Discount" value={peso(Number(order.discount))} />
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase">
                  <tr><th className="text-left px-4 py-2">Item</th><th className="text-right px-4 py-2">Qty</th><th className="text-right px-4 py-2">Price</th><th className="text-right px-4 py-2">Total</th></tr>
                </thead>
                <tbody>
                  {items.map((it: any) => (
                    <tr key={it.id} className="border-t border-border">
                      <td className="px-4 py-2">{it.name}</td>
                      <td className="px-4 py-2 text-right">{it.quantity}</td>
                      <td className="px-4 py-2 text-right">{peso(Number(it.unit_price))}</td>
                      <td className="px-4 py-2 text-right font-semibold">{peso(Number(it.line_total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length > 0 && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-2 bg-secondary/60 text-xs font-semibold uppercase tracking-wider">Payments</div>
                <div className="divide-y divide-border">
                  {payments.map((p: any) => (
                    <div key={p.id} className="px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <div className="font-medium capitalize">{String(p.method).replace("_", " ")}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(p.paid_at).toLocaleString()}
                          {p.reference && <> · Ref: <span className="font-mono">{p.reference}</span></>}
                        </div>
                      </div>
                      <div className="font-semibold shrink-0">{peso(Number(p.amount))}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {order.status !== "cancelled" && order.status !== "refunded" && (
              <div className="flex justify-end">
                <button onClick={onCancel} className="h-9 px-4 rounded-xl border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 inline-flex items-center gap-1.5">
                  <X className="h-3.5 w-3.5" />Cancel Order
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
