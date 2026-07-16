import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { startPlan, advancePlan, watchPlans } from "../lib/userData";

const PLANS = [
  {
    id: "changed-life",
    title: "A Prayer for a Changed Life",
    days: 5,
    bg: "#FF8A3D22",
    emoji: "🙏",
  },
  {
    id: "foundations",
    title: "Foundations of Faith",
    days: 7,
    bg: "#9B6BFF22",
    emoji: "🕊️",
  },
  {
    id: "patience",
    title: "Walking in Patience",
    days: 3,
    bg: "#2FBF8F22",
    emoji: "🌱",
  },
  {
    id: "epistles",
    title: "Letters to the Early Church",
    days: 14,
    bg: "#FF8A3D22",
    emoji: "✉️",
  },
  {
    id: "psalms-anxious",
    title: "Psalms for Anxious Hearts",
    days: 10,
    bg: "#9B6BFF22",
    emoji: "💭",
  },
];

export default function GuidesScreen({ uid }) {
  const [plans, setPlans] = useState({});

  useEffect(() => {
    if (!uid) return;
    return watchPlans(uid, setPlans);
  }, [uid]);

  const handlePress = (plan) => {
    const existing = plans[plan.id];
    if (!existing) {
      startPlan(uid, plan.id, plan.title);
    } else if (!existing.completed) {
      advancePlan(uid, plan.id, (existing.progress || 0) + 1, plan.days);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">
      <div className="pt-2 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Guides</h1>
        <p className="text-[13px] text-ink-muted mt-1">
          Reading plans and devotionals to grow with
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PLANS.map((p) => {
          const progress = plans[p.id];
          return (
            <button
              key={p.id}
              onClick={() => handlePress(p)}
              className="flex items-center gap-4 p-3.5 rounded-2xl text-left bg-navy-card"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: p.bg }}
              >
                {progress?.completed ? (
                  <Check size={22} className="text-brand-orange" />
                ) : (
                  p.emoji
                )}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[15px] font-semibold text-ink">
                  {p.title}
                </span>
                <span className="text-[13px] text-ink-muted">
                  {progress?.completed
                    ? "Completed"
                    : progress
                    ? `Day ${progress.progress} of ${p.days} · tap to continue`
                    : `${p.days} Day Plan · tap to start`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
