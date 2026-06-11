import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserCog, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useProfiles, useUserRoles, useSetUserRole, useBranches, useCurrentUserRoles } from "@/lib/db";
import { createTeamMember } from "@/lib/team-members";
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
  const { data: myRoles = [] } = useCurrentUserRoles();
  const isOwner = myRoles.includes("owner");
  const canEdit = isOwner || myRoles.includes("admin");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

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
        {isOwner ? (
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Add team member
          </Button>
        ) : (
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <UserCog className="h-3.5 w-3.5" />
            Contact the owner to add team members
          </div>
        )}
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
                        {ROLES.filter((r) => isOwner || (r !== "owner" && r !== "admin")).map((r) => <option key={r} value={r}>{r}</option>)}
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

      <AddTeamMemberDialog open={addOpen} onClose={() => setAddOpen(false)} branches={branches as any[]} isOwner={isOwner} />
    </PageShell>
  );
}

function AddTeamMemberDialog({ open, onClose, branches, isOwner }: { open: boolean; onClose: () => void; branches: any[]; isOwner: boolean }) {
  const queryClient = useQueryClient();
  const callCreateTeamMember = useServerFn(createTeamMember);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<string>("cashier");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEmail("");
    setDisplayName("");
    setRole("cashier");
    setPassword("");
    setBranchId("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setBusy(true);
    try {
      await callCreateTeamMember({
        data: { email, displayName, role: role as any, password, branchId: branchId || null },
      });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["user_roles"] });
      toast.success("Account created successfully.");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add team member</DialogTitle>
            <DialogDescription>
              Set the email, password, and role for the new account. Only you can create accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div>
              <Label htmlFor="member-name">Full name</Label>
              <Input id="member-name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Juan dela Cruz" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@adzgarage.ph" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label htmlFor="member-password">Password</Label>
              <Input id="member-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1.5 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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