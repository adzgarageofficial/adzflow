import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useList, useInsert, useUpdate, useDelete, peso } from "@/lib/db";
import { useRbac } from "@/lib/rbac";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldOff,
  Plus,
  Edit2,
  Trash2,
  Search,
  Power,
  PowerOff,
  ImageIcon,
  X,
  Tag,
} from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/promos")({ component: PromosPage });

type Promo = {
  id: string;
  name: string;
  description: string | null;
  original_price: number;
  promo_price: number;
  image_url: string | null;
  inclusions: string[];
  is_active: boolean;
  created_at: string;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  original_price: 0,
  promo_price: 0,
  image_url: null as string | null,
  inclusions: [] as string[],
  is_active: true,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function PromosPage() {
  const { can } = useRbac();
  const { data: promos = [], isLoading } = useList<Promo>("promos", {
    order: { column: "created_at", ascending: false },
  });

  const ins = useInsert<Promo>("promos");
  const upd = useUpdate<Promo>("promos");
  const del = useDelete("promos");

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, inclusions: [] as string[] });
  const [confirmDel, setConfirmDel] = useState<Promo | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return promos;
    return promos.filter((p) =>
      [p.name, p.description]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(s)),
    );
  }, [promos, q]);

  const activeCount = promos.filter((p) => p.is_active).length;
  const avgSavings =
    promos.length > 0
      ? promos.reduce((acc, p) => acc + (p.original_price - p.promo_price), 0) /
        promos.length
      : 0;

  if (!can("promos", "view")) {
    return (
      <PageShell title="Promotions" subtitle="Access restricted">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <ShieldOff className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="mt-3 font-semibold">You don't have access to this module.</p>
        </div>
      </PageShell>
    );
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, inclusions: [] });
    setOpen(true);
  }

  function openEdit(p: Promo) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      original_price: p.original_price,
      promo_price: p.promo_price,
      image_url: p.image_url,
      inclusions: [...p.inclusions],
      is_active: p.is_active,
    });
    setOpen(true);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("promo-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage
        .from("promo-images")
        .getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return toast.error("Promo name is required");
    if (form.original_price <= 0) return toast.error("Original price must be greater than 0");
    if (form.promo_price <= 0) return toast.error("Promo price must be greater than 0");
    if (form.promo_price >= form.original_price)
      return toast.error("Promo price must be lower than original price");

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      original_price: form.original_price,
      promo_price: form.promo_price,
      image_url: form.image_url || null,
      inclusions: form.inclusions.filter((i) => i.trim()),
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await upd.mutateAsync({ id: editing.id, patch: payload });
        toast.success("Promo updated");
      } else {
        await ins.mutateAsync(payload);
        toast.success("Promo created");
      }
      setOpen(false);
    } catch {
      // error already toasted by the mutation
    }
  }

  async function handleToggle(p: Promo) {
    try {
      await upd.mutateAsync({ id: p.id, patch: { is_active: !p.is_active } });
      toast.success(p.is_active ? "Promo deactivated" : "Promo activated");
    } catch {
      // handled
    }
  }

  async function handleDelete() {
    if (!confirmDel) return;
    try {
      await del.mutateAsync(confirmDel.id);
      toast.success("Promo deleted");
      setConfirmDel(null);
    } catch {
      // handled
    }
  }

  function addInclusion() {
    setForm((f) => ({ ...f, inclusions: [...f.inclusions, ""] }));
  }

  function setInclusion(i: number, val: string) {
    setForm((f) => {
      const next = [...f.inclusions];
      next[i] = val;
      return { ...f, inclusions: next };
    });
  }

  function removeInclusion(i: number) {
    setForm((f) => ({
      ...f,
      inclusions: f.inclusions.filter((_, idx) => idx !== i),
    }));
  }

  const saving = ins.isPending || upd.isPending;
  const savingsAmt =
    form.original_price > 0 &&
    form.promo_price > 0 &&
    form.promo_price < form.original_price
      ? form.original_price - form.promo_price
      : 0;

  return (
    <PageShell
      title="Promotions"
      subtitle="Manage promo packages and special offers."
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Promos", value: promos.length, color: "text-blue-600" },
          { label: "Active", value: activeCount, color: "text-emerald-600" },
          {
            label: "Inactive",
            value: promos.length - activeCount,
            color: "text-amber-600",
          },
          {
            label: "Avg. Savings",
            value: peso(avgSavings),
            color: "text-rose-600",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {c.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 h-10 flex-1 max-w-md rounded-xl border border-border bg-white px-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search promos…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        {can("promos", "create") && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" /> New Promo
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5 w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Promo Price</TableHead>
              <TableHead>Savings</TableHead>
              <TableHead>Inclusions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Tag className="h-8 w-8 opacity-30" />
                    <p>
                      {q
                        ? "No promos match your search."
                        : "No promos yet. Create one to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-5">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {p.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm line-through text-muted-foreground">
                    {peso(p.original_price)}
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-700">
                    {peso(p.promo_price)}
                  </TableCell>
                  <TableCell className="text-sm text-rose-600 font-medium">
                    -{peso(p.original_price - p.promo_price)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.inclusions.length === 0
                      ? "—"
                      : `${p.inclusions.length} item${p.inclusions.length !== 1 ? "s" : ""}`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border ${
                        p.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex items-center justify-end gap-1">
                      {can("promos", "edit") && (
                        <>
                          <button
                            title={p.is_active ? "Deactivate" : "Activate"}
                            onClick={() => handleToggle(p)}
                            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                              p.is_active
                                ? "hover:bg-amber-50 text-amber-600"
                                : "hover:bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {p.is_active ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            title="Edit"
                            onClick={() => openEdit(p)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {can("promos", "delete") && (
                        <button
                          title="Delete"
                          onClick={() => setConfirmDel(p)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-rose-50 text-rose-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              {editing ? "Edit Promo" : "New Promo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            <Field label="Promo Name *">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Summer Tire Package"
                className="w-full h-10 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Original Price *">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₱</span>
                  <input
                    type="number"
                    min={0}
                    value={form.original_price || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        original_price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="w-full h-10 rounded-xl border border-border bg-white pl-6 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </Field>
              <Field label="Promo Price *">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₱</span>
                  <input
                    type="number"
                    min={0}
                    value={form.promo_price || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        promo_price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="w-full h-10 rounded-xl border border-border bg-white pl-6 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </Field>
            </div>

            {savingsAmt > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                <span className="text-xs font-semibold text-emerald-700">
                  Customer saves {peso(savingsAmt)} (
                  {Math.round((savingsAmt / form.original_price) * 100)}% off)
                </span>
              </div>
            )}

            <Field label="Description">
              <textarea
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="What makes this promo special…"
                rows={3}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </Field>

            <Field label="Promo Image (optional)">
              <div className="space-y-2">
                {form.image_url && (
                  <div className="relative inline-block">
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="h-28 w-auto rounded-xl border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: null }))}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="h-4 w-4" />
                  {uploading
                    ? "Uploading…"
                    : form.image_url
                      ? "Change image"
                      : "Upload image"}
                </button>
              </div>
            </Field>

            <Field label="Inclusions">
              <div className="space-y-2">
                {form.inclusions.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    No inclusions added yet.
                  </p>
                )}
                {form.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={inc}
                      onChange={(e) => setInclusion(i, e.target.value)}
                      placeholder={`Inclusion ${i + 1}`}
                      className="flex-1 h-9 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeInclusion(i)}
                      className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-rose-50 text-rose-500 transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInclusion}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Inclusion
                </button>
              </div>
            </Field>

            <Field label="Status">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, is_active: !f.is_active }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    form.is_active
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium">
                  {form.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </Field>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving
                  ? "Saving…"
                  : editing
                    ? "Save Changes"
                    : "Create Promo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!confirmDel}
        onOpenChange={(o) => !o && setConfirmDel(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Promo</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {confirmDel?.name}
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDel(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={del.isPending}
            >
              {del.isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
