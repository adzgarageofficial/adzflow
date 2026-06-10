import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const APP_ROLES = ["owner", "admin", "cashier", "inventory", "mechanic", "marketing", "finance"] as const;

const inputSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(120),
  role: z.enum(APP_ROLES),
  branchId: z.string().uuid().nullable().optional(),
});

function generateTemporaryPassword() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 16) + "Az1!";
}

/**
 * Owner/admin-only: provisions a real login account for a team member and assigns
 * their role in one step, so the person they're inviting can sign in immediately.
 */
export const createTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(inputSchema)
  .handler(async ({ data, context }) => {
    const { data: callerRoles, error: callerRolesErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (callerRolesErr) throw new Error("Could not verify your permissions.");

    const roleNames = new Set((callerRoles ?? []).map((r) => r.role));
    const callerIsOwner = roleNames.has("owner");
    const callerIsStaff = callerIsOwner || roleNames.has("admin");
    if (!callerIsStaff) throw new Error("Only the owner or an admin can add team members.");
    if ((data.role === "owner" || data.role === "admin") && !callerIsOwner) {
      throw new Error("Only the owner can assign the Owner or Admin role.");
    }

    const temporaryPassword = generateTemporaryPassword();

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { display_name: data.displayName },
    });
    if (createErr) throw new Error(createErr.message);

    const newUserId = created.user.id;

    // The on_auth_user_created trigger seeds a default role — replace it with the chosen one.
    const { error: delErr } = await supabaseAdmin.from("user_roles").delete().eq("user_id", newUserId);
    if (delErr) throw new Error(delErr.message);
    const { error: insErr } = await supabaseAdmin.from("user_roles").insert({ user_id: newUserId, role: data.role });
    if (insErr) throw new Error(insErr.message);

    if (data.branchId) {
      await supabaseAdmin.from("profiles").update({ branch_id: data.branchId }).eq("id", newUserId);
    }

    return {
      userId: newUserId,
      email: data.email,
      temporaryPassword,
    };
  });
