import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import webpush from "web-push";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

webpush.setVapidDetails(
  process.env["VAPID_SUBJECT"]!,
  process.env["VITE_VAPID_PUBLIC_KEY"]!,
  process.env["VAPID_PRIVATE_KEY"]!,
);

export const savePushSubscription = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user_id: z.string().uuid(),
      endpoint: z.string(),
      p256dh: z.string(),
      auth: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    await supabaseAdmin.from("push_subscriptions").upsert(
      {
        user_id: data.user_id,
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
      },
      { onConflict: "user_id,endpoint" },
    );
    return { ok: true };
  });

export const sendSalePushNotification = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string(),
      body: z.string(),
      url: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    // Get all owner/admin push subscriptions
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("role", ["owner", "admin"]);

    if (!profiles?.length) return { sent: 0 };

    const ownerIds = profiles.map((p) => p.id);

    const { data: subs } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .in("user_id", ownerIds);

    if (!subs?.length) return { sent: 0 };

    const payload = JSON.stringify({
      title: data.title,
      body: data.body,
      url: data.url ?? "/orders",
    });

    const results = await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        ),
      ),
    );

    return { sent: results.filter((r) => r.status === "fulfilled").length };
  });
