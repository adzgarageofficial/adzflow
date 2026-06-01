import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, ENGAGEMENT_NAV } from "@/components/sub-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Plus, Phone, Mail, MapPin, Calendar, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCustomerInteractions, useCustomers, useInsert } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/crm")({ component: CrmPage });

const TYPE_ICON: Record<string, any> = {
  call: Phone,
  email: Mail,
  visit: MapPin,
  sms: MessageSquare,
  chat: MessageSquare,
  meeting: Calendar,
  complaint: AlertCircle,
  followup: Calendar,
};

const TYPE_COLOR: Record<string, string> = {
  call: "bg-blue-500/10 text-blue-500",
  email: "bg-violet-500/10 text-violet-500",
  visit: "bg-emerald-500/10 text-emerald-500",
  sms: "bg-cyan-500/10 text-cyan-500",
  chat: "bg-cyan-500/10 text-cyan-500",
  meeting: "bg-amber-500/10 text-amber-500",
  complaint: "bg-rose-500/10 text-rose-500",
  followup: "bg-orange-500/10 text-orange-500",
};

function CrmPage() {
  const { data: interactions = [], isLoading } = useCustomerInteractions();
  const { data: customers = [] } = useCustomers();
  const insert = useInsert<any>("customer_interactions");
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return interactions as any[];
    if (filter === "followup") {
      const now = new Date();
      return (interactions as any[]).filter((i) => i.followup_at && new Date(i.followup_at) >= now);
    }
    return (interactions as any[]).filter((i) => i.type === filter);
  }, [interactions, filter]);

  const submit = async (form: any) => {
    try {
      const { data: u } = await supabase.auth.getUser();
      await new Promise((res, rej) =>
        insert.mutate(
          {
            customer_id: form.customer_id,
            type: form.type,
            channel: form.channel || null,
            subject: form.subject,
            body: form.body || null,
            outcome: form.outcome || null,
            followup_at: form.followup_at || null,
            created_by: u.user?.id,
            assigned_to: u.user?.id,
          },
          { onSuccess: res, onError: rej },
        ),
      );
      toast.success("Interaction logged");
      setCreating(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const types = ["all", "followup", "call", "visit", "email", "sms", "meeting", "complaint"];

  return (
    <PageShell
      title="CRM Interactions"
      subtitle="Log calls, visits, and follow-ups with customers."
      actions={
        <button onClick={() =>
      setCreating(true)} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-glow">
          <Plus className="h-4 w-4" /> Log Interaction
        </button>
      }
    >
      <SubNav items={ENGAGEMENT_NAV} label="Engagement" />
      <div className="flex flex-wrap gap-2 mb-5">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`h-8 px-3 rounded-full text-xs font-semibold capitalize ${filter === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-14 text-center text-muted-foreground">Walang interactions pa.</div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((i: any) => {
              const Icon = TYPE_ICON[i.type] ?? MessageSquare;
              return (
                <li key={i.id} className="p-5 hover:bg-secondary/40 transition">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${TYPE_COLOR[i.type] ?? "bg-secondary"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{i.subject}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {i.customer?.full_name ?? "—"} {i.channel && <>· <span className="capitalize">{i.channel}</span></>}
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground shrink-0">
                          {new Date(i.created_at).toLocaleString()}
                        </div>
                      </div>
                      {i.body && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{i.body}</p>}
                      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                        {i.outcome && <span><b>Outcome:</b> {i.outcome}</span>}
                        {i.followup_at && (
                          <span className="text-orange-500 font-medium">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Follow up: {new Date(i.followup_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <LogDialog open={creating} customers={customers as any[]} onClose={() => setCreating(false)} onSave={submit} />
    </PageShell>
  );
}

function LogDialog({ open, customers, onClose, onSave }: any) {
  const [form, setForm] = useState<any>({
    customer_id: "", type: "call", channel: "", subject: "", body: "", outcome: "", followup_at: "",
  });
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Log Customer Interaction</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Customer *</span>
            <select className="input mt-1" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
              <option value="">—</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Type *</span>
              <select className="input mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {["call","visit","email","sms","chat","meeting","complaint","followup"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Channel</span>
              <input className="input mt-1" placeholder="Facebook, walk-in, etc." value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Subject *</span>
            <input className="input mt-1" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Details</span>
            <textarea className="input mt-1 min-h-[80px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Outcome</span>
              <input className="input mt-1" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Follow-up</span>
              <input type="datetime-local" className="input mt-1" value={form.followup_at} onChange={(e) => setForm({ ...form, followup_at: e.target.value })} />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button disabled={!form.customer_id || !form.subject} onClick={() => onSave(form)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}