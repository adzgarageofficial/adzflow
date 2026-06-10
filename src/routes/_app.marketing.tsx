import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState, useMemo } from "react";
import {
  Megaphone, Mail, Users, Percent, Plus, Edit2, Trash2, Search,
  MessageSquare, Copy, CheckCheck, ExternalLink, Send, PhoneCall,
} from "lucide-react";
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

/* ─── Broadcast helpers ─── */

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied to clipboard!`));
}

function EmailBlast({ customers }: { customers: any[] }) {
  const withEmail = customers.filter((c) => c.email);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(withEmail.map((c) => c.id)));
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [q, setQ] = useState("");

  const visible = withEmail.filter(
    (c) => !q || c.full_name?.toLowerCase().includes(q.toLowerCase()) || c.email?.toLowerCase().includes(q.toLowerCase()),
  );
  const allChecked = visible.length > 0 && visible.every((c) => selected.has(c.id));

  const toggle = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (allChecked) visible.forEach((c) => n.delete(c.id));
      else visible.forEach((c) => n.add(c.id));
      return n;
    });

  const chosenEmails = withEmail.filter((c) => selected.has(c.id)).map((c) => c.email).join(", ");
  const bccList = withEmail.filter((c) => selected.has(c.id)).map((c) => c.email).join(";");

  const openMailClient = () => {
    const uri = `mailto:?bcc=${encodeURIComponent(bccList)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(uri, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Compose */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-5 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Compose Email</h3>
        <label className="block text-xs font-medium">
          Subject
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Special Promo for Our Valued Customers!"
            className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
          />
        </label>
        <label className="block text-xs font-medium">
          Message Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Hi [Name],&#10;&#10;We have an exciting promo just for you!&#10;..."
            className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
          />
        </label>

        <div className="pt-1 flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selected.size}</span> recipient{selected.size !== 1 ? "s" : ""} selected
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={selected.size === 0}
              onClick={() => copyToClipboard(chosenEmails, "Email list")}
              className="h-9 px-4 rounded-xl border border-border text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-40 hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" /> Copy Emails
            </button>
            <button
              disabled={selected.size === 0}
              onClick={openMailClient}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-40"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open in Mail Client
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">"Open in Mail Client" will open Gmail/Outlook with all selected emails in the BCC field.</p>
        </div>
      </div>

      {/* Recipient list */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Recipients
            <span className="text-xs text-muted-foreground font-normal">({withEmail.length} with email)</span>
          </h3>
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter..." className="h-8 pl-8 pr-3 text-xs rounded-xl border border-border bg-background w-40" />
          </div>
        </div>

        {withEmail.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No customers with email yet.</p>
        ) : (
          <div className="overflow-y-auto max-h-[420px] space-y-1">
            {/* Select all row */}
            <label className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/60 cursor-pointer select-none border border-border mb-2">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select All Visible ({visible.length})</span>
            </label>
            {visible.map((c) => (
              <label key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/40 cursor-pointer select-none">
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="rounded" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.email}</div>
                </div>
                {selected.has(c.id) && <CheckCheck className="h-3.5 w-3.5 text-emerald-500 ml-auto shrink-0" />}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SmsBlast({ customers }: { customers: any[] }) {
  const withPhone = customers.filter((c) => c.phone);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(withPhone.map((c) => c.id)));
  const [message, setMessage] = useState("");
  const [q, setQ] = useState("");

  const SMS_LIMIT = 160;
  const charCount = message.length;
  const parts = charCount === 0 ? 0 : Math.ceil(charCount / SMS_LIMIT);

  const visible = withPhone.filter(
    (c) => !q || c.full_name?.toLowerCase().includes(q.toLowerCase()) || c.phone?.includes(q),
  );
  const allChecked = visible.length > 0 && visible.every((c) => selected.has(c.id));

  const toggle = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (allChecked) visible.forEach((c) => n.delete(c.id));
      else visible.forEach((c) => n.add(c.id));
      return n;
    });

  const chosenNumbers = withPhone.filter((c) => selected.has(c.id)).map((c) => c.phone).join(", ");

  const copyNumbers = () => copyToClipboard(chosenNumbers, "Phone numbers");
  const copyMessage = () => { if (message) copyToClipboard(message, "Message"); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Compose */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-5 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Compose SMS</h3>
        <label className="block text-xs font-medium">
          Message
          <div className="relative mt-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              maxLength={480}
              placeholder="Type your promo message here... (160 chars = 1 SMS part)"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
            />
            <div className={`absolute bottom-2 right-3 text-[11px] font-mono ${charCount > SMS_LIMIT ? "text-amber-500" : "text-muted-foreground"}`}>
              {charCount}/{SMS_LIMIT} · {parts} part{parts !== 1 ? "s" : ""}
            </div>
          </div>
        </label>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 space-y-1">
          <div className="font-semibold">How to send:</div>
          <ol className="list-decimal list-inside space-y-0.5 text-amber-700">
            <li>Click <strong>Copy Numbers</strong> below</li>
            <li>Click <strong>Copy Message</strong></li>
            <li>Paste into Semaphore, Globe Labs, ITEXMO, or any SMS platform</li>
          </ol>
        </div>

        <div className="pt-1 flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selected.size}</span> recipient{selected.size !== 1 ? "s" : ""} selected
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={selected.size === 0}
              onClick={copyNumbers}
              className="h-9 px-4 rounded-xl border border-border text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-40 hover:bg-secondary"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Copy Numbers
            </button>
            <button
              disabled={!message}
              onClick={copyMessage}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-40"
            >
              <Copy className="h-3.5 w-3.5" /> Copy Message
            </button>
          </div>
        </div>
      </div>

      {/* Recipient list */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Recipients
            <span className="text-xs text-muted-foreground font-normal">({withPhone.length} with phone)</span>
          </h3>
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter..." className="h-8 pl-8 pr-3 text-xs rounded-xl border border-border bg-background w-40" />
          </div>
        </div>

        {withPhone.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No customers with phone number yet.</p>
        ) : (
          <div className="overflow-y-auto max-h-[420px] space-y-1">
            <label className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/60 cursor-pointer select-none border border-border mb-2">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select All Visible ({visible.length})</span>
            </label>
            {visible.map((c) => (
              <label key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/40 cursor-pointer select-none">
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="rounded" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.phone}</div>
                </div>
                {selected.has(c.id) && <CheckCheck className="h-3.5 w-3.5 text-emerald-500 ml-auto shrink-0" />}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

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
  const [tab, setTab] = useState<"campaigns" | "email" | "sms">("campaigns");

  const withEmail = useMemo(() => (customers as any[]).filter((c) => c.email), [customers]);
  const withPhone = useMemo(() => (customers as any[]).filter((c) => c.phone), [customers]);

  const active = campaigns.filter((c: any) => c.status === "active").length;
  const totalReach = campaigns.reduce((s: number, c: any) => s + (c.reach || 0), 0);
  const totalConv = campaigns.reduce((s: number, c: any) => s + (c.conversions || 0), 0);
  const avgConv = totalReach ? ((totalConv / totalReach) * 100).toFixed(1) + "%" : "0%";

  const stats = [
    { label: "Active Campaigns", value: active, icon: Megaphone },
    { label: "Total Customers", value: (customers as any[]).length.toLocaleString(), icon: Users },
    { label: "With Email", value: withEmail.length.toLocaleString(), icon: Mail },
    { label: "With Phone", value: withPhone.length.toLocaleString(), icon: MessageSquare },
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

  const TABS = [
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "email", label: "Email Blast", icon: Mail, badge: withEmail.length },
    { id: "sms", label: "SMS Blast", icon: MessageSquare, badge: withPhone.length },
  ] as const;

  return (
    <PageShell title="Marketing" subtitle="Campaigns, loyalty, and customer engagement.">
      {/* Stats */}
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

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {"badge" in t && (
              <span className="ml-1 rounded-full bg-secondary text-muted-foreground text-[10px] font-semibold px-1.5 py-0.5">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {/* ── Campaigns Tab ── */}
        {tab === "campaigns" && (
          <>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="relative w-64">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm" />
              </div>
              <button disabled={!canEdit} onClick={() => { setEditing(null); setOpen(true); }} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-soft">
                <Plus className="h-4 w-4" />New Campaign
              </button>
            </div>

            <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
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
          </>
        )}

        {/* ── Email Blast Tab ── */}
        {tab === "email" && <EmailBlast customers={customers as any[]} />}

        {/* ── SMS Blast Tab ── */}
        {tab === "sms" && <SmsBlast customers={customers as any[]} />}
      </div>

      {/* Campaign Dialog */}
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
