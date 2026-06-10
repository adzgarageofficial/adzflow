import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, CATALOG_NAV } from "@/components/sub-nav";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInventoryLevels, useProducts, useWarehouses, useSuppliers,
  usePurchaseOrders, useStockMovements, useInsert, useUpdate, useDelete, useNotifications, peso, useIsOwner } from "@/lib/db";
import { useRbac } from "@/lib/rbac";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Boxes, AlertTriangle, Layers, Search, Plus,
  Archive, TrendingUp, Edit2, Trash2, Wallet, Download,
} from "lucide-react";
import { downloadExcel } from "@/lib/export-excel";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({ component: Inventory });

function fuzzyMatch(haystack: string, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const h = haystack.toLowerCase();
  return words.every((w) => h.includes(w));
}

type Tab = "Stock" | "Movements" | "Purchase Orders" | "Suppliers" | "Warehouses";

function Inventory() {
  const { can } = useRbac();
  const canViewPrices = can("finance", "view");

  const [tab, setTab] = useState<Tab>("Stock");
  const [adjustOpen, setAdjustOpen] = useState<any | null>(null);
  const [newStockOpen, setNewStockOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const { data: levels = [] } = useInventoryLevels();
  useStockAlertNotifications(levels);

  const k = useMemo(() => {
    const totalUnits = levels.reduce((s: number, r: any) => s + (r.quantity || 0), 0);
    const low = levels.filter((r: any) => r.quantity > 0 && r.quantity <= (r.reorder_point || 0)).length;
    const out = levels.filter((r: any) => r.quantity <= 0).length;
    const reserved = levels.reduce((s: number, r: any) => s + (r.reserved_quantity || 0), 0);
    const totalCost = levels.reduce((s: number, r: any) => s + (r.quantity || 0) * Number(r.product?.cost_price || 0), 0);
    const totalRetail = levels.reduce((s: number, r: any) => s + (r.quantity || 0) * Number(r.product?.retail_price || r.product?.base_price || 0), 0);
    return { totalUnits, low, out, reserved, skus: levels.length, totalCost, totalRetail };
  }, [levels]);

  return (
    <PageShell title="Inventory" subtitle="Stock, movements, POs, suppliers & warehouses.">
      <SubNav items={CATALOG_NAV} label="Catalog" />

      <InventorySearchEngine
        levels={levels}
        onSelect={(id) => { setTab("Stock"); setHighlightId(id); }}
      />

      <div className={`grid grid-cols-2 ${canViewPrices ? "md:grid-cols-4" : "md:grid-cols-2"} gap-4 mt-4`}>
        {canViewPrices && <Kpi label="Inventory Value (Cost)" value={peso(k.totalCost)} icon={Wallet} />}
        {canViewPrices && <Kpi label="Inventory Value (Retail)" value={peso(k.totalRetail)} icon={TrendingUp} />}
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
          {tab === "Stock" && k.out > 0 && (
            <button
              onClick={() => {
                const oos = levels.filter((r: any) => r.quantity <= 0);
                const rows: any[][] = [
                  ["Product", "SKU", "Brand", "Category", "Warehouse", "Qty", "Reorder Pt", "Cost (₱)"],
                  ...oos.map((l: any) => [
                    l.product?.name ?? "",
                    l.product?.sku ?? "",
                    l.product?.brand?.name ?? "",
                    l.product?.category?.name ?? "",
                    l.warehouse?.name ?? "",
                    Number(l.quantity ?? 0),
                    Number(l.reorder_point ?? 0),
                    Number(l.product?.cost_price ?? 0),
                  ]),
                ];
                downloadExcel(
                  `ADZ-Out-of-Stock-${format(new Date(), "yyyyMMdd")}`,
                  "Out of Stock",
                  rows,
                  { headers: true, currency: [7] },
                );
              }}
              className="h-9 px-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-100"
            >
              <Download className="h-3.5 w-3.5" />Export Out of Stock ({k.out})
            </button>
          )}
          {tab === "Stock" && (
            <button onClick={() => setNewStockOpen(true)} className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft hover:opacity-95">
              <Plus className="h-3.5 w-3.5" />Add Stock Record
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        {tab === "Stock" && <StockTab levels={levels} onAdjust={setAdjustOpen} highlightId={highlightId} onHighlighted={() => setHighlightId(null)} />}
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

// Stock ages even unsold (tires being the prime example) — flags batches
// that are past their best-by date or closing in on it (within ~60 days).
function expiryTone(dateStr: string | null | undefined): "expired" | "soon" | "ok" | null {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.round((new Date(dateStr).getTime() - today.getTime()) / 86400000);
  if (days < 0) return "expired";
  if (days <= 60) return "soon";
  return "ok";
}
const EXPIRY_TONE_CLASS: Record<string, string> = {
  expired: "text-rose-600 font-semibold",
  soon: "text-amber-600 font-semibold",
  ok: "text-muted-foreground",
};

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

/* ---------- Standalone inventory search engine: deep multi-field lookup, jumps to & highlights the matching stock row ---------- */
function InventorySearchEngine({ levels, onSelect }: { levels: any[]; onSelect: (levelId: string) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return levels
      .filter((r: any) => {
        const haystack = [r.product?.name, r.product?.brand?.name, r.product?.category?.name, r.warehouse?.name]
          .filter(Boolean).join(" ");
        return fuzzyMatch(haystack, q);
      })
      .slice(0, 8);
  }, [levels, q]);

  return (
    <div ref={boxRef} className="relative mt-4">
      <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search by brand, variant, size…"
        className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-card text-sm shadow-soft"
      />
      {open && q.trim() && (
        <div className="absolute z-30 mt-1.5 w-full max-h-96 overflow-auto rounded-xl border border-border bg-card shadow-lg">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">No matches for "{q}"</div>
          ) : results.map((r: any) => {
            const tone = r.quantity <= 0 ? "danger" : r.quantity <= (r.reorder_point || 0) ? "warn" : null;
            return (
              <button
                key={r.id}
                onClick={() => { onSelect(r.id); setOpen(false); setQ(""); }}
                className="w-full text-left px-4 py-2.5 hover:bg-secondary/50 flex items-center justify-between gap-3 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{r.product?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {r.product?.sku ?? "—"} · {r.product?.brand?.name ?? "—"} · {r.product?.category?.name ?? "—"} · {r.warehouse?.name ?? "—"}
                  </div>
                </div>
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  tone === "danger" ? "bg-rose-50 text-rose-600" : tone === "warn" ? "bg-amber-50 text-amber-600" : "bg-secondary text-muted-foreground"
                }`}>{r.quantity} on hand</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Stock alert warning banner ---------- */
function StockAlertBanner({ levels, showOOS }: { levels: any[]; showOOS: boolean }) {
  const outOfStock = levels.filter((r: any) => r.quantity <= 0);
  const lowStock = levels.filter((r: any) => r.quantity > 0 && r.reorder_point > 0 && r.quantity <= r.reorder_point);

  const visibleOOS = showOOS ? outOfStock : [];
  const total = visibleOOS.length + lowStock.length;
  if (outOfStock.length === 0 && lowStock.length === 0) return null;

  const Item = ({ r, tone }: { r: any; tone: "danger" | "warn" }) => (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="min-w-0 truncate">
        <span className="font-medium">{r.product?.name ?? "—"}</span>
        <span className="text-xs text-muted-foreground"> · {r.product?.sku ?? "—"} · {r.warehouse?.name ?? "—"}</span>
      </span>
      <span className={`text-xs font-semibold whitespace-nowrap ${tone === "danger" ? "text-rose-600" : "text-amber-600"}`}>
        {tone === "danger" ? "Out of stock" : `${r.quantity} left (reorder at ${r.reorder_point})`}
      </span>
    </li>
  );

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 shadow-soft p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <h3 className="font-semibold text-sm text-amber-900">
          Stock warnings —{" "}
          {outOfStock.length > 0 && !showOOS
            ? `${lowStock.length} low stock · ${outOfStock.length} out of stock (hidden)`
            : `${total} item${total === 1 ? "" : "s"} need attention`}
        </h3>
      </div>
      {visibleOOS.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-rose-700 mb-1.5">Out of stock ({outOfStock.length})</p>
          <ul className="space-y-1.5">{visibleOOS.map((r: any) => <Item key={r.id} r={r} tone="danger" />)}</ul>
        </div>
      )}
      {lowStock.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 mb-1.5">Low stock ({lowStock.length})</p>
          <ul className="space-y-1.5">{lowStock.map((r: any) => <Item key={r.id} r={r} tone="warn" />)}</ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Auto-create real notifications for low/out-of-stock items ---------- */
function useStockAlertNotifications(levels: any[]) {
  const canCreate = useIsOwner();
  const { data: notifs = [] } = useNotifications();
  const insert = useInsert<any>("notifications");
  const alerted = useRef(new Set<string>());

  useEffect(() => {
    if (!canCreate || levels.length === 0) return;
    const openLinks = new Set(
      (notifs as any[]).filter((n) => !n.read_at && n.category === "inventory").map((n) => n.link),
    );
    for (const r of levels as any[]) {
      const isOut = r.quantity <= 0;
      const isLow = !isOut && r.reorder_point > 0 && r.quantity <= r.reorder_point;
      if (!isOut && !isLow) continue;

      const link = `/inventory?alert=${isOut ? "out" : "low"}&level=${r.id}`;
      if (alerted.current.has(link) || openLinks.has(link)) continue;
      alerted.current.add(link);

      const name = r.product?.name ?? "A product";
      const sku = r.product?.sku ? ` (${r.product.sku})` : "";
      const where = r.warehouse?.name ? ` at ${r.warehouse.name}` : "";
      insert.mutate({
        title: isOut ? `Out of stock: ${r.product?.name ?? "Product"}` : `Low stock: ${r.product?.name ?? "Product"}`,
        body: isOut
          ? `${name}${sku}${where} has run out of stock. Restock soon to avoid missed sales.`
          : `${name}${sku}${where} is running low — ${r.quantity} unit${r.quantity === 1 ? "" : "s"} left, reorder point is ${r.reorder_point}.`,
        severity: isOut ? "error" : "warning",
        category: "inventory",
        link,
        audience_role: "inventory",
      });
    }
  }, [levels, notifs, canCreate]);
}

/* ---------- Stock ---------- */
function StockTab({ levels, onAdjust, highlightId, onHighlighted }: { levels: any[]; onAdjust: (r: any) => void; highlightId?: string | null; onHighlighted?: () => void }) {
  const { can } = useRbac();
  const canViewPrices = can("finance", "view");
  const [q, setQ] = useState("");
  const [showLow, setShowLow] = useState(false);
  const [showOOS, setShowOOS] = useState(false);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    if (!highlightId) return;
    setQ("");
    const row = rowRefs.current[highlightId];
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => onHighlighted?.(), 2200);
    return () => clearTimeout(t);
  }, [highlightId, onHighlighted]);

  const term = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    const matched = levels.filter((r: any) => {
      if (!term) return true;
      const haystack = [r.product?.name, r.product?.brand?.name, r.product?.category?.name, r.warehouse?.name]
        .filter(Boolean).join(" ");
      return fuzzyMatch(haystack, term);
    });

    const isOOS = (r: any) => r.quantity <= 0;
    const isLow = (r: any) => r.quantity > 0 && r.reorder_point > 0 && r.quantity <= r.reorder_point;

    // Filter mode: low stock only → show only low-stock rows
    if (showLow) return matched.filter(isLow);

    // Default mode: hide OOS unless toggle is on; OOS always sinks to bottom
    const visible = showOOS ? matched : matched.filter((r) => !isOOS(r));
    return [...visible].sort((a: any, b: any) => {
      const aOOS = isOOS(a) ? 1 : 0;
      const bOOS = isOOS(b) ? 1 : 0;
      return aOOS - bOOS;
    });
  }, [levels, term, showLow, showOOS]);

  const totals = useMemo(() => {
    const units = filtered.reduce((s, r: any) => s + (r.quantity || 0), 0);
    const srp = filtered.reduce((s, r: any) => s + (r.quantity || 0) * Number(r.product?.retail_price || r.product?.base_price || 0), 0);
    return { units, srp };
  }, [filtered]);

  return (
    <div className="space-y-4">
      <StockAlertBanner levels={levels} showOOS={showOOS} />
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="p-3 border-b border-border flex items-center gap-2 flex-wrap">
          <div className="relative max-w-md flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by item code, brand, item name, description, location…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border text-sm" />
          </div>
          <button
            onClick={() => { setShowLow((v) => !v); if (!showLow) setShowOOS(false); }}
            className={`h-9 px-3 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
              showLow ? "border-amber-300 bg-amber-50 text-amber-700" : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />Low stock
          </button>
          <button
            onClick={() => { setShowOOS((v) => !v); if (!showOOS) setShowLow(false); }}
            className={`h-9 px-3 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
              showOOS ? "border-rose-300 bg-rose-50 text-rose-700" : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Archive className="h-3.5 w-3.5 inline mr-1" />Out of stock
          </button>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">ITEM CODE</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">BRAND</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">ITEM NAME</th>
              <th className="text-left font-semibold px-4 py-3">DESCRIPTIONS</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">UOM</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">LOCATION</th>
              {canViewPrices && <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">SRP</th>}
              <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">QTY</th>
              <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">REORDER PT.</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={canViewPrices ? 10 : 9} className="text-center px-6 py-10 text-muted-foreground">No stock records. Add one to get started.</td></tr>
            ) : filtered.map((r) => {
              const qtyColor = r.quantity <= 0 ? "text-rose-600 font-bold" : r.quantity <= r.reorder_point ? "text-amber-600 font-semibold" : "font-semibold";
              const uom = (r.product?.specs as any)?.uom ?? "—";
              return (
                <tr
                  key={r.id}
                  ref={(el) => { rowRefs.current[r.id] = el; }}
                  onClick={() => onAdjust(r)}
                  className={`border-t border-border hover:bg-secondary/40 transition-colors duration-700 cursor-pointer ${highlightId === r.id ? "bg-amber-100/70" : ""}`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-muted-foreground whitespace-nowrap">{r.product?.sku ?? "—"}</td>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{r.product?.brand?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{r.product?.category?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 max-w-[260px] truncate" title={r.product?.description ?? ""}>{r.product?.description ?? r.product?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{uom}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{r.warehouse?.name ?? "—"}</td>
                  {canViewPrices && <td className="px-4 py-2.5 text-right whitespace-nowrap">{r.product?.retail_price || r.product?.base_price ? peso(Number(r.product?.retail_price || r.product?.base_price)) : "—"}</td>}
                  <td className={`px-4 py-2.5 text-right whitespace-nowrap ${qtyColor}`}>{r.quantity}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">{r.reorder_point || "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => onAdjust(r)} className="text-xs font-semibold text-primary hover:underline whitespace-nowrap">Stock In/Out</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-secondary/40 border-t-2 border-border">
              <tr>
                <td className="px-4 py-3 font-bold text-xs uppercase" colSpan={canViewPrices ? 7 : 6}>TOTAL</td>
                <td className="px-4 py-3 text-right font-bold">{totals.units.toLocaleString()}</td>
                {canViewPrices
                  ? <td className="px-4 py-3 text-right text-xs text-muted-foreground">SRP Value: {peso(totals.srp)}</td>
                  : <td className="px-4 py-3"></td>
                }
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Adjust Dialog (Stock In / Stock Out — Excel-aligned) ---------- */
function AdjustDialog({ row, onClose }: { row: any | null; onClose: () => void }) {
  const [qty, setQty] = useState(0);
  const [type, setType] = useState<"in" | "out" | "adjustment">("in");
  const [refNum, setRefNum] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [deliveredBy, setDeliveredBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const qc = useQueryClient();

  async function submit() {
    if (!row || !qty) return;
    try {
      const delta = type === "out" ? -Math.abs(qty) : Math.abs(qty);
      const newQty = type === "adjustment" ? row.quantity + qty : row.quantity + delta;
      const { error: e1 } = await supabase.from("inventory_levels").update({ quantity: newQty }).eq("id", row.id);
      if (e1) throw e1;
      const { data: u } = await supabase.auth.getUser();
      const { error: e2 } = await (supabase as any).from("stock_movements").insert({
        product_id: row.product_id, variant_id: row.variant_id ?? null, warehouse_id: row.warehouse_id,
        movement_type: type === "in" ? "purchase" : type === "out" ? "sale" : "adjustment",
        quantity: type === "adjustment" ? qty : delta,
        notes: remarks || null,
        reference_number: refNum || null,
        prepared_by: preparedBy || null,
        delivered_by: deliveredBy || null,
        received_by: receivedBy || null,
        created_by: u.user?.id ?? null,
      });
      if (e2) throw e2;
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success(`${type === "in" ? "STOCK IN" : type === "out" ? "STOCK OUT" : "Adjustment"} recorded`);
      onClose();
      setQty(0); setRefNum(""); setPreparedBy(""); setDeliveredBy(""); setReceivedBy(""); setRemarks("");
    } catch (e: any) { toast.error(e.message); }
  }

  const uom = (row?.product?.specs as any)?.uom ?? "";

  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Stock Movement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Product info header — mirrors Excel row */}
          <div className="rounded-xl bg-secondary/50 p-3 text-xs space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-semibold text-muted-foreground">{row?.product?.sku}</span>
              <span className="font-semibold">{row?.product?.brand?.name}</span>
              <span className="text-muted-foreground">·</span>
              <span>{row?.product?.category?.name}</span>
            </div>
            <div className="text-muted-foreground">{row?.product?.description ?? row?.product?.name}</div>
            <div className="flex items-center gap-3 mt-1">
              <span>Location: <span className="font-semibold">{row?.warehouse?.name}</span></span>
              <span>Current QTY: <span className={`font-bold ${(row?.quantity ?? 0) <= 0 ? "text-rose-600" : ""}`}>{row?.quantity}</span></span>
              {uom && <span>UOM: <span className="font-semibold">{uom}</span></span>}
            </div>
          </div>

          {/* Movement type — STOCK IN / STOCK OUT / ADJUSTMENT */}
          <Field label="Movement Type">
            <div className="grid grid-cols-3 gap-2">
              {(["in", "out", "adjustment"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`h-9 rounded-lg text-xs font-bold border transition ${type === t ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}>
                  {t === "in" ? "STOCK IN" : t === "out" ? "STOCK OUT" : "ADJUSTMENT"}
                </button>
              ))}
            </div>
          </Field>

          <Field label={`QTY ${uom ? `(${uom})` : ""}`}>
            <input type="number" min={0} value={qty} onChange={(e) => setQty(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-border" />
          </Field>

          <Field label="Reference #">
            <input value={refNum} onChange={(e) => setRefNum(e.target.value)}
              placeholder="DR#, PO#, SO# etc."
              className="w-full h-10 px-3 rounded-lg border border-border" />
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field label="Prepared By">
              <input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border" />
            </Field>
            <Field label="Delivered By">
              <input value={deliveredBy} onChange={(e) => setDeliveredBy(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border" />
            </Field>
            <Field label="Received By">
              <input value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border" />
            </Field>
          </div>

          <Field label="Remarks">
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border" />
          </Field>

          <button onClick={submit} disabled={!qty}
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
            {type === "in" ? "STOCK IN" : type === "out" ? "STOCK OUT" : "APPLY ADJUSTMENT"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- New Stock Record — Excel WHSE BEGINNING format ---------- */
function NewStockDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: products = [] } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [reorder, setReorder] = useState(0);
  const ins = useInsert("inventory_levels");

  const selectedProduct = (products as any[]).find((p) => p.id === productId);
  const uom = (selectedProduct?.specs as any)?.uom ?? "";

  function reset() {
    setProductId(""); setWarehouseId(""); setQuantity(0); setReorder(0);
  }

  async function submit() {
    if (!productId || !warehouseId) return toast.error("Piliin ang ITEM CODE at LOCATION");
    await ins.mutateAsync({ product_id: productId, warehouse_id: warehouseId, quantity, reorder_point: reorder });
    toast.success("Stock record created"); onClose(); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Stock Record</DialogTitle></DialogHeader>
        <div className="space-y-3">

          {/* ITEM CODE — searchable product picker */}
          <Field label="ITEM CODE *">
            <select value={productId} onChange={(e) => setProductId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">
              <option value="">— Select Item Code —</option>
              {(products as any[]).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} — {p.brand?.name ?? ""} {p.category?.name ?? ""} {p.description ?? ""}
                </option>
              ))}
            </select>
          </Field>

          {/* Show product info once selected — mirrors Excel row */}
          {selectedProduct && (
            <div className="rounded-xl bg-secondary/50 px-3 py-2 text-xs space-y-0.5">
              <div className="flex gap-2 flex-wrap">
                <span className="font-bold text-primary">{selectedProduct.brand?.name}</span>
                <span>·</span>
                <span>{selectedProduct.category?.name}</span>
                {uom && <><span>·</span><span className="font-semibold">{uom}</span></>}
              </div>
              <div className="text-muted-foreground">{selectedProduct.description ?? selectedProduct.name}</div>
            </div>
          )}

          {/* LOCATION */}
          <Field label="LOCATION (Rack / Warehouse) *">
            <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">
              <option value="">— Select Location —</option>
              {(warehouses as any[]).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </Field>

          {/* WHSE BEGINNING + Reorder */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={`WHSE BEGINNING${uom ? ` (${uom})` : ""}`}>
              <input type="number" min={0} value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
            </Field>
            <Field label="REORDER POINT">
              <input type="number" min={0} value={reorder}
                onChange={(e) => setReorder(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
            </Field>
          </div>

          <button onClick={submit} disabled={!productId || !warehouseId}
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
            Add to Inventory
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Movements — Excel IN/OUT sheet format ---------- */
const MOVEMENT_LABEL: Record<string, string> = {
  purchase: "STOCK IN",
  sale: "STOCK OUT",
  adjustment: "ADJUSTMENT",
  transfer_in: "TRANSFER IN",
  transfer_out: "TRANSFER OUT",
  return: "RETURN",
};

function MovementsTab() {
  const { data: movs = [] } = useStockMovements();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const filtered = movs.filter((m: any) => {
    if (!term) return true;
    const productHaystack = [m.product?.name, m.product?.brand?.name, m.product?.category?.name]
      .filter(Boolean).join(" ");
    return (
      fuzzyMatch(productHaystack, term) ||
      (m.reference_number ?? "").toLowerCase().includes(term) ||
      (m.prepared_by ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search by code, brand, ref#, prepared by…"
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-border text-sm" />
      </div>
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">DATE</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">MOVEMENT TYPE</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">ITEM CODE</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">BRAND</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">ITEM NAME</th>
              <th className="text-left font-semibold px-4 py-3">DESCRIPTIONS</th>
              <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">QTY</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">STOCK FROM</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">REFERENCE #</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">PREPARED BY</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">DELIVERED BY</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">RECEIVED BY</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={13} className="text-center px-6 py-10 text-muted-foreground">No movements yet.</td></tr>
            ) : filtered.map((m: any) => {
              const label = MOVEMENT_LABEL[m.movement_type] ?? m.movement_type?.toUpperCase();
              const isIn = m.quantity > 0;
              return (
                <tr key={m.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString("en-PH")}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isIn ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-muted-foreground whitespace-nowrap">{m.product?.sku ?? "—"}</td>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{m.product?.brand?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{m.product?.category?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 max-w-[200px] truncate text-muted-foreground">{m.product?.name ?? "—"}</td>
                  <td className={`px-4 py-2.5 text-right font-bold whitespace-nowrap ${isIn ? "text-emerald-700" : "text-rose-600"}`}>
                    {isIn ? "+" : ""}{m.quantity}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{m.warehouse?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap">{(m as any).reference_number ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap">{(m as any).prepared_by ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap">{(m as any).delivered_by ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap">{(m as any).received_by ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{m.notes ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
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
              <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
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
              <tr key={s.id} onClick={() => { setEditing(s); setOpen(true); }} className="border-t border-border hover:bg-secondary/40 cursor-pointer">
                <td className="px-6 py-3 font-medium">{s.name}</td>
                <td className="px-6 py-3">{s.contact_person}</td>
                <td className="px-6 py-3 text-muted-foreground">{s.email}</td>
                <td className="px-6 py-3 text-muted-foreground">{s.phone}</td>
                <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
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
