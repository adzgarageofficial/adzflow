import { createFileRoute } from "@tanstack/react-router";
import adzLogo from "@/assets/adz-logo.png";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { AmountInput } from "@/components/ui/amount-input";
import { downloadElementAsPdf } from "@/lib/pdf";
import {
  Search, PackageCheck, PackageX, PackageMinus, Boxes,
  User, Hash, FileText, Plus, Minus, X, Printer, Download,
  ShoppingCart, Car, Trash2,
} from "lucide-react";

export const Route = createFileRoute("/stock-check-4bb144df5336")({ component: StockCheckPage });

type Row = {
  id: string; sku: string; name: string;
  brand: string | null; category: string | null;
  image_url: string | null; quantity_available: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
};
type CartLine = { uid: string; product_id: string | null; name: string; unit_price: number; quantity: number; };

const STATUS_META: Record<Row["status"], { label: string; icon: any; cls: string }> = {
  in_stock:     { label: "Available",    icon: PackageCheck, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  low_stock:    { label: "Low stock",    icon: PackageMinus, cls: "text-amber-700 bg-amber-50 border-amber-200" },
  out_of_stock: { label: "Out of stock", icon: PackageX,     cls: "text-rose-700 bg-rose-50 border-rose-200" },
};
const STATUS_Q: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700", sent: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700", rejected: "bg-rose-50 text-rose-700",
  expired: "bg-amber-50 text-amber-700", converted: "bg-purple-50 text-purple-700",
};
const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt2 = (n: number) => n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-PH", { month: "numeric", day: "numeric", year: "numeric" });

function useDebounced<T>(value: T, delay = 300) {
  const [d, setD] = useState(value);
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return d;
}

function StockCheckPage() {
  // Customer context
  const [custName, setCustName] = useState("");
  const [custCar, setCustCar]   = useState("");
  const [plate, setPlate]       = useState("");

  // Product search
  const [query, setQuery] = useState("");
  const search = useDebounced(query.trim(), 300);
  const debouncedPlate = useDebounced(plate.trim().toUpperCase(), 400);

  // Cart
  const [cart, setCart]           = useState<CartLine[]>([]);
  const [discount, setDiscount]   = useState(0);
  const [notes, setNotes]         = useState("");
  const [showCartPanel, setShowCartPanel] = useState(false);

  // Print preview
  const [showPrint, setShowPrint] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const quoteNumber = useRef(`QT-${Date.now().toString().slice(-8)}`);

  // Company settings
  const { data: settings } = useQuery<any>({
    queryKey: ["company_settings_sc"],
    queryFn: async () => {
      const { data } = await supabase.from("company_settings").select("*").limit(1).maybeSingle();
      return data ?? {};
    },
  });

  // Products
  const { data: rows = [], isLoading, isFetching } = useQuery<Row[]>({
    queryKey: ["public_stock_lookup", search],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("public_stock_lookup", { p_search: search || null });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  // Quotation history by plate
  const { data: plateQuotes = [], isLoading: quotesLoading } = useQuery<any[]>({
    queryKey: ["quotations_by_plate_sc", debouncedPlate],
    enabled: debouncedPlate.length >= 3,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select("id,quotation_number,walk_in_name,walk_in_car,walk_in_plate,total,status,created_at,valid_until")
        .ilike("walk_in_plate", `%${debouncedPlate}%`)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  function addToCart(r: Row) {
    setCart((prev) => {
      const ex = prev.find((x) => x.product_id === r.id);
      if (ex) return prev.map((x) => x.product_id === r.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { uid: `p-${r.id}`, product_id: r.id, name: r.name, unit_price: 0, quantity: 1 }];
    });
  }

  function addCustomLine() {
    setCart((prev) => [...prev, { uid: `c-${Date.now()}`, product_id: null, name: "", unit_price: 0, quantity: 1 }]);
  }

  function updateLine(uid: string, patch: Partial<CartLine>) {
    setCart((prev) => prev.map((x) => x.uid === uid ? { ...x, ...patch } : x));
  }

  function removeLine(uid: string) {
    setCart((prev) => prev.filter((x) => x.uid !== uid));
  }

  const subtotal = cart.reduce((s, x) => s + x.unit_price * x.quantity, 0);
  const total = subtotal - Math.min(Math.max(0, discount), subtotal);

  // Company info for print
  const companyName    = settings?.company_name  || "ADZ Garage";
  const companyAddress = settings?.address        || "";
  const companyPhone   = settings?.phone          || "";
  const companyEmail   = settings?.email          || "";
  const logoSrc        = settings?.logo_url       || adzLogo;
  const footerText     = settings?.receipt_footer || "Thank you for your business!";
  const emptyRows      = Math.max(0, 5 - cart.length);

  return (
    <div className="min-h-screen w-full bg-surface px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-5">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-black flex items-center justify-center overflow-hidden">
            <img src={adzLogo} alt="ADZ Garage" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Stock Check</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search parts · Check quotation history by plate · Print a quote on the spot.
          </p>
        </div>

        {/* Customer info */}
        <div className="rounded-2xl border border-border bg-card shadow-soft p-4 space-y-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Customer Info</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={custName} onChange={(e) => setCustName(e.target.value)}
                placeholder="Customer name" className="h-10 pl-9 text-sm" />
            </div>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={custCar} onChange={(e) => setCustCar(e.target.value)}
                placeholder="Car (e.g. Toyota Vios 2020)" className="h-10 pl-9 text-sm" />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="Plate (ABC 1234)" className="h-10 pl-9 text-sm font-mono uppercase" />
            </div>
          </div>

          {/* Quotation history */}
          {debouncedPlate.length >= 3 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                <FileText className="h-3 w-3" />Existing Quotes for "{debouncedPlate}"
              </div>
              {quotesLoading ? (
                <p className="text-xs text-muted-foreground py-2">Checking…</p>
              ) : plateQuotes.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No existing quotation for this plate.</p>
              ) : (
                <div className="space-y-1.5">
                  {plateQuotes.map((q: any) => (
                    <div key={q.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{q.quotation_number}</div>
                        <div className="text-muted-foreground truncate">
                          {q.walk_in_name || "—"} · {q.walk_in_car || "—"} · <span className="font-mono">{q.walk_in_plate}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(q.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                          {q.valid_until && ` · valid til ${q.valid_until}`}
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <div className="font-bold">{peso(Number(q.total))}</div>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_Q[q.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                          {q.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product search */}
        <div className="rounded-2xl border border-border bg-card shadow-soft p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a product name or SKU…" className="h-11 pl-9" />
          </div>

          <div className="mt-4 space-y-2">
            {isLoading || (isFetching && rows.length === 0 && search) ? (
              <p className="text-sm text-muted-foreground text-center py-8">Checking stock…</p>
            ) : !search ? (
              <div className="text-center py-10 text-muted-foreground">
                <Boxes className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to check item availability.</p>
              </div>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No matching item found.</p>
            ) : rows.map((r) => {
              const meta = STATUS_META[r.status];
              const Icon = meta.icon;
              const inCart = cart.some((x) => x.product_id === r.id);
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  {r.image_url ? (
                    <img src={r.image_url} alt="" className="h-11 w-11 rounded-lg object-cover border border-border shrink-0" />
                  ) : (
                    <div className="h-11 w-11 rounded-lg bg-secondary grid place-items-center shrink-0">
                      <Boxes className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.sku}{r.brand ? ` · ${r.brand}` : ""}{r.category ? ` · ${r.category}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.cls}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {meta.label}
                      {r.status !== "out_of_stock" && <span className="opacity-70">· {r.quantity_available} pc</span>}
                    </span>
                    <button
                      onClick={() => addToCart(r)}
                      className={`h-8 w-8 rounded-lg inline-flex items-center justify-center border transition ${inCart ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
                      title={inCart ? "In cart" : "Add to cart"}
                    >
                      {inCart ? <ShoppingCart className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-20">
          This link is for internal use only — please don't share it outside the team.
        </p>
      </div>

      {/* ── Floating Cart Button ── */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCartPanel(true)}
          className="fixed bottom-6 right-6 z-40 h-14 rounded-full bg-primary text-primary-foreground shadow-xl px-5 inline-flex items-center gap-2.5 font-semibold text-sm"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Cart</span>
          <span className="h-5 w-5 rounded-full bg-white text-primary text-[10px] font-bold inline-flex items-center justify-center leading-none">
            {cart.length}
          </span>
        </button>
      )}

      {/* ── Cart Panel ── */}
      {showCartPanel && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="font-semibold text-sm">Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={addCustomLine}
                  className="h-7 px-2.5 rounded-lg border border-zinc-200 text-[11px] font-semibold hover:bg-zinc-50">
                  + Custom Line
                </button>
                <button
                  onClick={() => setShowCartPanel(false)}
                  className="h-8 w-8 rounded-lg border border-zinc-200 inline-flex items-center justify-center hover:bg-zinc-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.map((line) => (
                <div key={line.uid} className="rounded-lg border border-zinc-200 p-3 space-y-2 bg-white">
                  {!line.product_id ? (
                    <input
                      value={line.name}
                      onChange={(e) => updateLine(line.uid, { name: e.target.value })}
                      placeholder="Item / labor description"
                      className="w-full h-8 px-2 rounded border border-zinc-200 text-xs" />
                  ) : (
                    <div className="text-xs font-semibold truncate">{line.name}</div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateLine(line.uid, { quantity: Math.max(1, line.quantity - 1) })}
                      className="h-7 w-7 rounded border border-zinc-200 inline-flex items-center justify-center hover:bg-zinc-50 shrink-0">
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number" min={1} value={line.quantity}
                      onChange={(e) => updateLine(line.uid, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                      className="w-10 h-7 text-center rounded border border-zinc-200 text-xs" />
                    <button
                      onClick={() => updateLine(line.uid, { quantity: line.quantity + 1 })}
                      className="h-7 w-7 rounded border border-zinc-200 inline-flex items-center justify-center hover:bg-zinc-50 shrink-0">
                      <Plus className="h-3 w-3" />
                    </button>
                    <AmountInput
                      value={line.unit_price || null}
                      onChange={(val) => updateLine(line.uid, { unit_price: val || 0 })}
                      placeholder="Unit price"
                      className="flex-1 h-7 px-2 rounded border border-zinc-200 text-xs text-right min-w-0" />
                    <div className="text-xs font-bold w-20 text-right shrink-0">{peso(line.unit_price * line.quantity)}</div>
                    <button
                      onClick={() => removeLine(line.uid)}
                      className="h-7 w-7 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 space-y-3 bg-zinc-50">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-semibold text-zinc-500">Discount ₱</label>
                <AmountInput
                  value={discount || null}
                  onChange={(val) => setDiscount(val || 0)}
                  className="w-28 h-8 px-2 rounded border border-zinc-200 text-xs text-right bg-white" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Description of work / notes (optional)"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs resize-none bg-white" />
              <div className="rounded-lg bg-white border border-zinc-200 p-3 space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span><span className="font-semibold text-zinc-800">{peso(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-zinc-500">
                    <span>Discount</span><span className="text-rose-600">-{peso(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-zinc-200 pt-1.5">
                  <span>Total</span><span>{peso(total)}</span>
                </div>
              </div>
              <button
                onClick={() => { setShowCartPanel(false); setShowPrint(true); }}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />Get Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Print Preview Overlay ── */}
      {showPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 print:hidden">
              <span className="text-sm font-semibold">Quotation Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadElementAsPdf(document.getElementById("sc-printable-quote"), `Quotation-${quoteNumber.current}`)}
                  className="h-9 px-3 rounded-lg border border-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-zinc-50">
                  <Download className="h-3.5 w-3.5" />PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-9 px-3 rounded-lg bg-zinc-900 text-white text-xs font-semibold inline-flex items-center gap-1.5">
                  <Printer className="h-3.5 w-3.5" />Print
                </button>
                <button
                  onClick={() => setShowPrint(false)}
                  className="h-9 w-9 rounded-lg border border-zinc-200 inline-flex items-center justify-center hover:bg-zinc-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable document */}
            <div id="sc-printable-quote" ref={printRef}
              className="bg-white text-black text-[11px] leading-snug p-6 space-y-3 font-sans">

              {/* ── Header ── */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-xl bg-black flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoSrc} alt={companyName}
                      className="h-12 w-12 object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = adzLogo; }} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[15px] font-extrabold tracking-tight leading-tight">{companyName}</div>
                    {companyAddress && <div className="text-zinc-500 text-[10px]">{companyAddress}</div>}
                    {companyPhone   && <div className="text-zinc-500 text-[10px]">Phone: {companyPhone}</div>}
                    {companyEmail   && <div className="text-zinc-500 text-[10px]">{companyEmail}</div>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[28px] font-extrabold tracking-widest uppercase leading-none">QUOTATION</div>
                  <table className="mt-2 border-collapse text-[10px] ml-auto">
                    <tbody>
                      <tr>
                        <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1 whitespace-nowrap">Quote #</td>
                        <td className="border border-zinc-400 px-3 py-1 font-mono min-w-[90px]">{quoteNumber.current}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1">Date</td>
                        <td className="border border-zinc-400 px-3 py-1">{fmtDate(new Date().toISOString())}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1">Customer</td>
                        <td className="border border-zinc-400 px-3 py-1">{custName || "Walk-in"}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-400 bg-zinc-100 font-bold uppercase px-3 py-1 whitespace-nowrap">Valid Until</td>
                        <td className="border border-zinc-400 px-3 py-1 text-zinc-400">—</td>
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
                    <div className="font-semibold text-[12px]">{custName || "Walk-in"}</div>
                    {custCar  && <div className="text-zinc-600">{custCar}</div>}
                    {plate    && <div className="font-mono font-semibold text-zinc-700">{plate}</div>}
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
                <div className="p-3 min-h-[40px] whitespace-pre-wrap text-zinc-700">{notes || ""}</div>
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
                  {cart.map((line, i) => (
                    <tr key={line.uid} className="border-b border-zinc-200">
                      <td className="border-x border-zinc-200 px-3 py-1.5">{line.name || `Item ${i + 1}`}</td>
                      <td className="border-x border-zinc-200 px-2 py-1.5 text-center">{line.quantity}</td>
                      <td className="border-x border-zinc-200 px-3 py-1.5 text-right">{fmt2(line.unit_price)}</td>
                      <td className="border-x border-zinc-200 px-3 py-1.5 text-right">{fmt2(line.unit_price * line.quantity)}</td>
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
                      {footerText}
                    </td>
                    <td className="border border-zinc-300 bg-zinc-100 px-3 py-1 text-right font-bold uppercase">Subtotal</td>
                    <td className="border border-zinc-300 px-3 py-1 text-right">{fmt2(subtotal)}</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-300 bg-zinc-100 px-3 py-1 text-right font-bold uppercase">
                      {discount > 0 ? "Discount" : "Other"}
                    </td>
                    <td className="border border-zinc-300 px-3 py-1 text-right">
                      {discount > 0
                        ? <span className="text-rose-700">({fmt2(discount)})</span>
                        : <span className="text-zinc-400">—</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 bg-zinc-800 text-white px-3 py-2 text-right font-bold uppercase tracking-wider">Total Quote</td>
                    <td className="border border-zinc-800 bg-zinc-800 text-white px-3 py-2 text-right font-bold text-[13px]">
                      ₱ {fmt2(total)}
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

              {/* ── Footer contact ── */}
              <div className="text-center text-[9px] text-zinc-400 border-t border-zinc-100 pt-2">
                {[companyName, companyPhone, companyEmail].filter(Boolean).join("  •  ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
