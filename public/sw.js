self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || "ADZ Garage", {
      body: data.body || "",
      icon: "/favicon.png",
      badge: "/favicon.png",
      data: { url: data.url || "/" },
      vibrate: [200, 100, 200],
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const target = event.notification.data?.url || "/";
        for (const client of clientList) {
          if (client.url.includes(target) && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(target);
      }),
  );
});
