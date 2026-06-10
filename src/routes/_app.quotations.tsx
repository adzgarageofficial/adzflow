import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2, ArrowRight, Printer, ShoppingCart, X, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuotations, useCustomers, useVehicles, useProducts, useServices, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { downloadElementAsPdf } from "@/lib/pdf";

export const Route = createFileRoute("/_app/quotations")({ component: QuotationsPage });

const STATUSES = ["draft", "sent", "approved", "rejected", "expired", "converted"] as const;
const COLORS: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  sent: "bg-blue-50 text-blue-700 border-blue-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
  expired: "bg-amber-50 text-amber-700 border-amber-100",
  converted: "bg-purple-50 text-purple-700 border-purple-100",
};

function QuotationsPage() {
  const { data: quotes = [] } = useQuotations();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: products = [] } = useProducts();
  const { data: services = [] } = useServices();
  const ins = useInsert("quotations");
  const canEdit = useIsOwner();
  const upd = useUpdate("quotations");
  const del = useDelete("quotations");
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const filtered = useMemo(() => quotes.filter((x: any) =>
    !q || [x.quotation_number, x.customer?.full_name].join(" ").toLowerCase().includes(q.toLowerCase())
  ), [quotes, q]);

  async function convertToOrder(quote: any) {
    if (!confirm("Convert this quotation to an order?")) return;
    const { data: u } = await supabase.auth.getUser();
    const { data: order, error } = await supabase.from("orders").insert({
      order_number: `ORD-${Date.now().toString().slice(-8)}`,
      channel: "pos", status: "pending",
      customer_id: quote.customer_id, vehicle_id: quote.vehicle_id,
      cashier_id: u.user?.id ?? null,
      subtotal: quote.subtotal, discount: quote.discount, tax: 0, total: quote.total,
    }).select().single();
    if (error) return toast.error(error.message);
    await supabase.from("quotations").update({ status: "converted", converted_order_id: order.id }).eq("id", quote.id);
    qc.invalidateQueries({ queryKey: ["quotations"] });
    qc.invalidateQueries({ queryKey: ["orders"] });
    toast.success(`Converted to ${order.order_number}`);
  }

  async function sendToPOS(quote: any) {
    const { data: items, error } = await supabase.from("quotation_items").select("*").eq("quotation_id", quote.id);
    if (error) return toast.error(error.message);
    if (!items || items.length === 0) return toast.error("No line items in this quotation");
    const cart = items.map((it: any) => ({
      id: it.product_id || `q-${it.id}`,
      name: it.name,
      sku: it.is_labor ? "LABOR" : "PART",
      price: Number(it.unit_price),
      qty: Number(it.quantity),
      custom: !it.product_id,
    }));
    const payload = {
      cart,
      customerId: quote.customer_id || "",
      discountAmount: Number(quote.discount || 0),
      label: quote.quotation_number,
    };
    localStorage.setItem("pos.preload", JSON.stringify(payload));
    toast.success(`Sent ${quote.quotation_number} to POS`);
    navigate({ to: "/pos" });
  }

  const [printing, setPrinting] = useState<any | null>(null);

  return (
    <PageShell title="Quotations" subtitle="Estimates and proposals.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />New Quotation
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr><th className="text-left font-medium px-6 py-3">Quote #</th><th className="text-left font-medium px-6 py-3">Customer</th><th className="text-left font-medium px-6 py-3">Valid Until</th><th className="text-left font-medium px-6 py-3">Status</th><th className="text-right font-medium px-6 py-3">Total</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No quotations yet.</td></tr>
            ) : filtered.map((x: any) => (
              <tr key={x.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3 font-medium">{x.quotation_number}</td>
                <td className="px-6 py-3">{x.customer?.full_name ?? "—"}</td>
                <td className="px-6 py-3 text-xs text-muted-foreground">{x.valid_until ?? "—"}</td>
                <td className="px-6 py-3">
                  <select disabled={!canEdit} value={x.status} onChange={(e) => upd.mutate({ id: x.id, patch: { status: e.target.value as any } })}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${COLORS[x.status]}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-3 text-right font-semibold">{peso(Number(x.total))}</td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setPrinting(x)} title="Print" className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Printer className="h-3.5 w-3.5" /></button>
                  {x.status !== "converted" && (
                    <button onClick={() => sendToPOS(x)} title="Send to POS" className="h-7 w-7 rounded inline-flex items-center justify-center text-blue-700 hover:bg-blue-50"><ShoppingCart className="h-3.5 w-3.5" /></button>
                  )}
                  {x.status !== "converted" && (
                    <button onClick={() => convertToOrder(x)} title="Convert to Order" className="h-7 w-7 rounded inline-flex items-center justify-center text-emerald-700 hover:bg-emerald-50"><ArrowRight className="h-3.5 w-3.5" /></button>
                  )}
                  <button disabled={!canEdit} onClick={() => { setEditing(x); setOpen(true); }} className="h-7 w-7 rounded inline-flex items-center justify-center hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button disabled={!canEdit} onClick={() => { if (confirm("Delete?")) del.mutate(x.id); }} className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QuoteDialog open={open} editing={editing} customers={customers} vehicles={vehicles} products={products} services={services} onClose={() => setOpen(false)}
        onSave={async (v: any, lineItems: any[]) => {
          let quoteId = editing?.id;
          if (editing) {
            await upd.mutateAsync({ id: editing.id, patch: v });
          } else {
            const created = await ins.mutateAsync({ ...v, quotation_number: `QT-${Date.now().toString().slice(-8)}` });
            quoteId = (created as any)?.id;
          }
          if (quoteId) {
            await supabase.from("quotation_items").delete().eq("quotation_id", quoteId);
            if (lineItems.length) {
              const rows = lineItems.map((li) => ({
                quotation_id: quoteId,
                product_id: li.product_id || null,
                service_id: li.service_id || null,
                name: li.name,
                unit_price: Number(li.unit_price) || 0,
                quantity: Number(li.quantity) || 1,
                line_total: (Number(li.unit_price) || 0) * (Number(li.quantity) || 1),
                is_labor: !!li.is_labor,
              }));
              await supabase.from("quotation_items").insert(rows);
            }
          }
          qc.invalidateQueries({ queryKey: ["quotations"] });
          toast.success("Saved"); setOpen(false);
        }} />

      <PrintDialog quote={printing} onClose={() => setPrinting(null)} />
    </PageShell>
  );
}

function QuoteDialog({ open, editing, customers, vehicles, products, services, onClose, onSave }: any) {
  const [v, setV] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);

  // Load existing items when editing
  const { data: existingItems = [] } = useQuery({
    queryKey: ["quotation_items", editing?.id],
    enabled: !!editing?.id && open,
    queryFn: async () => {
      const { data, error } = await supabase.from("quotation_items").select("*").eq("quotation_id", editing.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!open) return;
    setV(editing ?? { customer_id: "", vehicle_id: "", subtotal: 0, discount: 0, total: 0, downpayment: 0, valid_until: "", status: "draft", notes: "" });
    setItems(editing ? existingItems.map((i: any) => ({ ...i })) : []);
  }, [open, editing, existingItems]);

  const subtotal = items.reduce((s, it) => s + (Number(it.unit_price) || 0) * (Number(it.quantity) || 1), 0);
  const discount = Number(v.discount || 0);
  const total = subtotal - discount;

  function addItem(type: "part" | "labor" | "service") {
    if (type === "part") setItems([...items, { product_id: "", name: "", quantity: 1, unit_price: 0, is_labor: false }]);
    else if (type === "labor") setItems([...items, { name: "Labor", quantity: 1, unit_price: 0, is_labor: true }]);
    else setItems([...items, { service_id: "", name: "", quantity: 1, unit_price: 0, is_labor: false }]);
  }
  function updateItem(idx: number, patch: any) {
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function removeItem(idx: number) { setItems(items.filter((_, i) => i !== idx)); }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "Edit Quotation" : "New Quotation"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Customer">
              <select value={v.customer_id ?? ""} onChange={(e) => setV({ ...v, customer_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
                <option value="">—</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </Field>
            <Field label="Vehicle">
              <select value={v.vehicle_id ?? ""} onChange={(e) => setV({ ...v, vehicle_id: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
                <option value="">—</option>{vehicles.map((x: any) => <option key={x.id} value={x.id}>{x.make} {x.model}</option>)}
              </select>
            </Field>
          </div>

          {/* Line items */}
          <div className="rounded-xl border border-border">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/40">
              <div className="text-xs font-semibold uppercase tracking-wider">Parts & Labor</div>
              <div className="flex gap-1">
                <button type="button" onClick={() => addItem("part")} className="h-7 px-2 rounded border border-border text-[11px] font-semibold hover:bg-background">+ Part</button>
                <button type="button" onClick={() => addItem("service")} className="h-7 px-2 rounded border border-border text-[11px] font-semibold hover:bg-background">+ Service</button>
                <button type="button" onClick={() => addItem("labor")} className="h-7 px-2 rounded border border-border text-[11px] font-semibold hover:bg-background">+ Labor</button>
              </div>
            </div>
            <div className="p-2 space-y-2">
              {items.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No items yet. Add parts or labor above.</div>
              ) : items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    {it.is_labor ? (
                      <input value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} placeholder="Labor description"
                        className="w-full h-9 px-2 rounded border border-border text-sm" />
                    ) : it.service_id !== undefined ? (
                      <select value={it.service_id ?? ""} onChange={(e) => {
                        const svc = services.find((s: any) => s.id === e.target.value);
                        updateItem(idx, { service_id: e.target.value || null, name: svc?.name ?? "", unit_price: svc?.rate ?? it.unit_price });
                      }} className="w-full h-9 px-2 rounded border border-border text-sm bg-background">
                        <option value="">Select service…</option>
                        {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    ) : (
                      <select value={it.product_id ?? ""} onChange={(e) => {
                        const p = products.find((x: any) => x.id === e.target.value);
                        updateItem(idx, { product_id: e.target.value || null, name: p?.name ?? "", unit_price: Number(p?.retail_price ?? p?.base_price ?? it.unit_price) });
                      }} className="w-full h-9 px-2 rounded border border-border text-sm bg-background">
                        <option value="">Select part…</option>
                        {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                      </select>
                    )}
                  </div>
                  <div className="col-span-2">
                    <input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) || 1 })}
                      placeholder="Qty" className="w-full h-9 px-2 rounded border border-border text-sm text-right" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min={0} value={it.unit_price} onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) || 0 })}
                      placeholder="Price" className="w-full h-9 px-2 rounded border border-border text-sm text-right" />
                  </div>
                  <div className="col-span-2 text-right text-sm font-semibold">{peso((Number(it.unit_price) || 0) * (Number(it.quantity) || 1))}</div>
                  <button type="button" onClick={() => removeItem(idx)} className="col-span-1 h-9 w-9 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 mx-auto"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Field label="Discount (₱)"><input type="number" value={v.discount ?? 0} onChange={(e) => setV({ ...v, discount: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Downpayment"><input type="number" value={v.downpayment ?? 0} onChange={(e) => setV({ ...v, downpayment: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
            <Field label="Valid Until"><input type="date" value={v.valid_until ?? ""} onChange={(e) => setV({ ...v, valid_until: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-border" /></Field>
          </div>
          <Field label="Notes"><textarea value={v.notes ?? ""} onChange={(e) => setV({ ...v, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border" /></Field>

          <div className="rounded-lg bg-secondary/40 p-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{peso(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{peso(discount)}</span></div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-1"><span>Total</span><span>{peso(total)}</span></div>
          </div>

          <button onClick={() => onSave({ ...v, subtotal, tax: 0, total }, items)} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Save Quotation</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: any) {
  return (<div><label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label><div className="mt-1">{children}</div></div>);
}

function PrintDialog({ quote, onClose }: any) {
  const { data: items = [] } = useQuery({
    queryKey: ["quotation_items_print", quote?.id],
    enabled: !!quote?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("quotation_items").select("*").eq("quotation_id", quote.id);
      if (error) throw error;
      return data ?? [];
    },
  });
  if (!quote) return null;
  return (
    <Dialog open={!!quote} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between print:hidden">
            <span>Quotation Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadElementAsPdf(document.getElementById("printable-quote"), `Quotation-${quote.quotation_number}`)}
                className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary"
              >
                <Download className="h-3.5 w-3.5" />PDF
              </button>
              <button onClick={() => window.print()} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5">
                <Printer className="h-3.5 w-3.5" />Print
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div id="printable-quote" className="p-6 bg-white text-black">
          <div className="flex justify-between items-start border-b border-zinc-300 pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">QUOTATION</h1>
              <div className="text-sm text-zinc-600 mt-1">{quote.quotation_number}</div>
            </div>
            <div className="text-right text-xs text-zinc-600">
              <div>Date: {new Date(quote.created_at).toLocaleDateString()}</div>
              {quote.valid_until && <div>Valid until: {quote.valid_until}</div>}
              <div className="mt-1 font-semibold uppercase">{quote.status}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="text-xs uppercase text-zinc-500 font-semibold">Customer</div>
              <div>{quote.customer?.full_name ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-zinc-500 font-semibold">Vehicle</div>
              <div>{quote.vehicle ? `${quote.vehicle.make} ${quote.vehicle.model}` : "—"}</div>
            </div>
          </div>
          <table className="w-full text-sm border-collapse mb-4">
            <thead>
              <tr className="border-b-2 border-zinc-300">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2 w-16">Qty</th>
                <th className="text-right py-2 w-24">Unit</th>
                <th className="text-right py-2 w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-zinc-500">No items</td></tr>
              ) : items.map((it: any) => (
                <tr key={it.id} className="border-b border-zinc-200">
                  <td className="py-2">{it.name}{it.is_labor && <span className="text-xs text-zinc-500 ml-2">(labor)</span>}</td>
                  <td className="text-right">{it.quantity}</td>
                  <td className="text-right">{peso(Number(it.unit_price))}</td>
                  <td className="text-right">{peso(Number(it.line_total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{peso(Number(quote.subtotal))}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{peso(Number(quote.discount))}</span></div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-zinc-300 pt-1"><span>TOTAL</span><span>{peso(Number(quote.total))}</span></div>
              {Number(quote.downpayment) > 0 && (
                <div className="flex justify-between text-xs text-zinc-600"><span>Downpayment</span><span>{peso(Number(quote.downpayment))}</span></div>
              )}
            </div>
          </div>
          {quote.notes && (
            <div className="mt-4 pt-3 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="uppercase font-semibold mb-1">Notes</div>
              <div>{quote.notes}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}