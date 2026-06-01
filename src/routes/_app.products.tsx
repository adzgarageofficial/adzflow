import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, CATALOG_NAV } from "@/components/sub-nav";
import { useProducts, useBrands, useCategories, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { useMemo, useState } from "react";
import { Search, Plus, Package, Tag, Layers, Sparkles, Pencil, Trash2, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({ component: Products });

type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  brand_id: string | null;
  category_id: string | null;
  base_price: number;
  cost_price: number;
  retail_price: number | null;
  wholesale_price: number | null;
  reseller_price: number | null;
  status: "active" | "draft" | "archived";
  is_service: boolean;
  image_url: string | null;
  tags: string[] | null;
  brand?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  archived: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

function Products() {
  const { data: products = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const insert = useInsert<Product>("products");
  const update = useUpdate<Product>("products");
  const del = useDelete("products");
  const canEdit = useIsOwner();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "draft" | "archived" | "services">("all");
  const [brand, setBrand] = useState("All");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const filtered = useMemo(() => {
    return (products as Product[]).filter((p) => {
      if (tab === "active" && p.status !== "active") return false;
      if (tab === "draft" && p.status !== "draft") return false;
      if (tab === "archived" && p.status !== "archived") return false;
      if (tab === "services" && !p.is_service) return false;
      if (brand !== "All" && p.brand?.name !== brand) return false;
      if (category !== "All" && p.category?.name !== category) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!p.name.toLowerCase().includes(s) && !p.sku.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [products, tab, brand, category, q]);

  const stats = {
    total: products.length,
    active: (products as Product[]).filter((p) => p.status === "active").length,
    draft: (products as Product[]).filter((p) => p.status === "draft").length,
    services: (products as Product[]).filter((p) => p.is_service).length,
    brands: new Set((products as Product[]).map((p) => p.brand?.name).filter(Boolean)).size,
  };

  return (
    <PageShell title="Products" subtitle="Catalog & product information management — identity, pricing, media.">
      <SubNav items={CATALOG_NAV} label="Catalog" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Products", value: stats.total, icon: Package },
          { label: "Active", value: stats.active, icon: Sparkles },
          { label: "Drafts", value: stats.draft, icon: Pencil },
          { label: "Services", value: stats.services, icon: Wrench },
          { label: "Brands", value: stats.brands, icon: Tag },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or SKU…"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Select value={brand} onChange={setBrand} options={["All", ...brands.map((b: any) => b.name)]} icon={<Tag className="h-3.5 w-3.5" />} />
          <Select value={category} onChange={setCategory} options={["All", ...categories.map((c: any) => c.name)]} icon={<Layers className="h-3.5 w-3.5" />} />
          <button
            onClick={() => setEditing({ status: "active", is_service: false })}
            className="ml-auto h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft inline-flex items-center gap-1.5 hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> New Product
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-1">
            {(["all", "active", "draft", "archived", "services"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-8 px-3 rounded-full text-xs font-semibold capitalize transition ${
                  tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"
                }`}
              >{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            <button onClick={() => setView("grid")} className={`h-7 px-2.5 rounded-lg text-xs font-medium ${view === "grid" ? "bg-secondary" : "text-muted-foreground"}`}>Grid</button>
            <button onClick={() => setView("table")} className={`h-7 px-2.5 rounded-lg text-xs font-medium ${view === "table" ? "bg-secondary" : "text-muted-foreground"}`}>Table</button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft p-10 text-center text-sm text-muted-foreground">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft p-12 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No products yet</p>
          <p className="text-xs text-muted-foreground">Click <strong>New Product</strong> to add your first item.</p>
        </div>
      ) : view === "grid" ? (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -3 }}
                className="group rounded-2xl bg-card border border-border shadow-soft p-4 cursor-pointer"
                onClick={() => setEditing(p)}
              >
                <div className="relative h-32 rounded-xl bg-gradient-surface border border-border grid place-items-center overflow-hidden">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <Package className="h-10 w-10 text-muted-foreground" />}
                  <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ring-1 ${statusStyles[p.status]}`}>{p.status}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{p.brand?.name ?? "—"} • {p.sku}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold">{peso(Number(p.retail_price ?? p.base_price))}</span>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">{p.category?.name ?? ""}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3">{p.brand?.name ?? "—"}</td>
                  <td className="px-4 py-3">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold">{peso(Number(p.retail_price ?? p.base_price))}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ring-1 ${statusStyles[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) del.mutate(p.id, { onSuccess: () => toast.success("Deleted") }); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductDialog
        editing={editing}
        brands={brands as any[]}
        categories={categories as any[]}
        onClose={() => setEditing(null)}
        busy={insert.isPending || update.isPending}
        onSave={(row) => {
          // Clean up: omit join shapes
          const { brand, category, ...rest } = row as any;
          if (rest.id) {
            update.mutate(
              { id: rest.id, patch: rest },
              { onSuccess: () => { toast.success("Product updated"); setEditing(null); } },
            );
          } else {
            insert.mutate(rest, { onSuccess: () => { toast.success("Product added"); setEditing(null); } });
          }
        }}
      />
    </PageShell>
  );
}

function Select({ value, onChange, options, icon }: { value: string; onChange: (v: string) => void; options: string[]; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`h-10 ${icon ? "pl-7" : "pl-3"} pr-7 rounded-xl bg-secondary/60 border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-ring`}>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}

function ProductDialog({
  editing, onClose, onSave, busy, brands, categories,
}: {
  editing: Partial<Product> | null;
  onClose: () => void;
  onSave: (row: Partial<Product>) => void;
  busy: boolean;
  brands: any[];
  categories: any[];
}) {
  const [form, setForm] = useState<Partial<Product>>({});
  if (editing && (form.id ?? undefined) !== (editing.id ?? undefined)) {
    setForm(editing);
  }

  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing?.id ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" required full>
            <input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" placeholder="Synthetic Oil 5W-30 (1L)" />
          </Field>
          <Field label="SKU" required>
            <input value={form.sku ?? ""} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm font-mono" placeholder="OIL-5W30-1L" />
          </Field>
          <Field label="Status">
            <select value={form.status ?? "active"} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Brand">
            <select value={form.brand_id ?? ""} onChange={(e) => setForm({ ...form, brand_id: e.target.value || null })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm">
              <option value="">—</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm">
              <option value="">—</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Cost Price">
            <input type="number" step="0.01" value={form.cost_price ?? 0} onChange={(e) => setForm({ ...form, cost_price: Number(e.target.value) })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" />
          </Field>
          <Field label="Base Price" required>
            <input type="number" step="0.01" value={form.base_price ?? 0} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" />
          </Field>
          <Field label="Retail Price">
            <input type="number" step="0.01" value={form.retail_price ?? ""} onChange={(e) => setForm({ ...form, retail_price: e.target.value ? Number(e.target.value) : null })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" />
          </Field>
          <Field label="Wholesale Price">
            <input type="number" step="0.01" value={form.wholesale_price ?? ""} onChange={(e) => setForm({ ...form, wholesale_price: e.target.value ? Number(e.target.value) : null })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" />
          </Field>
          <Field label="Image URL" full>
            <input value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" placeholder="https://…" />
          </Field>
          <Field label="Description" full>
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" />
          </Field>
          <label className="col-span-2 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.is_service} onChange={(e) => setForm({ ...form, is_service: e.target.checked })} className="h-4 w-4 accent-foreground" />
            This is a service (no inventory)
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={busy || !form.name || !form.sku} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}