"use client";

import { motion } from "framer-motion";
import { DerbyBadge } from "@/components/DerbyBadge";

/**
 * Typography-first hero.
 * - Headline dominates (no competing 3D mesh behind the text)
 * - Paw-print trail animates in sequentially
 * - A paper-airplane SVG follows the trail (because this is Bark & FLY)
 * - Stacks cleanly on mobile: one column, everything scales to viewport
 */
export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex-1 relative overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 md:px-10 pt-8 sm:pt-12 md:pt-16 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-5 sm:gap-6"
        >
          <DerbyBadge variant="inline" />

          <h1 className="display text-derby-ink text-[clamp(2.6rem,10vw,6.5rem)] leading-[0.92]">
            Help us pick
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            the <span className="text-derby">Bark &amp; Fly</span>
            <br />
            logo.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-derby-ink/70 leading-relaxed max-w-2xl">
            We&apos;re launching a pet resort and we want your eye. Rate the
            concepts, pick your favorite, and tell us the vibe. Takes about
            3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2 w-full sm:w-auto">
            <button
              className="btn-primary w-full sm:w-auto justify-center"
              onClick={onStart}
            >
              Start rating →
            </button>
            <span className="text-sm text-derby-ink/60">
              4 steps · ~3 minutes · auto-saves
            </span>
          </div>
        </motion.div>

        {/* Paw trail + airplane — full-width decorative band */}
        <PawTrail />

        {/* Feature row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        >
          {[
            {
              num: "01",
              label: "Rate 5 logo sets",
              desc: "5 stars per set, jot a quick thought.",
            },
            {
              num: "02",
              label: "Pick your favorite",
              desc: "One logo to rule them all.",
            },
            {
              num: "03",
              label: "Call the vibe",
              desc: "What should the brand feel like?",
            },
          ].map((row) => (
            <div key={row.num} className="card p-5 flex gap-4 items-start">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-derby">
                {row.num}
              </span>
              <div>
                <div className="font-bold text-derby-ink">{row.label}</div>
                <div className="text-sm text-derby-ink/60 mt-0.5">
                  {row.desc}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

// Paw + airplane decorative trail: paws fade in in sequence along a curve,
// airplane glides in last. Absolutely positioned on desktop, becomes its own
// compact band on mobile so it never competes with the headline.
function PawTrail() {
  const paws = [
    { x: "8%", y: 10, rotate: 18, scale: 0.9, delay: 0.55 },
    { x: "22%", y: 42, rotate: -8, scale: 1.0, delay: 0.7 },
    { x: "37%", y: 6, rotate: 22, scale: 0.95, delay: 0.85 },
    { x: "52%", y: 38, rotate: -12, scale: 1.0, delay: 1.0 },
    { x: "66%", y: 8, rotate: 18, scale: 0.9, delay: 1.15 },
  ];

  return (
    <div
      className="relative mt-8 sm:mt-10 h-28 sm:h-32"
      aria-hidden
    >
      {paws.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: p.delay, duration: 0.45, ease: "easeOut" }}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            transform: `rotate(${p.rotate}deg) scale(${p.scale})`,
          }}
        >
          <PawSVG className="h-9 w-9 sm:h-11 sm:w-11 text-derby/80" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -30, y: 20, rotate: -18 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
        transition={{ delay: 1.35, duration: 0.7, ease: "easeOut" }}
        className="absolute right-[4%] sm:right-[6%] top-0"
      >
        <PlaneSVG className="h-20 w-20 sm:h-28 sm:w-28 text-derby-ink" />
      </motion.div>
    </div>
  );
}

function PawSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main pad */}
      <path d="M32 58c-8 0-14-5.2-14-11.5 0-5.5 5.6-10.8 14-10.8s14 5.3 14 10.8C46 52.8 40 58 32 58z" />
      {/* Four toes */}
      <ellipse cx="16" cy="26" rx="5.2" ry="7.4" transform="rotate(-20 16 26)" />
      <ellipse cx="26" cy="14" rx="5.2" ry="7.8" transform="rotate(-6 26 14)" />
      <ellipse cx="38" cy="14" rx="5.2" ry="7.8" transform="rotate(6 38 14)" />
      <ellipse cx="48" cy="26" rx="5.2" ry="7.4" transform="rotate(20 48 26)" />
    </svg>
  );
}

function PlaneSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paper-airplane silhouette */}
      <path
        d="M12 60 L108 22 L86 104 L62 70 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M62 70 L108 22 L70 80 Z"
        fill="currentColor"
        opacity="0.65"
      />
      {/* Fold line */}
      <path
        d="M62 70 L108 22"
        stroke="white"
        strokeWidth="1.2"
        opacity="0.6"
      />
    </svg>
  );
}
