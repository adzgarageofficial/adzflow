import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import logo from "@/assets/adz-logo.png";
import { useBranches, useWarehouses, useBrands, useCategories, useServices, useInsert, useDelete, useIsOwner } from "@/lib/db";
import { useState } from "react";
import { Plus, Trash2, Store, Warehouse, Tag, Layers, Wrench } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({ component: Settings });

function Settings() {
  const { data: branches = [] } = useBranches();
  const { data: warehouses = [] } = useWarehouses();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { data: services = [] } = useServices();
  const addBranch = useInsert("branches");
  const canEdit = useIsOwner();
  const delBranch = useDelete("branches");
  const addWh = useInsert("warehouses", ["warehouses"]);
  const delWh = useDelete("warehouses");
  const addBrand = useInsert("brands");
  const delBrand = useDelete("brands");
  const addCat = useInsert("categories");
  const delCat = useDelete("categories");
  const addSvc = useInsert("services");
  const delSvc = useDelete("services");

  const [newBranch, setNewBranch] = useState({ name: "", address: "", phone: "" });
  const [newWh, setNewWh] = useState({ name: "", branch_id: "" });
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [newCat, setNewCat] = useState({ name: "", slug: "" });
  const [newSvc, setNewSvc] = useState({ name: "", rate: "", duration_minutes: "60" });

  return (
    <PageShell title="Settings" subtitle="Workspace, branding, receipts, and devices.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-card border border-border shadow-soft p-6 lg:col-span-2">
          <h3 className="font-semibold tracking-tight">Workspace</h3>
          <p className="text-xs text-muted-foreground">Update store branding and details.</p>
          <div className="mt-5 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white border border-border grid place-items-center overflow-hidden shadow-soft">
              <img src={logo} alt="ADZ Garage" className="h-14 w-14 object-contain" />
            </div>
            <div>
              <p className="font-semibold">ADZ Garage</p>
              <p className="text-xs text-muted-foreground">Premium automotive POS</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {["Store Name", "Currency", "VAT %", "Receipt Footer"].map((f) => (
              <div key={f}>
                <label className="text-xs font-medium text-muted-foreground">{f}</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue={f === "Store Name" ? "ADZ Garage" : f === "Currency" ? "PHP" : f === "VAT %" ? "12" : "Thank you for your business!"} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-surface border border-border shadow-soft p-6">
          <h3 className="font-semibold tracking-tight">Keyboard Shortcuts</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["⌘K", "Quick search"],
              ["⌘N", "New sale"],
              ["⌘P", "Print receipt"],
              ["⌘B", "Toggle sidebar"],
              ["⌘D", "Open discounts"],
            ].map(([k, l]) => (
              <li key={k} className="flex items-center justify-between">
                <span className="text-muted-foreground">{l}</span>
                <kbd className="text-[11px] font-mono border border-border bg-white rounded-md px-2 py-0.5">{k}</kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Branches */}
      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold tracking-tight">Branches</h3>
          <span className="text-xs text-muted-foreground ml-1">({branches.length})</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Physical locations of your shop.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
          <input value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} placeholder="Branch name" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <input value={newBranch.address} onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })} placeholder="Address" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <input value={newBranch.phone} onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })} placeholder="Phone" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <button
            disabled={!newBranch.name || addBranch.isPending}
            onClick={() => addBranch.mutate(newBranch, { onSuccess: () => { toast.success("Branch added"); setNewBranch({ name: "", address: "", phone: "" }); } })}
            className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          ><Plus className="h-4 w-4" /> Add Branch</button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {branches.length === 0 && <p className="text-sm text-muted-foreground py-4">No branches yet.</p>}
          {(branches as any[]).map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.address ?? "—"} {b.phone ? `• ${b.phone}` : ""}</p>
              </div>
              <button onClick={() => { if (confirm(`Delete ${b.name}?`)) delBranch.mutate(b.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Warehouses */}
      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold tracking-tight">Warehouses</h3>
          <span className="text-xs text-muted-foreground ml-1">({warehouses.length})</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Stock locations linked to branches.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={newWh.name} onChange={(e) => setNewWh({ ...newWh, name: e.target.value })} placeholder="Warehouse name" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <select value={newWh.branch_id} onChange={(e) => setNewWh({ ...newWh, branch_id: e.target.value })} className="h-10 rounded-lg border border-border bg-white px-3 text-sm">
            <option value="">— Branch —</option>
            {(branches as any[]).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button
            disabled={!newWh.name || addWh.isPending}
            onClick={() => addWh.mutate({ name: newWh.name, branch_id: newWh.branch_id || null }, { onSuccess: () => { toast.success("Warehouse added"); setNewWh({ name: "", branch_id: "" }); } })}
            className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          ><Plus className="h-4 w-4" /> Add Warehouse</button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {warehouses.length === 0 && <p className="text-sm text-muted-foreground py-4">No warehouses yet.</p>}
          {(warehouses as any[]).map((w) => (
            <div key={w.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold">{w.name}</p>
                <p className="text-xs text-muted-foreground">{w.branch?.name ?? "Unassigned"}</p>
              </div>
              <button onClick={() => { if (confirm(`Delete ${w.name}?`)) delWh.mutate(w.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold tracking-tight">Brands</h3>
          <span className="text-xs text-muted-foreground ml-1">({brands.length})</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Product manufacturers and labels.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="Brand name" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <input value={newBrand.description} onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })} placeholder="Description (optional)" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <button
            disabled={!newBrand.name || addBrand.isPending}
            onClick={() => addBrand.mutate(newBrand, { onSuccess: () => { toast.success("Brand added"); setNewBrand({ name: "", description: "" }); } })}
            className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          ><Plus className="h-4 w-4" /> Add Brand</button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {brands.length === 0 && <p className="text-sm text-muted-foreground py-4">No brands yet.</p>}
          {(brands as any[]).map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.description ?? "—"}</p>
              </div>
              <button onClick={() => { if (confirm(`Delete ${b.name}?`)) delBrand.mutate(b.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold tracking-tight">Categories</h3>
          <span className="text-xs text-muted-foreground ml-1">({categories.length})</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Product groupings for navigation.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="Category name" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <input value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} placeholder="Slug (e.g. brakes)" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <button
            disabled={!newCat.name || addCat.isPending}
            onClick={() => addCat.mutate({ name: newCat.name, slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, "-") }, { onSuccess: () => { toast.success("Category added"); setNewCat({ name: "", slug: "" }); } })}
            className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          ><Plus className="h-4 w-4" /> Add Category</button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {categories.length === 0 && <p className="text-sm text-muted-foreground py-4">No categories yet.</p>}
          {(categories as any[]).map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">/{c.slug ?? "—"}</p>
              </div>
              <button onClick={() => { if (confirm(`Delete ${c.name}?`)) delCat.mutate(c.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold tracking-tight">Services</h3>
          <span className="text-xs text-muted-foreground ml-1">({services.length})</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Labor & shop services with rates.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
          <input value={newSvc.name} onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })} placeholder="Service name" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <input value={newSvc.rate} onChange={(e) => setNewSvc({ ...newSvc, rate: e.target.value })} type="number" placeholder="Rate (₱)" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <input value={newSvc.duration_minutes} onChange={(e) => setNewSvc({ ...newSvc, duration_minutes: e.target.value })} type="number" placeholder="Duration (min)" className="h-10 rounded-lg border border-border bg-white px-3 text-sm" />
          <button
            disabled={!newSvc.name || !newSvc.rate || addSvc.isPending}
            onClick={() => addSvc.mutate({ name: newSvc.name, rate: Number(newSvc.rate), duration_minutes: Number(newSvc.duration_minutes) || 60 }, { onSuccess: () => { toast.success("Service added"); setNewSvc({ name: "", rate: "", duration_minutes: "60" }); } })}
            className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          ><Plus className="h-4 w-4" /> Add Service</button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {services.length === 0 && <p className="text-sm text-muted-foreground py-4">No services yet.</p>}
          {(services as any[]).map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">₱{Number(s.rate).toLocaleString()} · {s.duration_minutes} min</p>
              </div>
              <button onClick={() => { if (confirm(`Delete ${s.name}?`)) delSvc.mutate(s.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
