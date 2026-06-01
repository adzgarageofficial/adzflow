import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useNotifications, useInsert, useUpdate, useDelete } from "@/lib/db";
import { useMemo, useState } from "react";
import { Bell, Plus, Check, Trash2, AlertTriangle, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/notifications")({ component: NotificationsPage });

const SEVERITY_META: Record<string, { color: string; Icon: any }> = {
  info: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", Icon: Info },
  success: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", Icon: CheckCircle2 },
  warning: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", Icon: AlertTriangle },
  error: { color: "bg-rose-500/10 text-rose-500 border-rose-500/20", Icon: AlertCircle },
};

function NotificationsPage() {
  const { data: notifs = [], isLoading } = useNotifications();
  const insert = useInsert<any>("notifications");
  const update = useUpdate<any>("notifications");
  const del = useDelete("notifications");
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const filtered = useMemo(() => {
    const arr = notifs as any[];
    return tab === "unread" ? arr.filter((n) => !n.read_at) : arr;
  }, [notifs, tab]);

  const unreadCount = (notifs as any[]).filter((n) => !n.read_at).length;

  const markRead = (id: string) =>
    update.mutate({ id, patch: { read_at: new Date().toISOString() } });

  const markAllRead = async () => {
    const unread = (notifs as any[]).filter((n) => !n.read_at);
    await Promise.all(
      unread.map(
        (n) => new Promise((res) => update.mutate({ id: n.id, patch: { read_at: new Date().toISOString() } }, { onSettled: () => res(null) })),
      ),
    );
    toast.success("All marked as read");
  };

  const submit = (form: any) => {
    insert.mutate(
      {
        title: form.title,
        body: form.body || null,
        severity: form.severity,
        category: form.category,
        link: form.link || null,
        audience_role: form.audience_role || null,
      },
      {
        onSuccess: () => {
          toast.success("Notification sent");
          setCreating(false);
        },
      },
    );
  };

  return (
    <PageShell
      title="Notifications"
      subtitle={`${unreadCount} unread · system alerts and broadcasts.`}
      actions={
        <>
          <button onClick={markAllRead} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold">Mark all read</button>
          <button onClick={() => setCreating(true)} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Broadcast
          </button>
        </>
      }
    >
      <div className="flex items-center gap-2 mb-4">
        {(["all", "unread"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold capitalize ${tab === k ? "bg-primary text-primary-foreground" : "border border-border"}`}
          >
            {k} {k === "unread" && unreadCount > 0 && <span className="ml-1">({unreadCount})</span>}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft divide-y divide-border">
        {isLoading && <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>}
        {!isLoading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <div className="text-sm">Walang notifications.</div>
          </div>
        )}
        {filtered.map((n: any) => {
          const meta = SEVERITY_META[n.severity] ?? SEVERITY_META.info;
          const Icon = meta.Icon;
          const unread = !n.read_at;
          return (
            <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${unread ? "bg-primary/[0.02]" : ""}`}>
              <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${meta.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm ${unread ? "font-semibold" : "font-medium"}`}>{n.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">{n.category}</span>
                  {n.audience_role && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">→ {n.audience_role}</span>}
                  {unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                <div className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })} · {format(new Date(n.created_at), "MMM d, HH:mm")}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {unread && (
                  <button onClick={() => markRead(n.id)} className="h-7 w-7 rounded-lg hover:bg-muted flex items-center justify-center" title="Mark read">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                <button onClick={() => del.mutate(n.id)} className="h-7 w-7 rounded-lg hover:bg-muted text-rose-500 flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Broadcast notification</DialogTitle></DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              submit(Object.fromEntries(fd.entries()));
            }}
            className="space-y-3"
          >
            <input name="title" required placeholder="Title" className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm" />
            <textarea name="body" placeholder="Message (optional)" rows={3} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <select name="severity" defaultValue="info" className="h-10 rounded-lg bg-background border border-border px-3 text-sm">
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <select name="category" defaultValue="system" className="h-10 rounded-lg bg-background border border-border px-3 text-sm">
                <option value="system">System</option>
                <option value="inventory">Inventory</option>
                <option value="finance">Finance</option>
                <option value="hr">HR</option>
                <option value="ops">Operations</option>
                <option value="crm">CRM</option>
              </select>
            </div>
            <input name="audience_role" placeholder="Audience role (blank = everyone)" className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm" />
            <input name="link" placeholder="Link (optional)" className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm" />
            <button type="submit" className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Send</button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}