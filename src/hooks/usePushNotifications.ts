import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { savePushSubscription } from "@/lib/push-notifications";

const VAPID_PUBLIC_KEY = import.meta.env["VITE_VAPID_PUBLIC_KEY"] as string;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export type PushState = "unsupported" | "denied" | "subscribed" | "unsubscribed";

export function usePushNotifications() {
  const [state, setState] = useState<PushState>("unsubscribed");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => {
        setState(sub ? "subscribed" : "unsubscribed");
      }),
    );
  }, []);

  const subscribe = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) throw new Error("Not logged in");

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON();
      await savePushSubscription({
        data: {
          user_id: userRes.user.id,
          endpoint: json.endpoint!,
          p256dh: (json.keys as any).p256dh,
          auth: (json.keys as any).auth,
        },
      });

      setState("subscribed");
    } catch (err) {
      console.error("Push subscribe failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const { data: userRes } = await supabase.auth.getUser();
        await sub.unsubscribe();
        if (userRes.user) {
          await supabase
            .from("push_subscriptions" as any)
            .delete()
            .eq("user_id", userRes.user.id)
            .eq("endpoint", sub.endpoint);
        }
      }
      setState("unsubscribed");
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, subscribe, unsubscribe };
}
