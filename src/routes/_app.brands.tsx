import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";
import { useBrands, useUpdate, computeCost, peso, useIsOwner } from "@/lib/db";
import { Percent, Plus, X, ChevronRight, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/brands")({ component: BrandsCosting });

const SAMPLE_SRP = 5000;

function BrandsCosting() {
  const isOwner = useIsOwner();
  const { data: brands = [] } = useBrands();
  const updateBrand = useUpdate("brands");
  const [editing, setEditing] = useState<any | null>(null);
  const [chain, setChain] = useState<number[]>([]);
  const [newPct, setNewPct] = useState("");

  if (!isOwner) {
    return (
      <PageShell title="Brands & Costing" subtitle="Owner access only">
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Access restricted to owner only.
        </div>
      </PageShell>
    );
  }

  function openEdit(brand: any) {
    setEditing(brand);
    setChain(Array.isArray(brand.discount_chain) ? [...brand.discount_chain] : []);
    setNewPct("");
  }

  function addStep() {
    const n = parseFloat(newPct);
    if (isNaN(n) || n <= 0 || n >= 100) {
      toast.error("Enter a valid percentage between 1 and 99");
      return;
    }
    setChain((prev) => [...prev, n]);
    setNewPct("");
  }

  function removeStep(idx: number) {
    setChain((prev) => prev.filter((_, i) => i !== idx));
  }

  async function save() {
    if (!editing) return;
    await updateBrand.mutateAsync({ id: editing.id, patch: { discount_chain: chain } });
    toast.success(`${editing.name} — discount chain saved`);
    setEditing(null);
  }

  const previewCost = computeCost(SAMPLE_SRP, chain);
  const previewMargin = SAMPLE_SRP > 0 ? ((SAMPLE_SRP - previewCost) / SAMPLE_SRP) * 100 : 0;

  return (
    <PageShell title="Brands & Costing" subtitle="Supplier discount chains per brand — owner only">
      <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          These chains define how cost is computed from SRP. Each step is a sequential
          percentage deduction — not summed, but applied one at a time.
          Example: 20%, 5%, 5% on ₱1,000 → ₱800 → ₱760 → ₱722.
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Brand</th>
              <th className="text-left font-semibold px-4 py-3">Discount Chain</th>
              <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">Net Factor</th>
              <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">Effective Margin</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center px-6 py-10 text-muted-foreground">
                  No brands found. Add brands via the Products page first.
                </td>
              </tr>
            ) : brands.map((b: any) => {
              const dc: number[] = Array.isArray(b.discount_chain) ? b.discount_chain : [];
              const netFactor = dc.reduce((f, p) => f * (1 - p / 100), 1);
              const margin = (1 - netFactor) * 100;
              return (
                <tr key={b.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-semibold">{b.name}</td>
                  <td className="px-4 py-3">
                    {dc.length === 0 ? (
                      <span className="text-muted-foreground text-xs italic">Not set</span>
                    ) : (
                      <div className="flex items-center gap-1 flex-wrap">
                        {dc.map((pct, i) => (
                          <span key={i} className="inline-flex items-center text-xs font-mono">
                            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground mx-0.5" />}
                            <span className="bg-secondary rounded px-2 py-0.5">-{pct}%</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                    {dc.length > 0 ? `${(netFactor * 100).toFixed(2)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600 text-xs">
                    {dc.length > 0 ? `${margin.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(b)}
                      className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-primary" />
              {editing?.name} — Discount Chain
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">

            {/* Steps list */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Discount Steps (applied left to right)
              </label>
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {chain.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">No steps yet.</span>
                )}
                {chain.map((pct, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-secondary rounded-lg px-3 py-1.5 text-sm font-semibold"
                  >
                    -{pct}%
                    <button
                      onClick={() => removeStep(i)}
                      className="ml-1 text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add step input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newPct}
                  onChange={(e) => setNewPct(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStep()}
                  placeholder="e.g. 20"
                  min={1}
                  max={99}
                  className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={addStep}
                  className="h-9 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Step
                </button>
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Preview — Sample SRP: {peso(SAMPLE_SRP)}
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SRP</span>
                  <span className="font-semibold">{peso(SAMPLE_SRP)}</span>
                </div>
                {chain.map((pct, i) => {
                  const before = computeCost(SAMPLE_SRP, chain.slice(0, i));
                  const after = before * (1 - pct / 100);
                  return (
                    <div key={i} className="flex justify-between text-muted-foreground">
                      <span>After -{pct}%</span>
                      <span>{peso(after)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between font-bold">
                  <span>COST</span>
                  <span>{peso(previewCost)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>MARGIN</span>
                  <span>{previewMargin.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 h-9 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={updateBrand.isPending}
                className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {updateBrand.isPending ? "Saving…" : "Save Chain"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
