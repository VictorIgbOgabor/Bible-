import { useEffect, useState } from "react";
import { Sun, Share2, PenLine, Zap } from "lucide-react";
import { fetchVerse } from "../lib/bibleApi";
import { verseRefForDate } from "../data/memoryVerses";
import NotesSheet from "./NotesSheet";
import PrayerSheet from "./PrayerSheet";

const VERSE_OF_DAY_REF = verseRefForDate();

export default function TodayScreen({
  translation,
  userName,
  uid,
  profile,
  onGoTo,
}) {
  const [verse, setVerse] = useState(null);
  const [status, setStatus] = useState("loading");
  const [showNotes, setShowNotes] = useState(false);
  const [showPrayer, setShowPrayer] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchVerse(VERSE_OF_DAY_REF, translation)
      .then((res) => {
        if (!cancelled) {
          setVerse(res);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [translation]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleShare = async () => {
    const text = verse ? `${verse.reference} — ${verse.text}` : "Verses app";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Verse of the Day", text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      setToast("Copied to clipboard");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar relative">
      <div className="flex items-center justify-between pt-2 pb-6">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
          <Zap size={16} fill="currentColor" />
          <span>{profile?.streak ?? 0}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Today</h1>
        <div className="w-8" />
      </div>

      <div className="flex items-center gap-2 mb-5">
        <Sun size={18} className="text-brand-purple" />
        <span className="text-[15px] font-semibold text-ink">
          Good Morning, {userName}
        </span>
      </div>

      {status === "ready" && verse && (
        <>
          <p className="text-sm font-semibold mb-3 text-brand-orange capitalize">
            {verse.reference}
          </p>
          <p className="text-[19px] leading-relaxed mb-6 text-ink">
            {verse.text}
          </p>
        </>
      )}
      {status === "loading" && (
        <p className="text-ink-muted text-[15px] mb-6">Loading verse…</p>
      )}
      {status === "error" && (
        <p className="text-ink-muted text-[15px] mb-6">
          Couldn't load today's verse.
        </p>
      )}

      <div className="flex items-center justify-center gap-10 mb-8">
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-navy-card">
            <Share2 size={18} className="text-ink" />
          </div>
          <span className="text-[12px] text-ink-muted">Share</span>
        </button>
        <button
          onClick={() => setShowNotes(true)}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-navy-card">
            <PenLine size={18} className="text-ink" />
          </div>
          <span className="text-[12px] text-ink-muted">Note</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <Card
          emoji="🙏"
          bg="#FF8A3D22"
          title="Today's Prayer"
          subtitle="A Prayer for a Changed Life"
          onClick={() => setShowPrayer(true)}
        />
        <Card
          emoji="📖"
          bg="#9B6BFF22"
          title="Memorize Verse"
          subtitle={verse?.reference || "Loading…"}
        />
        <Card
          emoji="📘"
          bg="#2FBF8F22"
          title="Continue Reading"
          subtitle="Titus 2"
          onClick={() => onGoTo("bible")}
        />
      </div>

      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy-hover text-ink text-[13px] px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {showNotes && (
        <NotesSheet
          uid={uid}
          reference={verse?.reference || "Colossians 3:12"}
          onClose={() => setShowNotes(false)}
        />
      )}
      {showPrayer && (
        <PrayerSheet uid={uid} onClose={() => setShowPrayer(false)} />
      )}
    </div>
  );
}

function Card({ emoji, bg, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-3.5 rounded-2xl text-left bg-navy-card"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: bg }}
      >
        {emoji}
      </div>
      <div className="flex flex-col">
        <span className="text-[15px] font-semibold text-ink">{title}</span>
        <span className="text-[13px] text-ink-muted">{subtitle}</span>
      </div>
    </button>
  );
}
