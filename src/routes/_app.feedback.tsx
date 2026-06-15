import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, ENGAGEMENT_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Plus, MessageCircle, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCustomerFeedback, useCustomers, useOrders, useInsert, useUpdate } from "@/lib/db";
import { CardGridSkeleton, QueryError } from "@/components/query-states";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/feedback")({ component: FeedbackPage });

const SENTIMENT_COLOR: Record<string, string> = {
  positive: "bg-emerald-500/10 text-emerald-500",
  neutral: "bg-amber-500/10 text-amber-500",
  negative: "bg-rose-500/10 text-rose-500",
};

function autoSentiment(rating: number): "positive" | "neutral" | "negative" {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}

function FeedbackPage() {
  const { data: feedback = [], isLoading, isError, error, refetch } = useCustomerFeedback();
  const { data: customers = [] } = useCustomers();
  const { data: orders = [] } = useOrders();
  const insert = useInsert<any>("customer_feedback");
  const update = useUpdate<any>("customer_feedback");
  const [creating, setCreating] = useState(false);
  const [responding, setResponding] = useState<any | null>(null);

  const stats = useMemo(() => {
    const arr = feedback as any[];
    const count = arr.length;
    const avg = count ? arr.reduce((s, f) => s + Number(f.rating), 0) / count : 0;
    const positive = arr.filter((f) => f.sentiment === "positive").length;
    const negative = arr.filter((f) => f.sentiment === "negative").length;
    return { count, avg, positive, negative };
  }, [feedback]);

  const submit = async (form: any) => {
    try {
      const rating = Number(form.rating);
      await new Promise((res, rej) =>
        insert.mutate(
          {
            customer_id: form.customer_id || null,
            order_id: form.order_id || null,
            source: form.source,
            rating,
            sentiment: autoSentiment(rating),
            comment: form.comment || null,
            is_public: !!form.is_public,
          },
          { onSuccess: res, onError: rej },
        ),
      );
      toast.success("Feedback recorded");
      setCreating(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const respond = async (text: string) => {
    if (!responding) return;
    try {
      const { data: u } = await supabase.auth.getUser();
      await new Promise((res, rej) =>
        update.mutate(
          { id: responding.id, patch: { response: text, responded_at: new Date().toISOString(), responded_by: u.user?.id } },
          { onSuccess: res, onError: rej },
        ),
      );
      toast.success("Response saved");
      setResponding(null);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <PageShell
      title="Customer Feedback"
      subtitle="Reviews, ratings, and complaint resolutions."
      actions={
        <button onClick={() =>
      setCreating(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> Add Feedback
        </button>
      }
    >
      <SubNav items={ENGAGEMENT_NAV} label="Engagement" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Reviews" value={stats.count.toLocaleString()} icon={MessageCircle} />
        <Stat label="Avg Rating" value={stats.avg.toFixed(2)} icon={Star} tone="amber" />
        <Stat label="Positive" value={stats.positive.toLocaleString()} icon={TrendingUp} tone="emerald" />
        <Stat label="Negative" value={stats.negative.toLocaleString()} icon={TrendingUp} tone="rose" />
      </div>

      {isLoading ? (
        <CardGridSkeleton count={4} cols="grid-cols-1 md:grid-cols-2" />
      ) : isError ? (
        <QueryError message={(error as Error)?.message} onRetry={refetch} />
      ) : (
      <div className="grid md:grid-cols-2 gap-5">
        {(feedback as any[]).length === 0 ? (
          <div className="col-span-2 text-center text-muted-foreground py-10">No feedback yet.</div>
        ) : (
          (feedback as any[]).map((f) => (
            <div key={f.id} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{f.customer?.full_name ?? "Anonymous"}</div>
                  <div className="text-[11px] text-muted-foreground capitalize mt-0.5">
                    {f.source.replace("_", " ")} · {new Date(f.created_at).toLocaleDateString()}
                    {f.order && <> · {f.order.order_number}</>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < f.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${SENTIMENT_COLOR[f.sentiment]}`}>
                {f.sentiment}
              </span>
              {f.comment && <p className="mt-3 text-sm">{f.comment}</p>}
              {f.response ? (
                <div className="mt-3 p-3 rounded-xl bg-secondary/60 border-l-2 border-primary">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Our response</div>
                  <p className="text-sm">{f.response}</p>
                </div>
              ) : (
                <button onClick={() => setResponding(f)} className="mt-3 text-xs font-semibold text-primary hover:underline">
                  + Respond
                </button>
              )}
            </div>
          ))
        )}
      </div>
      )}

      <NewFeedbackDialog
        open={creating}
        customers={customers as any[]}
        orders={orders as any[]}
        onClose={() => setCreating(false)}
        onSave={submit}
      />
      <RespondDialog feedback={responding} onClose={() => setResponding(null)} onSave={respond} />
    </PageShell>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: any; tone?: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
    amber: "bg-amber-500/10 text-amber-500",
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

function NewFeedbackDialog({ open, customers, orders, onClose, onSave }: any) {
  const [form, setForm] = useState<any>({ customer_id: "", order_id: "", source: "in_store", rating: 5, comment: "", is_public: false });
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Feedback</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Customer</span>
            <select className="input mt-1" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
              <option value="">Anonymous</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Related Order</span>
            <select className="input mt-1" value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })}>
              <option value="">—</option>
              {orders.slice(0, 50).map((o: any) => <option key={o.id} value={o.id}>{o.order_number}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Source</span>
              <select className="input mt-1" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                {["in_store","sms","email","web","google","facebook","other"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Rating *</span>
              <select className="input mt-1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Comment</span>
            <textarea className="input mt-1 min-h-[80px]" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} />
            Show publicly (e.g. on website)
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RespondDialog({ feedback, onClose, onSave }: any) {
  const [text, setText] = useState("");
  const open = !!feedback;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Respond to Feedback</DialogTitle></DialogHeader>
        {feedback?.comment && (
          <div className="p-3 rounded-xl bg-secondary/60 text-sm mb-3">{feedback.comment}</div>
        )}
        <textarea
          className="input min-h-[120px]"
          placeholder="Type your response…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={!text.trim()} onClick={() => onSave(text)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Send</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}