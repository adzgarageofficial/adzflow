import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserCog } from "lucide-react";
import { useMemo, useState } from "react";
import { useProfiles, useUserRoles, useSetUserRole, useBranches, useIsOwner } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

const ROLES = ["owner", "admin", "cashier", "inventory", "mechanic", "marketing", "finance"] as const;
const ROLE_COLORS: Record<string, string> = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  cashier: "bg-emerald-100 text-emerald-700",
  inventory: "bg-amber-100 text-amber-700",
  mechanic: "bg-orange-100 text-orange-700",
  marketing: "bg-pink-100 text-pink-700",
  finance: "bg-cyan-100 text-cyan-700",
};

function UsersPage() {
  const { data: profiles = [] } = useProfiles();
  const { data: roles = [] } = useUserRoles();
  const { data: branches = [] } = useBranches();
  const setRole = useSetUserRole();
  const canEdit = useIsOwner();
  const [q, setQ] = useState("");

  const roleByUser = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of roles as any[]) m.set(r.user_id, r.role);
    return m;
  }, [roles]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return profiles;
    return (profiles as any[]).filter((p) =>
      [p.display_name, p.email, p.username, p.branch?.name]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(s)),
    );
  }, [profiles, q]);

  return (
    <PageShell title="Users" subtitle="Team members, roles and branch access.">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 h-10 flex-1 max-w-md rounded-xl border border-border bg-white px-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name, email, branch…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <UserCog className="h-3.5 w-3.5" />
          New users sign up via Login page
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-5">Change role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No users yet.</TableCell></TableRow>
            ) : (filtered as any[]).map((u) => {
              const role = roleByUser.get(u.id) ?? "cashier";
              return (
                <TableRow key={u.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold">
                        {(u.display_name ?? "U").split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{u.display_name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={"font-medium " + (ROLE_COLORS[role] ?? "")}>{role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{u.branch?.name ?? "—"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border ${
                      u.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      "bg-muted text-muted-foreground border-border"
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex justify-end">
                      <select
                        value={role}
                        disabled={!canEdit}
                        onChange={(e) => setRole.mutate({ user_id: u.id, role: e.target.value }, { onSuccess: () => toast.success("Role updated") })}
                        className="h-9 rounded-lg border border-border bg-white px-3 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {branches.length === 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          Tip: add branches in <span className="font-medium">Settings</span> to assign team members to locations.
        </p>
      )}
    </PageShell>
  );
}