export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch (e) {
    console.error("Service worker registration failed", e);
    return null;
  }
}

export async function showLocalNotification(title, options = {}) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
}

// Best-effort daily reminder: checks every 30s while the app is open (or
// running installed as a PWA in the foreground/recent-background on
// browsers that keep it alive) and fires once per day at the chosen time.
// This is NOT a true background push - the browser has to be running the
// app at least occasionally. For reminders that fire even when the app is
// fully closed, you need Firebase Cloud Messaging + a scheduled server
// function - see README -> "Real background push notifications".
export function startReminderWatcher(getReminder) {
  const STORAGE_KEY = "verses:lastReminderFired";

  const check = () => {
    const { enabled, time } = getReminder();
    if (!enabled || !time) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const today = now.toISOString().slice(0, 10);
    const lastFired = localStorage.getItem(STORAGE_KEY);

    if (`${hh}:${mm}` === time && lastFired !== today) {
      showLocalNotification("Time with God 🙏", {
        body: "Your daily verse and prayer are ready in Verses.",
        icon: "/icon-192.png",
      });
      localStorage.setItem(STORAGE_KEY, today);
    }
  };

  const interval = setInterval(check, 30000);
  check();
  return () => clearInterval(interval);
}
