import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useCustomers, useOrders, useJobOrders, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Mail, Phone, Users, Trophy, TrendingUp, Crown } from "lucide-react";
import { TableSkeleton, KpiSkeleton, QueryError } from "@/components/query-states";
import { LeaderboardPodium } from "@/components/ui/leaderboard-podium";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customers")({ component: Customers });

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  loyalty_points: number;
  lifetime_value: number;
  tags: string[] | null;
  created_at: string;
};

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-400/20 text-amber-500 border-amber-400/40",
  2: "bg-slate-400/20 text-slate-500 border-slate-400/40",
  3: "bg-orange-400/20 text-orange-500 border-orange-400/40",
};

const RANK_LABEL: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function Customers() {
  const { data: customers = [], isLoading, isError, error, refetch } = useCustomers();
  const { data: orders = [] } = useOrders();
  const { data: jobOrders = [] } = useJobOrders();
  const insert = useInsert<Customer>("customers");
  const update = useUpdate<Customer>("customers");
  const del = useDelete("customers");
  const canEdit = useIsOwner();

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Customer> | null>(null);

  // Compute actual LTV from orders + job orders per customer
  const ltvMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders as any[]) {
      if (o.customer_id) map[o.customer_id] = (map[o.customer_id] ?? 0) + Number(o.total || 0);
    }
    for (const j of jobOrders as any[]) {
      if (j.customer_id) map[j.customer_id] = (map[j.customer_id] ?? 0) + Number(j.total_cost || 0);
    }
    return map;
  }, [orders, jobOrders]);

  const enriched = useMemo(() =>
    (customers as Customer[]).map((c) => ({
      ...c,
      computed_ltv: ltvMap[c.id] ?? 0,
    })),
    [customers, ltvMap],
  );

  const top10 = useMemo(() =>
    [...enriched]
      .sort((a, b) => b.computed_ltv - a.computed_ltv)
      .slice(0, 10),
    [enriched],
  );

  const filtered = useMemo(() => {
    if (!q) return enriched;
    const s = q.toLowerCase();
    return enriched.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.phone?.toLowerCase().includes(s),
    );
  }, [enriched, q]);

  const stats = {
    total: customers.length,
    vip: enriched.filter((c) => c.computed_ltv > 50000).length,
    ltv: enriched.reduce((s, c) => s + c.computed_ltv, 0),
  };

  return (
    <PageShell title="Customers" subtitle="Your loyal community of garage owners.">
      {/* Stat cards */}
      {isError && <QueryError message={(error as Error)?.message} onRetry={refetch} />}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: stats.total, icon: Users },
          { label: "VIP (₱50k+)", value: stats.vip, icon: Crown },
          { label: "Total Lifetime Value", value: peso(stats.ltv), icon: TrendingUp },
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

      {/* Top 10 Ranking */}
      {top10.length > 0 && (() => {
        const maxLtv = top10[0]?.computed_ltv || 1;
        const podiumRankings = top10.slice(0, 3).map((c, idx) => ({
          userId: c.id,
          userName: c.full_name,
          rank: idx + 1,
          value: c.computed_ltv,
          avatarUrl: null,
        }));
        const rest = top10.slice(3);
        return (
          <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="font-semibold text-sm">Top 10 Customers by Lifetime Value</span>
              <span className="ml-auto text-[11px] text-muted-foreground">Computed from orders & job orders</span>
            </div>

            {/* Podium — top 3 */}
            <div className="py-8 px-4 flex flex-col items-center gap-1 bg-gradient-to-b from-muted/40 to-transparent">
              <LeaderboardPodium
                rankings={podiumRankings}
                showAvatar={false}
                showValue={false}
                medalStyle="modern"
                size="default"
              />
              {/* Peso values below podium in correct order: 2nd, 1st, 3rd */}
              <div className="flex items-end justify-center gap-4 w-full mt-2">
                {[
                  podiumRankings.find((r) => r.rank === 2),
                  podiumRankings.find((r) => r.rank === 1),
                  podiumRankings.find((r) => r.rank === 3),
                ].filter(Boolean).map((r) => (
                  <div key={r!.userId} className="flex flex-col items-center w-22 min-w-0">
                    <span className="text-xs font-bold text-primary truncate max-w-full text-center">{peso(r!.value)}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {top10.find((c) => c.id === r!.userId)?.loyalty_points.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard — ranks 4–10 */}
            {rest.length > 0 && (
              <div className="border-t border-border divide-y divide-border">
                {rest.map((c, idx) => {
                  const rank = idx + 4;
                  const pct = Math.round((c.computed_ltv / maxLtv) * 100);
                  const initials = c.full_name.split(" ").map((w: string) => w[0]).slice(0, 2).join("");
                  return (
                    <div key={c.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/40 transition-colors">
                      <span className="w-6 text-center text-xs font-bold text-muted-foreground shrink-0">#{rank}</span>
                      <div className="h-8 w-8 rounded-full bg-secondary text-muted-foreground grid place-items-center text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium truncate">{c.full_name}</span>
                          <span className="text-sm font-bold text-primary shrink-0">{peso(c.computed_ltv)}</span>
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                          <div className="h-full rounded-full bg-primary/40 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0 w-16 text-right">{c.loyalty_points.toLocaleString()} pts</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Search + Add */}
      <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setEditing({})}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft inline-flex items-center gap-1.5 hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> New Customer
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="mt-5"><TableSkeleton rows={6} cols={6} /></div>
      ) : (
      <div className="mt-5 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left font-medium px-6 py-3">Rank</th>
              <th className="text-left font-medium px-6 py-3">Customer</th>
              <th className="text-left font-medium px-6 py-3">Contact</th>
              <th className="text-left font-medium px-6 py-3">Loyalty</th>
              <th className="text-right font-medium px-6 py-3">Lifetime Value</th>
              <th className="px-6 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No customers yet. Click <strong>New Customer</strong> to add one.</td></tr>
            ) : (
              filtered.map((c) => {
                const globalRank = top10.findIndex((t) => t.id === c.id);
                const rank = globalRank >= 0 ? globalRank + 1 : null;
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-6 py-4 w-16">
                      {rank != null ? (
                        <div className={cn(
                          "h-7 w-7 rounded-full border grid place-items-center text-xs font-bold",
                          RANK_STYLE[rank] ?? "bg-secondary text-muted-foreground border-border",
                        )}>
                          {rank <= 3 ? RANK_LABEL[rank] : `#${rank}`}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-red text-primary-foreground grid place-items-center text-xs font-bold">
                          {c.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div>{c.full_name}</div>
                          {c.address && <div className="text-[11px] text-muted-foreground">{c.address}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {c.email && <div className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</div>}
                      {c.phone && <div className="inline-flex items-center gap-1 ml-3"><Phone className="h-3 w-3" />{c.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent text-primary border border-primary/10">
                        {c.loyalty_points} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">{peso(c.computed_ltv)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${c.full_name}?`)) del.mutate(c.id, { onSuccess: () => toast.success("Deleted") });
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                        ><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      )}

      <CustomerDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(row) => {
          if (row.id) {
            update.mutate(
              { id: row.id, patch: row },
              { onSuccess: () => { toast.success("Customer updated"); setEditing(null); } },
            );
          } else {
            insert.mutate(row, {
              onSuccess: () => { toast.success("Customer added"); setEditing(null); },
            });
          }
        }}
        busy={insert.isPending || update.isPending}
      />
    </PageShell>
  );
}

function CustomerDialog({
  editing, onClose, onSave, busy,
}: { editing: Partial<Customer> | null; onClose: () => void; onSave: (row: Partial<Customer>) => void; busy: boolean }) {
  const [form, setForm] = useState<Partial<Customer>>({});
  if (editing && form !== editing && (form.id ?? undefined) !== (editing.id ?? undefined)) {
    setForm(editing);
  }

  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing?.id ? "Edit Customer" : "New Customer"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Full Name" required>
            <input
              value={form.full_name ?? ""}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
              placeholder="Juan Dela Cruz"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"><input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" /></Field>
            <Field label="Phone"><input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" /></Field>
          </div>
          <Field label="Address"><input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" /></Field>
          <Field label="Notes"><textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" /></Field>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button
            disabled={busy || !form.full_name}
            onClick={() => onSave(form)}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
          >{busy ? "Saving…" : "Save"}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
