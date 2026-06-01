import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Undo2, Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useOrderRefunds, useOrders, useInsert, useUpdate, peso } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/refunds")({ component: RefundsPage });

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  approved: "bg-blue-500/10 text-blue-500",
  rejected: "bg-rose-500/10 text-rose-500",
  completed: "bg-emerald-500/10 text-emerald-500",
};

function RefundsPage() {
  const { data: refunds = [], isLoading } = useOrderRefunds();
  const { data: orders = [] } = useOrders();
  const insert = useInsert<any>("order_refunds");
  const update = useUpdate<any>("order_refunds");
  const [creating, setCreating] = useState(false);

  const decide = async (r: any, approve: boolean) => {
    const reason = approve ? undefined : prompt("Rejection reason?") || "Rejected";
    try {
      const { data: u } = await supabase.auth.getUser();
      await new Promise((resolve, reject) =>
        update.mutate(
          {
            id: r.id,
            patch: approve
              ? { status: "approved", approved_by: u.user?.id, approved_at: new Date().toISOString() }
              : { status: "rejected", rejection_reason: reason },
          },
          { onSuccess: resolve, onError: reject },
        ),
      );
      toast.success(approve ? "Approved" : "Rejected");
    } catch (e: any) { toast.error(e.message); }
  };

  const markCompleted = async (r: any) => {
    try {
      await new Promise((resolve, reject) => update.mutate({ id: r.id, patch: { status: "completed" } }, { onSuccess: resolve, onError: reject }));
      // Auto-restore inventory when refund is completed
      if (r.order_id) {
        const { error } = await supabase.rpc("adjust_stock_for_order", {
          p_order_id: r.order_id, p_direction: "restore",
        });
        if (error) toast.error(`Stock restore failed: ${error.message}`);
        await supabase.from("orders").update({ status: "refunded" }).eq("id", r.order_id);
      }
      toast.success("Refund completed");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <PageShell
      title="Refunds & Voids"
      subtitle="Process refunds and voided sales with approval workflow."
      actions={
        <button onClick={() => setCreating(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> New Refund
        </button>
      }
    >
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Refund #</th>
              <th className="text-left font-medium px-6 py-3">Order</th>
              <th className="text-right font-medium px-6 py-3">Amount</th>
              <th className="text-left font-medium px-6 py-3">Reason</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
              <th className="px-6 py-3 w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (refunds as any[]).length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Wala pang refunds.</td></tr>
            ) : (
              (refunds as any[]).map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center"><Undo2 className="h-4 w-4" /></div>
                    {r.refund_number}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{r.order?.order_number ?? r.order_id}</td>
                  <td className="px-6 py-4 text-right font-mono font-semibold">{peso(Number(r.amount))}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">{r.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      {r.status === "pending" && (
                        <>
                          <button onClick={() => decide(r, true)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500" title="Approve"><Check className="h-3.5 w-3.5" /></button>
                          <button onClick={() => decide(r, false)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" title="Reject"><X className="h-3.5 w-3.5" /></button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <button onClick={() => markCompleted(r)} className="text-[10px] px-2 py-1 rounded-md bg-emerald-600 text-white">Mark Paid</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewRefundDialog
        open={creating}
        orders={orders as any[]}
        onClose={() => setCreating(false)}
        onSave={async (row: any) => {
          try {
            const { data: u } = await supabase.auth.getUser();
            await new Promise((resolve, reject) =>
              insert.mutate(
                {
                  ...row,
                  refund_number: `RF-${Date.now().toString().slice(-6)}`,
                  status: "pending",
                  requested_by: u.user?.id,
                },
                { onSuccess: resolve, onError: reject },
              ),
            );
            toast.success("Refund request created");
            setCreating(false);
          } catch (e: any) { toast.error(e.message); }
        }}
      />
    </PageShell>
  );
}

function NewRefundDialog({ open, orders, onClose, onSave }: any) {
  const [form, setForm] = useState<any>({ order_id: "", amount: 0, reason: "", refund_method: "cash" });
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New Refund Request</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Order *</span>
            <select className="input mt-1" value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })}>
              <option value="">—</option>
              {orders.map((o: any) => <option key={o.id} value={o.id}>{o.order_number} — {peso(Number(o.total))}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Amount (₱) *</span>
              <input type="number" step="0.01" className="input mt-1" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Method</span>
              <select className="input mt-1" value={form.refund_method} onChange={(e) => setForm({ ...form, refund_method: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="gcash">GCash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Reason *</span>
            <textarea className="input mt-1 min-h-[80px]" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={!form.order_id || !form.amount || !form.reason} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Submit</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}