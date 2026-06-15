import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useAuditLogs } from "@/lib/db";
import { TableSkeleton, QueryError } from "@/components/query-states";
import { useMemo, useState } from "react";
import { ShieldCheck, Download, Search } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/audit-log")({ component: AuditLogPage });

const ACTION_COLOR: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-500",
  update: "bg-blue-500/10 text-blue-500",
  delete: "bg-rose-500/10 text-rose-500",
  login: "bg-violet-500/10 text-violet-500",
  export: "bg-amber-500/10 text-amber-500",
  approve: "bg-teal-500/10 text-teal-500",
};

function AuditLogPage() {
  const { data: logs = [], isLoading, isError, error, refetch } = useAuditLogs();
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");

  const filtered = useMemo(() => {
    return (logs as any[]).filter((l) => {
      if (action && l.action !== action) return false;
      if (entity && l.entity_type !== entity) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (l.summary ?? "").toLowerCase().includes(q) ||
          (l.actor_name ?? "").toLowerCase().includes(q) ||
          (l.entity_id ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, search, action, entity]);

  const actions = useMemo(() => Array.from(new Set((logs as any[]).map((l) => l.action))).filter(Boolean), [logs]);
  const entities = useMemo(() => Array.from(new Set((logs as any[]).map((l) => l.entity_type))).filter(Boolean), [logs]);

  const exportCsv = () => {
    const rows = [["When", "Actor", "Action", "Entity", "Entity ID", "Summary"]];
    filtered.forEach((l) =>
      rows.push([
        format(new Date(l.created_at), "yyyy-MM-dd HH:mm:ss"),
        l.actor_name ?? "",
        l.action,
        l.entity_type,
        l.entity_id ?? "",
        (l.summary ?? "").replace(/"/g, '""'),
      ]),
    );
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell
      title="Audit Log"
      subtitle="Every important system action — sino, kelan, ano."
      actions={
        <button
          onClick={exportCsv}
          className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="relative md:col-span-2">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor, summary, entity id…"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-card border border-border text-sm outline-none"
          />
        </div>
        <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 rounded-lg bg-card border border-border px-3 text-sm">
          <option value="">All actions</option>
          {actions.map((a: string) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={entity} onChange={(e) => setEntity(e.target.value)} className="h-10 rounded-lg bg-card border border-border px-3 text-sm">
          <option value="">All entities</option>
          {entities.map((e2: string) => <option key={e2} value={e2}>{e2}</option>)}
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : isError ? (
        <QueryError message={(error as Error)?.message} onRetry={refetch} />
      ) : (
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{filtered.length} entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2.5">When</th>
                <th className="text-left px-5 py-2.5">Actor</th>
                <th className="text-left px-5 py-2.5">Action</th>
                <th className="text-left px-5 py-2.5">Entity</th>
                <th className="text-left px-5 py-2.5">Summary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No audit entries yet.</td></tr>
              )}
              {filtered.map((l: any) => (
                <tr key={l.id} className="border-t border-border hover:bg-muted/10">
                  <td className="px-5 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(l.created_at), "MMM d, HH:mm:ss")}
                  </td>
                  <td className="px-5 py-2.5 font-medium">{l.actor_name ?? "system"}</td>
                  <td className="px-5 py-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${ACTION_COLOR[l.action] ?? "bg-muted text-muted-foreground"}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-xs">
                    <div className="font-medium">{l.entity_type}</div>
                    {l.entity_id && <div className="text-muted-foreground truncate max-w-[160px]">{l.entity_id}</div>}
                  </td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{l.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </PageShell>
  );
}