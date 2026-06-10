import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  useRbac,
  ALL_ACTION_KEYS,
  ALL_MODULE_KEYS,
  MODULE_LABELS,
  type Role,
  type ModuleKey,
  type ActionKey,
} from "@/lib/rbac";
import { useCurrentUserRoles } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Copy, Plus, Trash2, ShieldOff, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/roles")({ component: RolesPage });

function RolesPage() {
  const { roles, users, setRoles, can } = useRbac();
  const { isLoading: rolesLoading } = useCurrentUserRoles();
  const [selectedId, setSelectedId] = useState<string>(roles[0]?.id ?? "");

  if (rolesLoading) {
    return (
      <PageShell title="Roles & Permissions" subtitle="Loading permissions…">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <Loader2 className="h-8 w-8 text-muted-foreground mx-auto animate-spin" />
        </div>
      </PageShell>
    );
  }

  if (!can("roles", "view")) {
    return (
      <PageShell title="Roles & Permissions" subtitle="Access restricted">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <ShieldOff className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="mt-3 font-semibold">You don't have access to this module.</p>
        </div>
      </PageShell>
    );
  }

  const selected = roles.find((r) => r.id === selectedId) ?? roles[0];
  const userCountByRole = useMemo(() => {
    const m: Record<string, number> = {};
    for (const u of users) m[u.roleId] = (m[u.roleId] ?? 0) + 1;
    return m;
  }, [users]);

  const updateRole = (next: Role) => {
    setRoles(roles.map((r) => (r.id === next.id ? next : r)));
  };

  const togglePerm = (mod: ModuleKey, action: ActionKey) => {
    if (!selected || selected.system && selected.id === "owner") {
      toast.error("Owner permissions cannot be modified");
      return;
    }
    const current = selected.permissions[mod] ?? [];
    const has = current.includes(action);
    const nextActions = has ? current.filter((a) => a !== action) : [...current, action];
    const nextPerms = { ...selected.permissions, [mod]: nextActions };
    if (nextActions.length === 0) delete nextPerms[mod];
    updateRole({ ...selected, permissions: nextPerms });
  };

  const cloneRole = (r: Role) => {
    const copy: Role = {
      ...r,
      id: `${r.id}-copy-${Date.now()}`,
      name: `${r.name} (copy)`,
      system: false,
    };
    setRoles([...roles, copy]);
    setSelectedId(copy.id);
    toast.success("Role cloned");
  };

  const deleteRole = (r: Role) => {
    if (r.system) return toast.error("System roles cannot be deleted");
    setRoles(roles.filter((x) => x.id !== r.id));
    setSelectedId(roles[0]?.id ?? "");
    toast.success("Role deleted");
  };

  const addCustomRole = () => {
    const r: Role = {
      id: `custom-${Date.now()}`,
      name: "New custom role",
      description: "Describe what this role can do.",
      permissions: { dashboard: ["view"] },
    };
    setRoles([...roles, r]);
    setSelectedId(r.id);
    toast.success("Role created — edit the name and permissions below.");
  };

  return (
    <PageShell title="Roles & Permissions" subtitle="Control what each role can see and do.">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Roles</span>
            <Button size="sm" variant="ghost" onClick={addCustomRole}>
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </div>
          {roles.map((r) => {
            const active = r.id === selected?.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left rounded-2xl border p-4 shadow-soft transition ${
                  active ? "border-primary/40 bg-accent" : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center ${active ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"}`}>
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{r.name}</span>
                      {r.system && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">System</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{r.description}</p>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {userCountByRole[r.id] ?? 0} user{(userCountByRole[r.id] ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {selected && (
          <section className="col-span-12 lg:col-span-8 xl:col-span-9 rounded-2xl bg-card border border-border shadow-soft p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role name</Label>
                <Input
                  value={selected.name}
                  onChange={(e) => updateRole({ ...selected, name: e.target.value })}
                  disabled={selected.system}
                  className="mt-1.5 text-lg font-semibold h-11"
                />
                <Input
                  value={selected.description}
                  onChange={(e) => updateRole({ ...selected, description: e.target.value })}
                  disabled={selected.system}
                  className="mt-2 text-sm"
                  placeholder="Describe this role"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => cloneRole(selected)}>
                  <Copy className="h-4 w-4 mr-1" /> Clone
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteRole(selected)}
                  disabled={selected.system}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Module</th>
                    {ALL_ACTION_KEYS.map((a) => (
                      <th key={a} className="px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_MODULE_KEYS.map((m) => {
                    const acts = selected.permissions[m] ?? [];
                    return (
                      <tr key={m} className="border-t border-border hover:bg-muted/20">
                        <td className="px-4 py-2.5 font-medium">{MODULE_LABELS[m]}</td>
                        {ALL_ACTION_KEYS.map((a) => (
                          <td key={a} className="px-3 py-2.5 text-center">
                            <Checkbox
                              checked={acts.includes(a)}
                              onCheckedChange={() => togglePerm(m, a)}
                              disabled={selected.id === "owner"}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Changes apply instantly to all users assigned to this role.
            </p>
          </section>
        )}
      </div>
    </PageShell>
  );
}