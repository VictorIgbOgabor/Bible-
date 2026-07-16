import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { watchNotes, addNote, deleteNote } from "../lib/userData";

export default function NotesSheet({ uid, reference, onClose }) {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!uid) return;
    return watchNotes(uid, setNotes);
  }, [uid]);

  const submit = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await addNote(uid, reference, text);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-navy-card rounded-t-3xl max-h-[85%] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-navy-border shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-ink">Notes</h2>
            <p className="text-[12px] text-ink-muted">{reference}</p>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-ink-muted" />
          </button>
        </div>

        <div className="px-5 pt-4 shrink-0">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write what stood out to you…"
            rows={3}
            className="w-full bg-navy-hover rounded-2xl px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint outline-none resize-none"
          />
          <button
            onClick={submit}
            className="w-full mt-2 py-2.5 rounded-full text-[14px] font-semibold bg-brand-purple text-white"
          >
            Save Note
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-2">
          {notes.length === 0 && (
            <p className="text-ink-faint text-[13px] text-center py-4">
              No notes yet.
            </p>
          )}
          {notes.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 bg-navy-hover rounded-xl px-3 py-3"
            >
              <div className="flex-1">
                <p className="text-[11px] text-brand-orange font-semibold mb-1">
                  {n.reference}
                </p>
                <p className="text-[14px] text-ink leading-relaxed">
                  {n.text}
                </p>
              </div>
              <button onClick={() => deleteNote(uid, n.id)} className="mt-0.5">
                <Trash2 size={16} className="text-ink-faint" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
