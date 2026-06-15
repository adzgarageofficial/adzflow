import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Search, UserPlus, ShieldCheck, ShieldOff, Loader2, CheckCircle2,
  ChevronRight, Users2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useProfiles, useUserRoles, useSetUserRole, useBranches, useCurrentUserRoles } from "@/lib/db";
import {
  useRbac,
  ALL_ACTION_KEYS,
  ALL_MODULE_KEYS,
  MODULE_LABELS,
  type Role,
  type ModuleKey,
  type ActionKey,
} from "@/lib/rbac";
import { createTeamMember } from "@/lib/team-members";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

const ROLE_COLORS: Record<string, string> = {
  owner:     "bg-purple-100 text-purple-700 border-purple-200",
  admin:     "bg-blue-100 text-blue-700 border-blue-200",
  cashier:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  inventory: "bg-amber-100 text-amber-700 border-amber-200",
  mechanic:  "bg-orange-100 text-orange-700 border-orange-200",
  marketing: "bg-pink-100 text-pink-700 border-pink-200",
  finance:   "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const ROLE_ICON_BG: Record<string, string> = {
  owner:     "bg-purple-500",
  admin:     "bg-blue-500",
  cashier:   "bg-emerald-500",
  inventory: "bg-amber-500",
  mechanic:  "bg-orange-500",
  marketing: "bg-pink-500",
  finance:   "bg-cyan-500",
};

function initials(name: string) {
  return (name ?? "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

/* ─────────────────────────────── main page ─────────────────────────────── */
function UsersPage() {
  const { data: profiles = [] } = useProfiles();
  const { data: userRoles = [] } = useUserRoles();
  const { data: branches = [] } = useBranches();
  const { data: myRoles = [] } = useCurrentUserRoles();
  const { roles: rbacRoles } = useRbac();
  const setRole = useSetUserRole();

  const isOwner = myRoles.includes("owner");
  const canEdit = isOwner || myRoles.includes("admin");

  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [pendingRole, setPendingRole] = useState<string>("");

  const roleByUser = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of userRoles as any[]) m.set(r.user_id, r.role);
    return m;
  }, [userRoles]);

  const userCountByRole = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of userRoles as any[]) m[r.role] = (m[r.role] ?? 0) + 1;
    return m;
  }, [userRoles]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return profiles as any[];
    return (profiles as any[]).filter((p) =>
      [p.display_name, p.email, p.username, p.branch?.name]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(s)),
    );
  }, [profiles, q]);

  const selectUser = (u: any) => {
    setSelectedUser(u);
    setPendingRole(roleByUser.get(u.id) ?? "cashier");
  };

  const saveRole = () => {
    if (!selectedUser) return;
    setRole.mutate(
      { user_id: selectedUser.id, role: pendingRole },
      {
        onSuccess: () => toast.success(`Role updated to "${pendingRole}"`),
        onError: () => toast.error("Failed to update role"),
      },
    );
  };

  const currentUserRole = selectedUser ? (roleByUser.get(selectedUser.id) ?? "cashier") : "";
  const isDirty = pendingRole !== currentUserRole;

  return (
    <PageShell
      title="Team Members"
      subtitle="Manage your team and assign system roles."
    >
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-132px)] overflow-hidden">

        {/* ── LEFT: member list — fixed height, only cards scroll internally ── */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 h-full overflow-hidden flex flex-col gap-3">

          {/* create button */}
          {isOwner ? (
            <button
              onClick={() => setAddOpen(true)}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:brightness-105 transition"
            >
              <UserPlus className="h-4 w-4" /> Create team member
            </button>
          ) : (
            <div className="h-11 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Users2 className="h-3.5 w-3.5" /> Contact owner to add members
            </div>
          )}

          {/* search */}
          <div className="flex items-center gap-2 h-10 rounded-xl border border-border bg-card px-3 shadow-soft">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {/* member cards — scrolls independently when list gets long */}
          <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Users2 className="h-7 w-7 mx-auto mb-2 opacity-40" />
                No team members yet.
              </div>
            ) : (filtered as any[]).map((u) => {
              const role = roleByUser.get(u.id) ?? "cashier";
              const active = selectedUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => selectUser(u)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition flex items-center gap-3 ${
                    active
                      ? "border-primary/30 bg-accent shadow-soft ring-1 ring-primary/20"
                      : "border-border bg-card hover:bg-secondary/60 hover:border-border"
                  }`}
                >
                  {/* avatar */}
                  <div className={`h-9 w-9 rounded-full shrink-0 grid place-items-center text-xs font-bold text-white ${
                    ROLE_ICON_BG[role] ?? "bg-primary"
                  }`}>
                    {initials(u.display_name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{u.display_name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${ROLE_COLORS[role] ?? "bg-secondary text-foreground border-border"}`}>
                        {role}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-emerald-400" : "bg-zinc-400"}`} />
                      <span className="text-[10px] text-muted-foreground">{u.status}</span>
                    </div>
                  </div>

                  <ChevronRight className={`h-4 w-4 shrink-0 transition ${active ? "text-primary" : "text-muted-foreground/40"}`} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── RIGHT: role & permissions panel — scrolls independently ── */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 h-full overflow-y-auto pr-1">
          {!selectedUser ? (
            <EmptyState canEdit={canEdit} />
          ) : (
            <RolePanel
              user={selectedUser}
              currentRole={currentUserRole}
              pendingRole={pendingRole}
              setPendingRole={setPendingRole}
              isDirty={isDirty}
              saving={setRole.isPending}
              onSave={saveRole}
              rbacRoles={rbacRoles}
              userCountByRole={userCountByRole}
              canEdit={canEdit}
              isOwner={isOwner}
            />
          )}
        </section>
      </div>

      <AddTeamMemberDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        branches={branches as any[]}
        isOwner={isOwner}
      />
    </PageShell>
  );
}

/* ─────────────────────────────── empty state ───────────────────────────── */
function EmptyState({ canEdit }: { canEdit: boolean }) {
  return (
    <div className="h-full min-h-[400px] rounded-2xl border border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 p-10 text-center shadow-soft">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div>
        <p className="font-semibold text-base">Select a team member</p>
        <p className="text-sm text-muted-foreground mt-1">
          {canEdit
            ? "Click any member on the left to view and update their role."
            : "Click any member on the left to view their role."}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────── role panel ───────────────────────────────── */
function RolePanel({
  user,
  currentRole,
  pendingRole,
  setPendingRole,
  isDirty,
  saving,
  onSave,
  rbacRoles,
  userCountByRole,
  canEdit,
  isOwner,
}: {
  user: any;
  currentRole: string;
  pendingRole: string;
  setPendingRole: (r: string) => void;
  isDirty: boolean;
  saving: boolean;
  onSave: () => void;
  rbacRoles: Role[];
  userCountByRole: Record<string, number>;
  canEdit: boolean;
  isOwner: boolean;
}) {
  const { roles, setRoles, can } = useRbac();
  const { isLoading: rolesLoading } = useCurrentUserRoles();
  const [permTab, setPermTab] = useState<string | null>(null);

  const selectedRoleDef = roles.find((r) => r.id === (permTab ?? pendingRole));

  const updateRoleDef = (next: Role) => setRoles(roles.map((r) => (r.id === next.id ? next : r)));

  const togglePerm = (mod: ModuleKey, action: ActionKey) => {
    if (!selectedRoleDef || selectedRoleDef.id === "owner") {
      toast.error("Owner permissions cannot be modified");
      return;
    }
    const current = selectedRoleDef.permissions[mod] ?? [];
    const has = current.includes(action);
    const nextActions = has ? current.filter((a) => a !== action) : [...current, action];
    const nextPerms = { ...selectedRoleDef.permissions, [mod]: nextActions };
    if (nextActions.length === 0) delete nextPerms[mod];
    updateRoleDef({ ...selectedRoleDef, permissions: nextPerms });
  };

  return (
    <div className="space-y-5">

      {/* ── user header card ── */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-5 flex items-center gap-4">
        <div className={`h-14 w-14 rounded-2xl shrink-0 grid place-items-center text-lg font-bold text-white shadow-glow ${
          ROLE_ICON_BG[currentRole] ?? "bg-primary"
        }`}>
          {initials(user.display_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold truncate">{user.display_name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          {user.branch?.name && (
            <div className="text-xs text-muted-foreground mt-0.5">{user.branch.name}</div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[currentRole] ?? "bg-secondary text-foreground border-border"}`}>
            {currentRole}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border ${
            user.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-muted text-muted-foreground border-border"
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {user.status}
          </span>
        </div>
      </div>

      {/* ── role assignment checklist ── */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Assign Role</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Piliin ang role para sa team member na ito.</p>
          </div>
          {isDirty && canEdit && (
            <button
              onClick={onSave}
              disabled={saving}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-glow hover:brightness-105 transition disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {roles.map((r) => {
            const isSelected = pendingRole === r.id;
            const isCurrent = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => canEdit && setPendingRole(r.id)}
                disabled={!canEdit}
                className={`relative text-left rounded-xl border px-4 py-3 transition group ${
                  isSelected
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/25 shadow-soft"
                    : "border-border bg-secondary/30 hover:bg-secondary/60 hover:border-border disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isCurrent && !isSelected && (
                  <span className="absolute top-2 right-2 text-[9px] font-semibold bg-secondary text-muted-foreground rounded px-1.5 py-0.5">current</span>
                )}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-8 w-8 rounded-lg shrink-0 grid place-items-center ${
                    isSelected ? "bg-primary text-primary-foreground" : `${ROLE_ICON_BG[r.id] ?? "bg-secondary"} text-white`
                  }`}>
                    {isSelected ? <CheckCircle2 className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm">{r.name}</span>
                      {r.system && (
                        <span className="text-[9px] bg-muted text-muted-foreground rounded px-1 py-px">System</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {userCountByRole[r.id] ?? 0} member{(userCountByRole[r.id] ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── permission matrix (manage roles) ── */}
      {can("roles", "view") && (
        <div className="rounded-2xl border border-border bg-card shadow-soft p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-sm">Roles & Permissions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">I-edit ang module access ng bawat role.</p>
          </div>

          {/* role selector pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {roles.map((r) => {
              const active = (permTab ?? pendingRole) === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setPermTab(r.id)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold border transition ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "border-border bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>

          {selectedRoleDef && (
            <>
              {/* permission matrix */}
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="text-left">
                      <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Module</th>
                      {ALL_ACTION_KEYS.map((a) => (
                        <th key={a} className="px-2 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                          {a}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_MODULE_KEYS.map((m) => {
                      const acts = selectedRoleDef.permissions[m] ?? [];
                      return (
                        <tr key={m} className="border-t border-border hover:bg-muted/20">
                          <td className="px-4 py-2 font-medium text-xs">{MODULE_LABELS[m]}</td>
                          {ALL_ACTION_KEYS.map((a) => (
                            <td key={a} className="px-2 py-2 text-center">
                              <Checkbox
                                checked={acts.includes(a)}
                                onCheckedChange={() => togglePerm(m, a)}
                                disabled={selectedRoleDef.id === "owner"}
                                className="h-3.5 w-3.5"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">
                Changes apply instantly to all members assigned to this role.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────── add team member dialog ─────────────────────────────── */
const ROLES_LIST_CONST = ["owner", "admin", "cashier", "inventory", "mechanic", "marketing", "finance"] as const;

function AddTeamMemberDialog({
  open,
  onClose,
  branches,
  isOwner,
}: {
  open: boolean;
  onClose: () => void;
  branches: any[];
  isOwner: boolean;
}) {
  const queryClient = useQueryClient();
  const callCreateTeamMember = useServerFn(createTeamMember);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<string>("cashier");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const reset = () => { setEmail(""); setDisplayName(""); setRole("cashier"); setPassword(""); setBranchId(""); };
  const handleClose = () => { onClose(); setTimeout(reset, 200); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setBusy(true);
    try {
      await callCreateTeamMember({ data: { email, displayName, role: role as any, password, branchId: branchId || null } });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["user_roles"] });
      toast.success("Account created successfully.");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the account");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create team member</DialogTitle>
            <DialogDescription>
              Set the email, password, and role for the new account. Only you can create accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 space-y-4">
            <div>
              <Label htmlFor="m-name">Full name</Label>
              <Input id="m-name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Juan dela Cruz" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label htmlFor="m-email">Email</Label>
              <Input id="m-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@adzgarage.ph" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label htmlFor="m-password">Password</Label>
              <Input id="m-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1.5 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES_LIST_CONST.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {branches.length > 0 && (
              <div>
                <Label>Branch (optional)</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="mt-1.5 h-10"><SelectValue placeholder="No branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="mt-5">
            <Button type="button" variant="outline" onClick={handleClose} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
