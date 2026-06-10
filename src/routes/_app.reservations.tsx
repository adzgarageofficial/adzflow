import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useReservations, useUpdate, useDelete, peso } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock, Car, ChevronDown, ChevronRight, CreditCard,
  Receipt, ShoppingCart, Trash2, CheckCircle2, XCircle, Clock,
  User, Phone, FileImage, ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/reservations")({ component: ReservationsPage });

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-800 border-amber-200",    icon: Clock },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", cls: "bg-zinc-100 text-zinc-500 border-zinc-200",     icon: XCircle },
};

function ReservationsPage() {
  const { data: reservations = [], isLoading } = useReservations();
  const updateRes = useUpdate<any>("reservations", ["reservations"]);
  const deleteRes = useDelete("reservations", ["reservations"]);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const filtered = (reservations as any[]).filter((r) => filter === "all" || r.status === filter);

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function continueInPOS(res: any) {
    const items = Array.isArray(res.items) ? res.items : [];
    localStorage.setItem(
      "pos.preload",
      JSON.stringify({
        cart: items,
        label: `Reservation ${res.reservation_number}`,
        notes: [
          res.customer_name && `Walk-in: ${res.customer_name}`,
          res.vehicle       && `Vehicle: ${res.vehicle}`,
          res.plate_number  && `Plate: ${res.plate_number}`,
        ].filter(Boolean).join(" | "),
        pendingOrderId: null,
      }),
    );
    navigate({ to: "/pos" });
    toast.success(`Reservation ${res.reservation_number} loaded in POS`);
  }

  async function cancelReservation(id: string) {
    try {
      await updateRes.mutateAsync({ id, patch: { status: "cancelled" } });
      qc.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reservation cancelled");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to cancel");
    } finally {
      setCancelConfirm(null);
    }
  }

  return (
    <PageShell title="Reservations" subtitle="Manage customer reservations and down payments.">
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "pending", "completed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold border capitalize transition ${
              filter === s ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"
            }`}
          >
            {s === "all" ? "All" : STATUS_META[s].label}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({s === "all" ? (reservations as any[]).length : (reservations as any[]).filter((r) => r.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">Walang reservations na nahanap.</div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((res: any) => {
              const meta = STATUS_META[res.status] ?? STATUS_META.pending;
              const Icon = meta.icon;
              const isOpen = expanded === res.id;
              const items: any[] = Array.isArray(res.items) ? res.items : [];
              const itemsTotal = items.reduce((s: number, i: any) => s + (Number(i.price) * Number(i.qty || 1)), 0);

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden"
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggleExpand(res.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/40 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold">{res.reservation_number}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${meta.cls}`}>
                          <Icon className="h-2.5 w-2.5" />{meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                        <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{res.customer_name}</span>
                        <span className="inline-flex items-center gap-1"><Car className="h-3 w-3" />{res.vehicle} · {res.plate_number}</span>
                        <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{new Date(res.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">Down payment</div>
                      <div className="text-sm font-bold text-emerald-700">{peso(Number(res.down_payment_amount))}</div>
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-secondary/20 overflow-hidden"
                      >
                        <div className="p-4 space-y-4">
                          {/* Customer info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="rounded-lg border border-border bg-background p-3 space-y-0.5">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Customer</div>
                              <div className="font-semibold">{res.customer_name}</div>
                            </div>
                            <div className="rounded-lg border border-border bg-background p-3 space-y-0.5">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vehicle</div>
                              <div className="font-semibold">{res.vehicle}</div>
                            </div>
                            <div className="rounded-lg border border-border bg-background p-3 space-y-0.5">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Plate Number</div>
                              <div className="font-semibold font-mono">{res.plate_number}</div>
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg border border-border bg-background p-3 space-y-0.5">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Date Reserved</div>
                              <div className="font-semibold">{new Date(res.created_at).toLocaleString("en-PH")}</div>
                            </div>
                            <div className="rounded-lg border border-border bg-background p-3 space-y-0.5">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Down Payment Paid</div>
                              <div className="font-semibold">{res.down_payment_amount > 0 ? peso(Number(res.down_payment_amount)) : "—"}</div>
                            </div>
                          </div>

                          {/* Reserved items */}
                          {items.length > 0 && (
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Reserved Items / Services</div>
                              <div className="rounded-lg border border-border overflow-hidden">
                                {items.map((it: any, i: number) => (
                                  <div key={i} className={`flex items-center justify-between px-3 py-2 text-xs ${i > 0 ? "border-t border-border" : ""}`}>
                                    <span className="font-medium truncate flex-1">{it.name}</span>
                                    <span className="text-muted-foreground mx-3">× {it.qty ?? 1}</span>
                                    <span className="font-semibold">{peso(Number(it.price) * Number(it.qty ?? 1))}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between px-3 py-2 text-xs font-bold border-t border-border bg-secondary/40">
                                  <span>Total</span>
                                  <span>{peso(itemsTotal)}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Down payment receipt image */}
                          {res.down_payment_receipt_url && (
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Down Payment Receipt</div>
                              <a href={res.down_payment_receipt_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                                <img
                                  src={res.down_payment_receipt_url}
                                  alt="Receipt"
                                  className="max-h-48 rounded-lg border border-border object-contain"
                                />
                              </a>
                            </div>
                          )}

                          {/* Notes */}
                          {res.notes && (
                            <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground italic">
                              {res.notes}
                            </div>
                          )}

                          {/* Reserved by */}
                          {res.reserved_by_name && (
                            <div className="text-[11px] text-muted-foreground">
                              Reserved by: <span className="font-semibold">{res.reserved_by_name}</span>
                            </div>
                          )}

                          {/* Action buttons */}
                          {res.status === "pending" && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                onClick={() => continueInPOS(res)}
                                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90"
                              >
                                <ShoppingCart className="h-3.5 w-3.5" />Continue in POS
                                <ArrowRight className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => setCancelConfirm(res.id)}
                                className="h-9 px-4 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />Cancel Reservation
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={!!cancelConfirm} onOpenChange={(o) => !o && setCancelConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><XCircle className="h-5 w-5 text-rose-600" />Cancel Reservation</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Sigurado ka bang i-cancel ang reservation na ito? Hindi na ito mababawi.</p>
          <div className="flex gap-2 justify-end mt-2">
            <button onClick={() => setCancelConfirm(null)} className="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-secondary">Huwag</button>
            <button
              onClick={() => cancelConfirm && cancelReservation(cancelConfirm)}
              className="h-9 px-4 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:opacity-90"
            >
              Oo, i-cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
