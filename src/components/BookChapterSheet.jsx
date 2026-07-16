import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { BOOKS } from "../data/books";

export default function BookChapterSheet({ currentBook, onSelect, onClose }) {
  const [pickedBook, setPickedBook] = useState(null);
  const book = pickedBook ? BOOKS.find((b) => b.name === pickedBook) : null;

  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-navy-card rounded-t-3xl max-h-[80%] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-navy-border">
          <div className="flex items-center gap-2">
            {book && (
              <button onClick={() => setPickedBook(null)}>
                <ChevronLeft size={20} className="text-ink-muted" />
              </button>
            )}
            <h2 className="text-[17px] font-bold text-ink">
              {book ? book.name : "Books"}
            </h2>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-ink-muted" />
          </button>
        </div>

        {!book ? (
          <div className="overflow-y-auto no-scrollbar px-3 py-2">
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-brand-purple uppercase tracking-wide">
              Old Testament
            </p>
            {BOOKS.filter((b) => b.testament === "OT").map((b) => (
              <button
                key={b.name}
                onClick={() => setPickedBook(b.name)}
                className={`w-full text-left px-3 py-3 rounded-xl hover:bg-navy-hover text-[15px] ${
                  b.name === currentBook
                    ? "text-brand-orange font-semibold"
                    : "text-ink"
                }`}
              >
                {b.name}
              </button>
            ))}
            <p className="px-3 pt-3 pb-1 text-[11px] font-semibold text-brand-purple uppercase tracking-wide">
              New Testament
            </p>
            {BOOKS.filter((b) => b.testament === "NT").map((b) => (
              <button
                key={b.name}
                onClick={() => setPickedBook(b.name)}
                className={`w-full text-left px-3 py-3 rounded-xl hover:bg-navy-hover text-[15px] ${
                  b.name === currentBook
                    ? "text-brand-orange font-semibold"
                    : "text-ink"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto no-scrollbar px-4 py-4 grid grid-cols-5 gap-2">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  onClick={() => onSelect(book.name, n)}
                  className="aspect-square rounded-xl bg-navy-hover flex items-center justify-center text-[15px] font-semibold text-ink"
                >
                  {n}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
