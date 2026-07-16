import { useState } from "react";
import {
  Zap,
  Bell,
  Languages,
  Moon,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { TRANSLATIONS } from "../lib/bibleApi";
import { updateProfile } from "../lib/userData";
import { requestNotificationPermission } from "../lib/notifications";

export default function ProfileScreen({ user, profile, onSignOut }) {
  const [busy, setBusy] = useState(false);
  const translation = profile?.translation || "web";
  const translationName =
    TRANSLATIONS.find((t) => t.id === translation)?.name || translation;

  const toggleNotifications = async () => {
    if (busy) return;
    setBusy(true);
    const nowEnabled = !profile?.notificationsEnabled;
    if (nowEnabled) {
      const perm = await requestNotificationPermission();
      if (perm !== "granted") {
        setBusy(false);
        return;
      }
    }
    await updateProfile(user.uid, { notificationsEnabled: nowEnabled });
    setBusy(false);
  };

  const changeReminderTime = async (e) => {
    await updateProfile(user.uid, { reminderTime: e.target.value });
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">
      <div className="pt-2 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Profile
        </h1>
      </div>

      <div className="flex flex-col items-center mb-8">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="w-20 h-20 rounded-full mb-3 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-brand-purple flex items-center justify-center text-2xl font-bold text-white mb-3">
            {(user.displayName || user.email || "U")
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
        <p className="text-[17px] font-bold text-ink">
          {user.displayName || "Friend"}
        </p>
        <p className="text-[13px] text-ink-muted">{user.email}</p>
        <div className="flex items-center gap-1.5 mt-2 text-brand-orange text-sm font-semibold">
          <Zap size={14} fill="currentColor" />
          <span>{profile?.streak ?? 0} day streak</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-navy-card">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-navy-border">
          <Languages size={18} className="text-brand-purple shrink-0" />
          <span className="flex-1 text-[14px] text-ink">
            Preferred Translation
          </span>
          <span className="text-[13px] text-ink-muted">
            {translationName}
          </span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-navy-border">
          <Bell size={18} className="text-brand-purple shrink-0" />
          <span className="flex-1 text-[14px] text-ink">
            Daily Reminder
          </span>
          {profile?.notificationsEnabled && (
            <input
              type="time"
              value={profile.reminderTime || "07:00"}
              onChange={changeReminderTime}
              className="bg-navy-hover text-[13px] text-ink rounded-lg px-2 py-1 mr-2 outline-none"
            />
          )}
          <button
            onClick={toggleNotifications}
            disabled={busy}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              profile?.notificationsEnabled ? "bg-brand-orange" : "bg-navy-hover"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                profile?.notificationsEnabled
                  ? "translate-x-5"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-navy-border">
          <Moon size={18} className="text-brand-purple shrink-0" />
          <span className="flex-1 text-[14px] text-ink">Appearance</span>
          <span className="text-[13px] text-ink-muted">Dark</span>
          <ChevronRight size={16} className="text-ink-faint" />
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
          <Info size={18} className="text-brand-purple shrink-0" />
          <span className="flex-1 text-[14px] text-ink">About</span>
          <ChevronRight size={16} className="text-ink-faint" />
        </button>
      </div>

      <button
        onClick={onSignOut}
        className="w-full flex items-center justify-center gap-2 mt-4 py-3.5 rounded-2xl bg-navy-card text-red-400 text-[14px] font-semibold"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
