self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow("/");
    })
  );
});

// Placeholder for Firebase Cloud Messaging push events, once wired server-side.
// See README -> "Real background push notifications" for setup.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Verses", body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Verses", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    })
  );
});
