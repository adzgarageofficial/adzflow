import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";
import { Megaphone, Mail, Users, Percent, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCampaigns, useCustomers, useInsert, useUpdate, useDelete, peso, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/marketing")({ component: Marketing });

const STATUSES = ["draft", "scheduled", "active", "paused", "completed"];
const CHANNELS = ["Email", "SMS", "Facebook", "Instagram", "Google Ads", "TikTok", "Other"];
const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-blue-100 text-blue-700",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-zinc-100 text-zinc-700",
};

function Marketing() {
  const { data: campaigns = [] } = useCampaigns();
  const { data: customers = [] } = useCustomers();
  const ins = useInsert("marketing_campaigns");
  const canEdit = useIsOwner();
  const upd = useUpdate("marketing_campaigns");
  const del = useDelete("marketing_campaigns");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const active = campaigns.filter((c: any) => c.status === "active").length;
  const totalReach = campaigns.reduce((s: number, c: any) => s + (c.reach || 0), 0);
  const totalConv = campaigns.reduce((s: number, c: any) => s + (c.conversions || 0), 0);
  const avgConv = totalReach ? ((totalConv / totalReach) * 100).toFixed(1) + "%" : "0%";

  const stats = [
    { label: "Active Campaigns", value: active, icon: Megaphone },
    { label: "Customers", value: customers.length.toLocaleString(), icon: Mail },
    { label: "Total Reach", value: totalReach.toLocaleString(), icon: Users },
    { label: "Avg. Conversion", value: avgConv, icon: Percent },
  ];

  const filtered = campaigns.filter((c: any) =>
    !q || [c.name, c.channel, c.status].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      name: fd.get("name"),
      channel: (fd.get("channel") as string) || null,
      status: fd.get("status"),
      starts_at: (fd.get("starts_at") as string) || null,
      ends_at: (fd.get("ends_at") as string) || null,
      budget: Number(fd.get("budget") || 0) || null,
      spent: Number(fd.get("spent") || 0),
      reach: Number(fd.get("reach") || 0),
      conversions: Number(fd.get("conversions") || 0),
      notes: (fd.get("notes") as string) || null,
    };
    try {
      if (editing) await upd.mutateAsync({ id: editing.id, patch: payload });
      else await ins.mutateAsync(payload);
      toast.success(editing ? "Campaign updated" : "Campaign created");
      setOpen(false); setEditing(null);
    } catch { /* handled */ }
  };

  return (
    <PageShell title="Marketing" subtitle="Campaigns, loyalty, and customer engagement.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
        </div>
        <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
          <Plus className="h-4 w-4" />New Campaign
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3 font-medium">Campaign</th>
              <th className="px-6 py-3 font-medium">Channel</th>
              <th className="px-6 py-3 font-medium text-right">Reach</th>
              <th className="px-6 py-3 font-medium text-right">Conv.</th>
              <th className="px-6 py-3 font-medium text-right">Spent</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No campaigns yet.</td></tr>
            ) : filtered.map((c: any) => (
              <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-6 py-3 font-medium">{c.name}</td>
                <td className="px-6 py-3 text-muted-foreground">{c.channel ?? "—"}</td>
                <td className="px-6 py-3 text-right">{(c.reach || 0).toLocaleString()}</td>
                <td className="px-6 py-3 text-right">{(c.conversions || 0).toLocaleString()}</td>
                <td className="px-6 py-3 text-right">{peso(Number(c.spent || 0))}</td>
                <td className="px-6 py-3">
                  <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " + (STATUS_COLORS[c.status] ?? "bg-muted text-muted-foreground")}>{c.status}</span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button disabled={!canEdit} onClick={() => { setEditing(c); setOpen(true); }} className="p-1.5 rounded-lg hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button disabled={!canEdit} onClick={() => { if (confirm("Delete campaign?")) del.mutate(c.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Campaign</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <label className="text-xs font-medium block">Name<input name="name" required defaultValue={editing?.name ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Channel<select name="channel" defaultValue={editing?.channel ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"><option value="">—</option>{CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
              <label className="text-xs font-medium">Status<select name="status" required defaultValue={editing?.status ?? "draft"} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
              <label className="text-xs font-medium">Starts<input name="starts_at" type="date" defaultValue={editing?.starts_at ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Ends<input name="ends_at" type="date" defaultValue={editing?.ends_at ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Budget<input name="budget" type="number" step="0.01" defaultValue={editing?.budget ?? ""} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Spent<input name="spent" type="number" step="0.01" defaultValue={editing?.spent ?? 0} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Reach<input name="reach" type="number" defaultValue={editing?.reach ?? 0} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
              <label className="text-xs font-medium">Conversions<input name="conversions" type="number" defaultValue={editing?.conversions ?? 0} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" /></label>
            </div>
            <label className="text-xs font-medium block">Notes<textarea name="notes" rows={2} defaultValue={editing?.notes ?? ""} className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-card text-sm" /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
              <button type="submit" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editing ? "Save" : "Create"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}