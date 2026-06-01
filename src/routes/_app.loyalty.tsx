import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, ENGAGEMENT_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Plus, Award, TrendingUp, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useLoyaltyTiers,
  useLoyaltyTransactions,
  useCustomers,
  useInsert,
  useUpdate,
  peso,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/loyalty")({ component: LoyaltyPage });

function LoyaltyPage() {
  const { data: tiers = [] } = useLoyaltyTiers();
  const { data: txns = [], isLoading } = useLoyaltyTransactions();
  const { data: customers = [] } = useCustomers();
  const insertTxn = useInsert<any>("loyalty_transactions", ["loyalty_transactions", "customers"]);
  const insertTier = useInsert<any>("loyalty_tiers");
  const updateTier = useUpdate<any>("loyalty_tiers");

  const [editingTier, setEditingTier] = useState<any | null>(null);
  const [adjusting, setAdjusting] = useState(false);

  const tierOf = (points: number) => {
    const sorted = [...(tiers as any[])].sort((a, b) => b.min_points - a.min_points);
    return sorted.find((t) => points >= t.min_points) ?? sorted[sorted.length - 1];
  };

  const stats = useMemo(() => {
    const totalPoints = (customers as any[]).reduce((s, c) => s + (c.loyalty_points || 0), 0);
    const earned = (txns as any[]).filter((t) => ["earn", "bonus"].includes(t.type)).reduce((s, t) => s + Number(t.points), 0);
    const redeemed = (txns as any[]).filter((t) => t.type === "redeem").reduce((s, t) => s + Math.abs(Number(t.points)), 0);
    return { totalPoints, earned, redeemed, members: (customers as any[]).length };
  }, [customers, txns]);

  const saveTier = async (form: any) => {
    try {
      const payload = {
        name: form.name,
        min_points: Number(form.min_points || 0),
        multiplier: Number(form.multiplier || 1),
        perks: form.perks || null,
        color: form.color || "#64748b",
        is_active: form.is_active ?? true,
      };
      if (form.id) {
        await new Promise((res, rej) => updateTier.mutate({ id: form.id, patch: payload }, { onSuccess: res, onError: rej }));
      } else {
        await new Promise((res, rej) => insertTier.mutate(payload, { onSuccess: res, onError: rej }));
      }
      toast.success("Tier saved");
      setEditingTier(null);
    } catch (e: any) { toast.error(e.message); }
  };

  const submitAdjust = async (form: any) => {
    try {
      const { data: u } = await supabase.auth.getUser();
      await new Promise((res, rej) =>
        insertTxn.mutate(
          {
            customer_id: form.customer_id,
            type: form.type,
            points: Number(form.points),
            reason: form.reason || null,
            created_by: u.user?.id,
          },
          { onSuccess: res, onError: rej },
        ),
      );
      toast.success("Points adjusted");
      setAdjusting(false);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <PageShell
      title="Loyalty Program"
      subtitle="Manage tiers, points balances, and reward transactions."
      actions={
        <>
          <button onClick={() => setEditingTier({})} className="h-10 px-4 rounded-xl border border-border text-sm font-semibold inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> New Tier
          </button>
          <button onClick={() => setAdjusting(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
            <Award className="h-4 w-4" /> Adjust Points
          </button>
        </>
      }
    >
      <SubNav items={ENGAGEMENT_NAV} label="Engagement" />
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Members" value={stats.members.toLocaleString()} icon={Gift} />
        <StatCard label="Total Points" value={stats.totalPoints.toLocaleString()} icon={Award} />
        <StatCard label="Points Earned" value={stats.earned.toLocaleString()} icon={TrendingUp} tone="emerald" />
        <StatCard label="Points Redeemed" value={stats.redeemed.toLocaleString()} icon={TrendingDown} tone="rose" />
      </div>

      {/* Tiers */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Tiers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(tiers as any[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setEditingTier(t)}
              className="rounded-2xl border border-border bg-card p-4 text-left hover:shadow-glow transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />
                <span className="font-bold text-lg">{t.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">Min points</div>
              <div className="font-mono font-semibold">{Number(t.min_points).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-2">Earn multiplier</div>
              <div className="font-mono font-semibold">{Number(t.multiplier).toFixed(2)}x</div>
              {t.perks && <div className="mt-2 text-[11px] text-muted-foreground line-clamp-2">{t.perks}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Top Members</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-5 py-3">Customer</th>
                <th className="text-left font-medium px-5 py-3">Tier</th>
                <th className="text-right font-medium px-5 py-3">Points</th>
                <th className="text-right font-medium px-5 py-3">LTV</th>
              </tr>
            </thead>
            <tbody>
              {[...(customers as any[])]
                .sort((a, b) => (b.loyalty_points || 0) - (a.loyalty_points || 0))
                .slice(0, 8)
                .map((c) => {
                  const t = tierOf(c.loyalty_points || 0);
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-5 py-3 font-medium">{c.full_name}</td>
                      <td className="px-5 py-3">
                        {t && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: `${t.color}22`, color: t.color }}>
                            {t.name}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-mono">{(c.loyalty_points || 0).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right font-mono text-muted-foreground">{peso(Number(c.lifetime_value || 0))}</td>
                    </tr>
                  );
                })}
              {(customers as any[]).length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">Walang customers pa.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Recent Transactions</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground sticky top-0">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Customer</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-right font-medium px-5 py-3">Points</th>
                  <th className="text-right font-medium px-5 py-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>
                ) : (txns as any[]).length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">Walang transactions pa.</td></tr>
                ) : (
                  (txns as any[]).map((t) => (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-5 py-3">{t.customer?.full_name ?? "—"}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary capitalize">{t.type}</span>
                      </td>
                      <td className={`px-5 py-3 text-right font-mono font-semibold ${["earn","bonus","adjust"].includes(t.type) ? "text-emerald-500" : "text-rose-500"}`}>
                        {["earn","bonus","adjust"].includes(t.type) ? "+" : "-"}{Math.abs(Number(t.points)).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-muted-foreground">{Number(t.balance_after || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TierDialog tier={editingTier} onClose={() => setEditingTier(null)} onSave={saveTier} />
      <AdjustDialog
        open={adjusting}
        customers={customers as any[]}
        onClose={() => setAdjusting(false)}
        onSave={submitAdjust}
      />
    </PageShell>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: any; tone?: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone ? colors[tone] : "bg-primary/10 text-primary"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold font-mono">{value}</div>
    </div>
  );
}

function TierDialog({ tier, onClose, onSave }: any) {
  const [form, setForm] = useState<any>(tier ?? {});
  const tierKey = tier?.id ?? (tier ? "new" : null);
  const [lastKey, setLastKey] = useState<string | null>(null);
  if (tierKey !== lastKey) {
    setLastKey(tierKey);
    setForm(tier ?? {});
  }
  const open = !!tier;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{form.id ? "Edit Tier" : "New Tier"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Name *</span>
            <input className="input mt-1" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Min Points</span>
              <input type="number" className="input mt-1" value={form.min_points ?? 0} onChange={(e) => setForm({ ...form, min_points: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Earn Multiplier</span>
              <input type="number" step="0.05" className="input mt-1" value={form.multiplier ?? 1} onChange={(e) => setForm({ ...form, multiplier: e.target.value })} />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Color</span>
            <input type="color" className="input mt-1 h-10" value={form.color || "#64748b"} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Perks</span>
            <textarea className="input mt-1 min-h-[60px]" value={form.perks || ""} onChange={(e) => setForm({ ...form, perks: e.target.value })} />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={!form.name} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdjustDialog({ open, customers, onClose, onSave }: any) {
  const [form, setForm] = useState<any>({ customer_id: "", type: "earn", points: 0, reason: "" });
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Adjust Points</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Customer *</span>
            <select className="input mt-1" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
              <option value="">—</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name} ({c.loyalty_points || 0} pts)</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Type *</span>
              <select className="input mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="earn">Earn</option>
                <option value="bonus">Bonus</option>
                <option value="redeem">Redeem</option>
                <option value="adjust">Adjust</option>
                <option value="expire">Expire</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Points *</span>
              <input type="number" className="input mt-1" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Reason</span>
            <textarea className="input mt-1 min-h-[60px]" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={!form.customer_id || !form.points} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Submit</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}