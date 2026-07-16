import { useEffect, useState } from "react";
import { X, Check, Trash2 } from "lucide-react";
import {
  watchPrayers,
  addPrayer,
  togglePrayerAnswered,
  deletePrayer,
} from "../lib/userData";

const TODAYS_PRAYER = {
  title: "A Prayer for a Changed Life",
  body: "Lord, clothe me today with compassion, kindness, humility, gentleness, and patience. Where I am quick to react, slow me down. Where I hold onto pride, humble me. Shape my heart to look more like Christ's, one small choice at a time. Amen.",
};

export default function PrayerSheet({ uid, onClose }) {
  const [prayers, setPrayers] = useState([]);
  const [draft, setDraft] = useState("");
  const [prayed, setPrayed] = useState(false);

  useEffect(() => {
    if (!uid) return;
    return watchPrayers(uid, setPrayers);
  }, [uid]);

  const submit = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await addPrayer(uid, text);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-navy-card rounded-t-3xl max-h-[85%] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-navy-border shrink-0">
          <h2 className="text-[17px] font-bold text-ink">Prayer</h2>
          <button onClick={onClose}>
            <X size={20} className="text-ink-muted" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar px-5 py-4">
          <p className="text-[13px] font-semibold text-brand-orange mb-2">
            {TODAYS_PRAYER.title}
          </p>
          <p className="text-[15px] leading-relaxed text-ink mb-4">
            {TODAYS_PRAYER.body}
          </p>
          <button
            onClick={() => setPrayed(true)}
            disabled={prayed}
            className="w-full py-3 rounded-full text-[14px] font-semibold bg-brand-orange text-navy-bg disabled:opacity-50 mb-6"
          >
            {prayed ? "Amen ✓" : "Amen, I prayed this"}
          </button>

          <p className="text-[13px] font-semibold text-brand-purple mb-3">
            My Prayer Requests
          </p>

          <div className="flex gap-2 mb-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a prayer request…"
              className="flex-1 bg-navy-hover rounded-full px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-faint outline-none"
            />
            <button
              onClick={submit}
              className="px-4 rounded-full bg-brand-purple text-white text-[14px] font-semibold"
            >
              Add
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {prayers.length === 0 && (
              <p className="text-ink-faint text-[13px] text-center py-4">
                No prayer requests yet.
              </p>
            )}
            {prayers.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-navy-hover rounded-xl px-3 py-3"
              >
                <button
                  onClick={() => togglePrayerAnswered(uid, p.id, !p.answered)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    p.answered
                      ? "bg-brand-orange"
                      : "border border-ink-faint"
                  }`}
                >
                  {p.answered && <Check size={14} className="text-navy-bg" />}
                </button>
                <span
                  className={`flex-1 text-[14px] ${
                    p.answered
                      ? "text-ink-faint line-through"
                      : "text-ink"
                  }`}
                >
                  {p.text}
                </span>
                <button onClick={() => deletePrayer(uid, p.id)}>
                  <Trash2 size={16} className="text-ink-faint" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
