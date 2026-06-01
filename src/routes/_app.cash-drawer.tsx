import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Plus, LockKeyhole, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCashDrawerSessions, useBranches, useInsert, useUpdate, peso } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/cash-drawer")({ component: CashDrawerPage });

function CashDrawerPage() {
  const { data: sessions = [], isLoading } = useCashDrawerSessions();
  const { data: branches = [] } = useBranches();
  const insert = useInsert<any>("cash_drawer_sessions");
  const update = useUpdate<any>("cash_drawer_sessions");
  const qc = useQueryClient();
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState<any | null>(null);

  const openSession = sessions.find((s: any) => s.status === "open");

  const handleOpen = async (data: { opening_balance: number; branch_id: string }) => {
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      await new Promise((resolve, reject) =>
        insert.mutate(
          {
            session_number: `CDR-${Date.now().toString().slice(-6)}`,
            cashier_id: u.user!.id,
            branch_id: data.branch_id || null,
            opening_balance: data.opening_balance,
            status: "open",
            opened_at: new Date().toISOString(),
          },
          { onSuccess: resolve, onError: reject },
        ),
      );
      toast.success("Cash drawer opened");
      setOpening(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleClose = async (closing_balance: number, notes: string) => {
    if (!closing) return;
    try {
      // Compute cash sales from orders during session
      const { data: pays = [] } = await supabase
        .from("order_payments")
        .select("amount")
        .eq("method", "cash")
        .gte("paid_at", closing.opened_at);
      const cash_sales = ((pays as any[]) ?? []).reduce((s, p) => s + Number(p.amount), 0);
      const expected_cash = Number(closing.opening_balance) + cash_sales;
      const variance = closing_balance - expected_cash;
      await new Promise((resolve, reject) =>
        update.mutate(
          {
            id: closing.id,
            patch: {
              status: "closed",
              closed_at: new Date().toISOString(),
              closing_balance,
              cash_sales,
              expected_cash,
              variance,
              notes,
            },
          },
          { onSuccess: resolve, onError: reject },
        ),
      );
      qc.invalidateQueries({ queryKey: ["cash_drawer_sessions"] });
      toast.success(`Drawer closed. Variance: ${peso(variance)}`);
      setClosing(null);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <PageShell
      title="Cash Drawer"
      subtitle="Shift cash drawer sessions ng cashier."
      actions={
        openSession ? (
          <button onClick={() => setClosing(openSession)} className="h-10 px-4 rounded-xl bg-amber-600 text-white text-sm font-semibold inline-flex items-center gap-1.5 shadow-soft">
            <LockKeyhole className="h-4 w-4" /> Close Drawer
          </button>
        ) : (
          <button onClick={() => setOpening(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
            <Plus className="h-4 w-4" /> Open Drawer
          </button>
        )
      }
    >
      {openSession && (
        <div className="mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 grid place-items-center"><Wallet className="h-5 w-5 text-amber-500" /></div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Open Session: {openSession.session_number}</div>
            <div className="text-xs text-muted-foreground">Opened {new Date(openSession.opened_at).toLocaleString()} · Opening balance {peso(Number(openSession.opening_balance))}</div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-6 py-3">Session</th>
              <th className="text-left font-medium px-6 py-3">Branch</th>
              <th className="text-right font-medium px-6 py-3">Opening</th>
              <th className="text-right font-medium px-6 py-3">Cash Sales</th>
              <th className="text-right font-medium px-6 py-3">Closing</th>
              <th className="text-right font-medium px-6 py-3">Variance</th>
              <th className="text-left font-medium px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (sessions as any[]).length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Wala pang sessions. Mag-open ng drawer.</td></tr>
            ) : (
              (sessions as any[]).map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{s.session_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.opened_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{s.branch?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">{peso(Number(s.opening_balance))}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">{peso(Number(s.cash_sales))}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">{s.closing_balance != null ? peso(Number(s.closing_balance)) : "—"}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">
                    {s.status === "closed" ? (
                      <span className={`inline-flex items-center gap-1 ${Number(s.variance) < 0 ? "text-rose-500" : Number(s.variance) > 0 ? "text-emerald-500" : ""}`}>
                        {Number(s.variance) < 0 ? <TrendingDown className="h-3 w-3" /> : Number(s.variance) > 0 ? <TrendingUp className="h-3 w-3" /> : null}
                        {peso(Number(s.variance))}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.status === "open" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <OpenDialog open={opening} branches={branches as any[]} onClose={() => setOpening(false)} onSave={handleOpen} />
      <CloseDialog session={closing} onClose={() => setClosing(null)} onSave={handleClose} />
    </PageShell>
  );
}

function OpenDialog({ open, branches, onClose, onSave }: any) {
  const [opening_balance, setOpening] = useState(1000);
  const [branch_id, setBranch] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Open Cash Drawer</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Branch</span>
            <select className="input mt-1" value={branch_id} onChange={(e) => setBranch(e.target.value)}>
              <option value="">—</option>
              {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Opening Balance (₱)</span>
            <input type="number" className="input mt-1" value={opening_balance} onChange={(e) => setOpening(Number(e.target.value))} />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={() => onSave({ opening_balance, branch_id })} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Open</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CloseDialog({ session, onClose, onSave }: any) {
  const [closing_balance, setClosing] = useState(0);
  const [notes, setNotes] = useState("");
  if (!session) return null;
  return (
    <Dialog open={!!session} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Close {session.session_number}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">Opening balance: <span className="font-mono font-semibold">{peso(Number(session.opening_balance))}</span></div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Counted Cash in Drawer (₱)</span>
            <input type="number" className="input mt-1" value={closing_balance} onChange={(e) => setClosing(Number(e.target.value))} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Notes</span>
            <textarea className="input mt-1 min-h-[60px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={() => onSave(closing_balance, notes)} className="h-9 px-4 rounded-lg bg-amber-600 text-white text-sm font-semibold">Close Drawer</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}