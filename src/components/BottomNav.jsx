import { Sun, BookOpen, Map, User } from "lucide-react";

const ITEMS = [
  { key: "today", label: "Today", icon: Sun },
  { key: "bible", label: "Bible", icon: BookOpen },
  { key: "guides", label: "Guides", icon: Map },
  { key: "profile", label: "Profile", icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div className="flex items-center justify-around pt-2 pb-[max(env(safe-area-inset-bottom),1.25rem)] border-t border-navy-border bg-navy-bg shrink-0">
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.4 : 1.8}
              className={isActive ? "text-brand-orange" : "text-ink-faint"}
            />
            <span
              className={`text-[11px] ${
                isActive ? "text-brand-orange font-semibold" : "text-ink-faint"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
