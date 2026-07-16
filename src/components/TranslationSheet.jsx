import { X, Check } from "lucide-react";
import { TRANSLATIONS } from "../lib/bibleApi";

export default function TranslationSheet({ current, onSelect, onClose }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-navy-card rounded-t-3xl max-h-[75%] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-navy-border">
          <h2 className="text-[17px] font-bold text-ink">Translations</h2>
          <button onClick={onClose}>
            <X size={20} className="text-ink-muted" />
          </button>
        </div>
        <div className="overflow-y-auto no-scrollbar px-3 py-2">
          {TRANSLATIONS.map((t) => {
            const isActive = t.id === current;
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className="w-full flex items-center justify-between px-3 py-3.5 rounded-xl hover:bg-navy-hover text-left"
              >
                <div>
                  <div className="text-[15px] font-semibold text-ink">
                    {t.short}
                  </div>
                  <div className="text-[13px] text-ink-muted">{t.name}</div>
                </div>
                {isActive && <Check size={18} className="text-brand-orange" />}
              </button>
            );
          })}
        </div>
        <p className="px-5 pb-5 pt-1 text-[11px] text-ink-faint leading-relaxed">
          Public-domain translations, fetched live. Want NIV or ESV? Those
          require a free licensed API key — see the README.
        </p>
      </div>
    </div>
  );
}
