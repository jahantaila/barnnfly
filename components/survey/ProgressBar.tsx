"use client";

import { motion } from "framer-motion";
import { STEP_LABELS, STEP_ORDER, type StepId } from "@/lib/survey-config";

export function ProgressBar({ current }: { current: StepId }) {
  const total = STEP_ORDER.length - 1; // exclude intro from progress
  const idx = Math.max(0, STEP_ORDER.indexOf(current));
  const pct = current === "intro" ? 0 : ((idx) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-derby-ink/60 mb-3">
        <span>
          Step {current === "intro" ? 0 : idx} / {total}
        </span>
        <span className="hidden sm:inline">{STEP_LABELS[current]}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-derby-line overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-derby"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
