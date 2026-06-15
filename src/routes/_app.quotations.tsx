import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { AmountInput } from "@/components/ui/amount-input";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2, ArrowRight, Printer, ShoppingCart, X, Download, Minus, Car, User, Hash, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuotations, useProducts, useInsert, useUpdate, useDelete, peso, useIsOwner, useCompanySettings } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import adzLogo from "@/assets/adz-logo.png";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { downloadElementAsPdf } from "@/lib/pdf";

export const Route = createFileRoute("/_app/quotations")({ component: QuotationsPage });


function fuzzyMatch(hay: string, q: string) {
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}

function QuotationsPage() {
  const { data: quotes = [] } = useQuotations();
  const { data: products = [] } = useProducts();
  const ins = useInsert("quotations");
  const canEdit = useIsOwner();
  const upd = useUpdate("quotations");
  const del = useDelete("quotations");
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [printing, setPrinting] = useState<any | null>(null);

  const filtered = useMemo(() => (quotes as any[]).filter((x) => {
    if (!q) return true;
    const hay = [x.quotation_number, x.walk_in_name, x.walk_in_plate, x.customer?.full_name].filter(Boolean).join(" ").toLowerCase();
    return fuzzyMatch(hay, q);
  }), [quotes, q]);

  async function convertToOrder(quote: any) {
    if (!confirm("Convert this quotation to an order?")) return;
    const { data: u } = await supabase.auth.getUser();
    const { data: order, error } = await supabase.from("orders").insert({
      order_number: `ORD-${Date.now().toString().slice(-8)}`,
      channel: "pos", status: "pending",
      customer_id: quote.customer_id ?? null, vehicle_id: quote.vehicle_id ?? null,
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
    const notesParts = [
      quote.walk_in_name && `Walk-in: ${quote.walk_in_name}`,
      quote.walk_in_car && `Vehicle: ${quote.walk_in_car}`,
      quote.walk_in_plate && `Plate: ${quote.walk_in_plate}`,
    ].filter(Boolean).join(" | ");
    localStorage.setItem("pos.preload", JSON.stringify({
      cart, customerId: quote.customer_id || "",
      discountAmount: Number(quote.discount || 0),
      label: quote.quotation_number,
      notes: notesParts || undefined,
    }));
    toast.success(`Sent ${quote.quotation_number} to POS`);
    navigate({ to: "/pos" });
  }

  return (
    <PageShell title="Quotations" subtitle="Estimates and proposals.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, plate, quote#…"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/stock-check-4bb144df5336"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-4 rounded-xl border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary"
          >
            <ExternalLink className="h-4 w-4" />Stock Check
          </a>
          <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
            <Plus className="h-4 w-4" />New Quotation
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-medium px-6 py-3">Quote #</th>
              <th className="text-left font-medium px-6 py-3">Customer</th>
              <th className="text-left font-medium px-6 py-3">Car / Plate</th>
              <th className="text-right font-medium px-6 py-3">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No quotations yet.</td></tr>
            ) : filtered.map((x: any) => (
              <tr key={x.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3 font-medium">{x.quotation_number}</td>
                <td className="px-6 py-3">{x.walk_in_name || x.customer?.full_name || "—"}</td>
                <td className="px-6 py-3 text-xs text-muted-foreground">
                  {x.walk_in_car && <span>{x.walk_in_car}</span>}
                  {x.walk_in_plate && (
                    <span className="ml-1.5 font-mono bg-secondary border border-border px-1 py-0.5 rounded text-[10px]">{x.walk_in_plate}</span>
                  )}
                  {!x.walk_in_car && !x.walk_in_plate && "—"}
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

      <QuoteDialog
        open={open}
        editing={editing}
        products={products}
        onClose={() => setOpen(false)}
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
              await supabase.from("quotation_items").insert(
                lineItems.map((li) => ({
                  quotation_id: quoteId,
                  product_id: li.product_id || null,
                  service_id: null,
                  name: li.name,
                  unit_price: Number(li.unit_price) || 0,
                  quantity: Number(li.quantity) || 1,
                  line_total: (Number(li.unit_price) || 0) * (Number(li.quantity) || 1),
                  is_labor: !!li.is_labor,
                }))
              );
            }
          }
          qc.invalidateQueries({ queryKey: ["quotations"] });
          toast.success("Saved"); setOpen(false);
        }}
      />

      <PrintDialog quote={printing} onClose={() => setPrinting(null)} />
    </PageShell>
  );
}

type CartLine = { product_id: string | null; name: string; unit_price: number; quantity: number; is_labor: boolean };

function QuoteDialog({ open, editing, products, onClose, onSave }: any) {
  const [walkInName, setWalkInName] = useState("");
  const [walkInCar, setWalkInCar] = useState("");
  const [walkInPlate, setWalkInPlate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<CartLine[]>([]);
  const [productSearch, setProductSearch] = useState("");

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
    if (editing) {
      setWalkInName(editing.walk_in_name ?? editing.customer?.full_name ?? "");
      setWalkInCar(editing.walk_in_car ?? (editing.vehicle ? `${editing.vehicle.make} ${editing.vehicle.model}` : ""));
      setWalkInPlate(editing.walk_in_plate ?? editing.vehicle?.plate_number ?? "");
      setDiscount(Number(editing.discount ?? 0));
      setNotes(editing.notes ?? "");
    } else {
      setWalkInName(""); setWalkInCar(""); setWalkInPlate("");
      setDiscount(0); setNotes("");
      setItems([]);
    }
    setProductSearch("");
  }, [open, editing]);

  useEffect(() => {
    if (editing && (existingItems as any[]).length > 0 && open) {
      setItems((existingItems as any[]).map((i) => ({
        product_id: i.product_id,
        name: i.name,
        unit_price: Number(i.unit_price),
        quantity: Number(i.quantity),
        is_labor: i.is_labor,
      })));
    }
  }, [existingItems, editing, open]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products as any[];
    return (products as any[]).filter((p: any) =>
      fuzzyMatch([p.sku, p.name, p.brand?.name].filter(Boolean).join(" ").toLowerCase(), q)
    );
  }, [products, productSearch]);

  function addProduct(p: any) {
    const price = Number(p.retail_price ?? p.base_price ?? 0);
    setItems((prev) => {
      const ex = prev.find((x) => x.product_id === p.id);
      if (ex) return prev.map((x) => x.product_id === p.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { product_id: p.id, name: p.name, unit_price: price, quantity: 1, is_labor: false }];
    });
  }

  function updateItem(idx: number, patch: Partial<CartLine>) {
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const subtotal = items.reduce((s, it) => s + it.unit_price * it.quantity, 0);
  const total = subtotal - Math.min(Math.max(0, discount), subtotal);

  function handleSave() {
    if (!walkInName.trim()) return toast.error("Please enter the customer name");
    onSave({
      walk_in_name: walkInName.trim() || null,
      walk_in_car: walkInCar.trim() || null,
      walk_in_plate: walkInPlate.trim().toUpperCase() || null,
      discount, notes: notes || null,
      subtotal, tax: 0, total,
    }, items);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Quotation" : "New Quotation"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer info */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />Customer Name <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input value={walkInName} onChange={(e) => setWalkInName(e.target.value)}
                placeholder="Juan dela Cruz"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                <Car className="h-3 w-3" />Car / Vehicle
              </label>
              <input value={walkInCar} onChange={(e) => setWalkInCar(e.target.value)}
                placeholder="Toyota Vios 2020"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />Plate Number
              </label>
              <input value={walkInPlate} onChange={(e) => setWalkInPlate(e.target.value.toUpperCase())}
                placeholder="ABC 1234"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm font-mono" />
            </div>
          </div>

          {/* Product search + cart */}
          <div className="grid grid-cols-[1fr_380px] gap-4">
            {/* Left: product catalog */}
            <div className="rounded-xl border border-border flex flex-col overflow-hidden">
              <div className="p-2 border-b border-border bg-secondary/40">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product or SKU…"
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-border text-sm bg-background" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto" style={{ maxHeight: 280 }}>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No products found</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-secondary/90 text-muted-foreground uppercase tracking-wider">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Item</th>
                        <th className="text-right px-3 py-2 font-medium">SRP</th>
                        <th className="w-10 px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p: any) => (
                        <tr key={p.id} className="border-t border-border hover:bg-secondary/30 cursor-pointer" onClick={() => addProduct(p)}>
                          <td className="px-3 py-2">
                            <div className="font-medium leading-tight">{p.name}</div>
                            <div className="text-muted-foreground text-[10px]">{p.sku}</div>
                          </td>
                          <td className="px-3 py-2 text-right font-semibold">{peso(Number(p.retail_price ?? p.base_price ?? 0))}</td>
                          <td className="px-2 py-2 text-center">
                            <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground inline-flex items-center justify-center hover:opacity-90">
                              <Plus className="h-3 w-3" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-2 border-t border-border">
                <button onClick={() => setItems((p) => [...p, { product_id: null, name: "", unit_price: 0, quantity: 1, is_labor: true }])}
                  className="h-8 w-full rounded-lg border border-dashed border-border text-[11px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition">
                  + Add Labor / Custom Line
                </button>
              </div>
            </div>

            {/* Right: cart */}
            <div className="rounded-xl border border-border flex flex-col">
              <div className="px-3 py-2 border-b border-border bg-secondary/40 text-[10px] font-bold uppercase tracking-wider">
                Quotation Items
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5" style={{ maxHeight: 280 }}>
                {items.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground leading-relaxed">
                    No items yet.<br />Select from the catalog on the left.
                  </div>
                ) : items.map((it, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-2 space-y-1.5 bg-background">
                    {it.is_labor || !it.product_id ? (
                      <input value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })}
                        placeholder="Pangalan ng item / labor"
                        className="w-full h-7 px-2 rounded border border-border text-xs" />
                    ) : (
                      <div className="text-xs font-semibold truncate leading-tight">{it.name}</div>
                    )}
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateItem(idx, { quantity: Math.max(1, it.quantity - 1) })}
                        className="h-6 w-6 rounded border border-border inline-flex items-center justify-center hover:bg-secondary shrink-0">
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <input type="number" min={1} value={it.quantity}
                        onChange={(e) => updateItem(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                        className="w-9 h-6 text-center rounded border border-border text-xs" />
                      <button onClick={() => updateItem(idx, { quantity: it.quantity + 1 })}
                        className="h-6 w-6 rounded border border-border inline-flex items-center justify-center hover:bg-secondary shrink-0">
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                      <AmountInput value={it.unit_price} onChange={(val) => updateItem(idx, { unit_price: val || 0 })}
                        className="flex-1 h-6 px-2 rounded border border-border text-xs text-right min-w-0" />
                      <div className="text-[11px] font-bold w-16 text-right shrink-0">{peso(it.unit_price * it.quantity)}</div>
                      <button onClick={() => removeItem(idx)}
                        className="h-6 w-6 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 shrink-0">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border space-y-1.5 text-xs bg-secondary/20">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span className="font-semibold text-foreground">{peso(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Discount ₱</span>
                  <AmountInput value={discount || null} onChange={(val) => setDiscount(val || 0)}
                    className="w-24 h-7 px-2 rounded border border-border text-right text-xs" />
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-border pt-1.5">
                  <span>Total</span><span>{peso(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description of Work */}
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Description of Work</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Ilarawan ang gawaing gagawin…"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
          </div>

          <button onClick={handleSave}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
            Save Quotation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrintDialog({ quote, onClose }: any) {
  const { data: settingsList = [] } = useCompanySettings();
  const settings = (settingsList as any[])[0] ?? {};

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

  const companyName = settings.company_name || "ADZ Garage";
  const companyAddress = settings.address || "";
  const companyPhone = settings.phone || "";
  const companyEmail = settings.email || "";
  const companyLogoUrl = settings.logo_url || adzLogo;
  const receiptFooter = settings.receipt_footer || "Thank you for your business!";

  const customerName = quote.walk_in_name || quote.customer?.full_name || "—";
  const carName = quote.walk_in_car || (quote.vehicle ? `${quote.vehicle.make} ${quote.vehicle.model}` : "") || "";
  const plate = (quote.walk_in_plate || quote.vehicle?.plate_number || "").toUpperCase();
  const fmt = (n: number) => n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-PH", { month: "numeric", day: "numeric", year: "numeric" });
  const emptyRows = Math.max(0, 5 - (items as any[]).length);

  return (
    <Dialog open={!!quote} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between print:hidden">
            <span>Quotation Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadElementAsPdf(document.getElementById("printable-quote"), `Quotation-${quote.quotation_number}`)}
                className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
                <Download className="h-3.5 w-3.5" />PDF
              </button>
              <button onClick={() => window.print()}
                className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5">
                <Printer className="h-3.5 w-3.5" />Print
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div id="printable-quote" className="bg-white text-black text-[11px] leading-snug p-6 space-y-3 font-sans">

          {/* ── Header: Company (left) + QUOTATION title (right) ── */}
          <div className="flex items-start justify-between gap-4">
            {/* Company block */}
            <div className="flex items-start gap-3">
              <img
                src={companyLogoUrl}
                alt={companyName}
                className="h-14 w-14 rounded-xl object-cover shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = adzLogo; }}
              />
              <div className="space-y-0.5">
                <div className="text-[15px] font-extrabold tracking-tight leading-tight">{companyName}</div>
                {companyAddress && <div className="text-zinc-500 text-[10px]">{companyAddress}</div>}
                {companyPhone && <div className="text-zinc-500 text-[10px]">Phone: {companyPhone}</div>}
                {companyEmail && <div className="text-zinc-500 text-[10px]">{companyEmail}</div>}
              </div>
            </div>

            {/* QUOTATION + info table */}
            <div className="text-right shrink-0">
              <div className="text-[28px] font-extrabold tracking-widest uppercase leading-none">QUOTATION</div>
              <table className="mt-2 border-collapse text-[10px] ml-auto">
                <tbody>
                  <tr>
                    <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1 whitespace-nowrap">Quote #</td>
                    <td className="border border-zinc-400 px-3 py-1 font-mono min-w-[90px]">{quote.quotation_number}</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1">Date</td>
                    <td className="border border-zinc-400 px-3 py-1">{fmtDate(quote.created_at)}</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1">Customer ID</td>
                    <td className="border border-zinc-400 px-3 py-1 text-zinc-500">{quote.customer_id?.slice(0, 8) ?? "Walk-in"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Customer Info ── */}
          <div className="border border-zinc-300">
            <div className="bg-zinc-700 text-white text-[9px] font-bold uppercase px-3 py-1 tracking-widest">Customer Info</div>
            <div className="p-3 flex justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-semibold text-[12px]">{customerName}</div>
                {carName && <div className="text-zinc-600">{carName}</div>}
                {plate && <div className="font-mono font-semibold text-zinc-700">{plate}</div>}
              </div>
              <div className="text-right text-zinc-400 italic text-[10px] self-start">
                Prepared By:<br />
                <span className="not-italic font-semibold text-zinc-600">{companyName}</span>
              </div>
            </div>
          </div>

          {/* ── Description of Work ── */}
          <div className="border border-zinc-300">
            <div className="bg-zinc-700 text-white text-[9px] font-bold uppercase px-3 py-1 tracking-widest">Description of Work</div>
            <div className="p-3 min-h-[40px] whitespace-pre-wrap text-zinc-700">{quote.notes || ""}</div>
          </div>

          {/* ── Itemized Costs ── */}
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr>
                <th colSpan={4} className="bg-zinc-700 text-white text-left px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                  Itemized Costs
                </th>
              </tr>
              <tr className="bg-zinc-100">
                <th className="text-left border border-zinc-300 px-3 py-1.5 font-bold w-[55%]">Item / Description</th>
                <th className="text-center border border-zinc-300 px-2 py-1.5 font-bold w-[10%]">QTY</th>
                <th className="text-right border border-zinc-300 px-3 py-1.5 font-bold w-[17.5%]">Unit Price</th>
                <th className="text-right border border-zinc-300 px-3 py-1.5 font-bold w-[17.5%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(items as any[]).map((it, i) => (
                <tr key={it.id ?? i} className="border-b border-zinc-200">
                  <td className="border-x border-zinc-200 px-3 py-1.5">
                    {it.name}{it.is_labor ? <span className="text-zinc-400 ml-1">(labor)</span> : ""}
                  </td>
                  <td className="border-x border-zinc-200 px-2 py-1.5 text-center">{it.quantity}</td>
                  <td className="border-x border-zinc-200 px-3 py-1.5 text-right">{fmt(Number(it.unit_price))}</td>
                  <td className="border-x border-zinc-200 px-3 py-1.5 text-right">{fmt(Number(it.line_total ?? it.unit_price * it.quantity))}</td>
                </tr>
              ))}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`e${i}`} className="border-b border-zinc-200">
                  <td className="border-x border-zinc-200 px-3 py-2.5">&nbsp;</td>
                  <td className="border-x border-zinc-200 px-2 py-2.5"></td>
                  <td className="border-x border-zinc-200 px-3 py-2.5"></td>
                  <td className="border-x border-zinc-200 px-3 py-2.5 text-right text-zinc-300">-</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} rowSpan={3} className="border border-zinc-200 px-3 py-1 align-bottom italic text-zinc-400 text-[10px]">
                  {receiptFooter}
                </td>
                <td className="border border-zinc-300 bg-zinc-100 px-3 py-1 text-right font-bold uppercase">Subtotal</td>
                <td className="border border-zinc-300 px-3 py-1 text-right">{fmt(Number(quote.subtotal ?? 0))}</td>
              </tr>
              <tr>
                <td className="border border-zinc-300 bg-zinc-100 px-3 py-1 text-right font-bold uppercase">
                  {Number(quote.discount) > 0 ? "Discount" : "Other"}
                </td>
                <td className="border border-zinc-300 px-3 py-1 text-right">
                  {Number(quote.discount) > 0
                    ? <span className="text-rose-700">({fmt(Number(quote.discount))})</span>
                    : <span className="text-zinc-400">—</span>}
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-800 bg-zinc-800 text-white px-3 py-2 text-right font-bold uppercase tracking-wider">
                  Total Quote
                </td>
                <td className="border border-zinc-800 bg-zinc-800 text-white px-3 py-2 text-right font-bold text-[13px]">
                  ₱ {fmt(Number(quote.total ?? 0))}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* ── Terms ── */}
          <div className="text-[9px] text-zinc-500 border-t border-zinc-200 pt-2 leading-relaxed">
            This quotation is not a contract or a bill. It is our best estimate for the service and goods described above.
            The customer will be billed after indicating acceptance of this quote. Payment will be due prior to the delivery of service and goods.
            Please sign and return a copy to confirm acceptance.
          </div>

          {/* ── Customer Acceptance ── */}
          <div>
            <div className="text-[10px] font-semibold mb-5">Customer Acceptance</div>
            <div className="flex gap-6">
              <div className="flex-1 border-t border-zinc-400 pt-1 text-[9px] text-zinc-500 text-center">Signature</div>
              <div className="flex-1 border-t border-zinc-400 pt-1 text-[9px] text-zinc-500 text-center">Printed Name</div>
              <div className="w-28 border-t border-zinc-400 pt-1 text-[9px] text-zinc-500 text-center">Date</div>
            </div>
          </div>

          {/* ── Footer contact line ── */}
          <div className="text-center text-[9px] text-zinc-400 border-t border-zinc-100 pt-2">
            {[companyName, companyPhone, companyEmail].filter(Boolean).join("  •  ")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
