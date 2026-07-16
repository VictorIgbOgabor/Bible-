import { useEffect, useState } from "react";
import {
  Headphones,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchChapter, TRANSLATIONS } from "../lib/bibleApi";
import { nextChapterRef, prevChapterRef } from "../data/books";
import { markChapterRead } from "../lib/userData";
import TranslationSheet from "./TranslationSheet";
import BookChapterSheet from "./BookChapterSheet";

export default function BibleScreen({
  book,
  chapter,
  translation,
  uid,
  onNavigate,
  onTranslationChange,
}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [showTranslations, setShowTranslations] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    setMarked(false);
  }, [book, chapter]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchChapter(book, chapter, translation)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [book, chapter, translation]);

  const currentTranslation =
    TRANSLATIONS.find((t) => t.id === translation)?.short || translation;

  const goNext = () => {
    const ref = nextChapterRef(book, chapter);
    if (ref) onNavigate(ref.book, ref.chapter);
  };
  const goPrev = () => {
    const ref = prevChapterRef(book, chapter);
    if (ref) onNavigate(ref.book, ref.chapter);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0">
        <button
          onClick={() => setShowTranslations(true)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold bg-brand-purple text-white"
        >
          {currentTranslation}
        </button>
        <div className="flex items-center gap-5">
          <Headphones size={20} className="text-ink" />
          <Search size={20} className="text-ink" />
          <Settings size={20} className="text-ink" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 no-scrollbar">
        {status === "loading" && (
          <p className="text-ink-muted text-[15px] pt-8 text-center">
            Loading {book} {chapter}…
          </p>
        )}
        {status === "error" && (
          <p className="text-ink-muted text-[15px] pt-8 text-center leading-relaxed">
            Couldn't load this chapter. Check your connection and try again.
          </p>
        )}
        {status === "ready" && data && (
          <>
            <p className="text-[17px] leading-loose text-ink">
              {data.verses.map((v) => (
                <span key={v.number}>
                  <sup className="text-[11px] mr-1 text-ink-faint">
                    {v.number}
                  </sup>
                  {v.text}{" "}
                </span>
              ))}
            </p>

            <div className="flex justify-center my-6">
              <button
                onClick={async () => {
                  if (marked || !uid) return;
                  setMarked(true);
                  await markChapterRead(uid, `${book} ${chapter}`);
                }}
                disabled={marked}
                className="px-6 py-3 rounded-full text-[15px] font-semibold bg-brand-orange text-navy-bg disabled:opacity-60"
              >
                {marked ? "Marked as read ✓" : "Mark as read"}
              </button>
            </div>

            <p className="text-[11px] text-center leading-relaxed px-4 text-ink-faint">
              {data.translationName}
              {data.translationNote ? ` — ${data.translationNote}` : ""}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-navy-card"
        >
          <ChevronLeft size={18} className="text-ink" />
        </button>
        <button
          onClick={() => setShowBooks(true)}
          className="flex-1 h-10 rounded-full flex items-center justify-center bg-navy-card"
        >
          <span className="text-[14px] font-bold text-ink">
            {book} {chapter}
          </span>
        </button>
        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-navy-card"
        >
          <ChevronRight size={18} className="text-ink" />
        </button>
      </div>

      {showTranslations && (
        <TranslationSheet
          current={translation}
          onSelect={(id) => {
            onTranslationChange(id);
            setShowTranslations(false);
          }}
          onClose={() => setShowTranslations(false)}
        />
      )}
      {showBooks && (
        <BookChapterSheet
          currentBook={book}
          onSelect={(b, c) => {
            onNavigate(b, c);
            setShowBooks(false);
          }}
          onClose={() => setShowBooks(false)}
        />
      )}
    </div>
  );
}
