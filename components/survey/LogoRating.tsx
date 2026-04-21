"use client";

import Image from "next/image";
import { useState } from "react";
import {
  LOGO_CONCEPTS,
  type LogoRating,
  type SurveyData,
} from "@/lib/survey-config";

type OnRate = (conceptId: string, stars: number) => void;
type OnField = (conceptId: string, value: string) => void;
type OnFavorite = (conceptId: string | null) => void;

export function LogoRatingStep({
  ratings,
  favoriteConceptId,
  onRate,
  onNote,
  onVariant,
  onFavorite,
}: {
  ratings: SurveyData["ratings"];
  favoriteConceptId: string | null;
  onRate: OnRate;
  onNote: OnField;
  onVariant: OnField;
  onFavorite: OnFavorite;
}) {
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-6">
      {LOGO_CONCEPTS.map((c, idx) => {
        const rating: LogoRating =
          ratings[c.id] ?? { stars: 0, note: "", preferredVariant: "" };
        const isFav = favoriteConceptId === c.id;
        const errored = imgError[c.id];
        const hasMultiple = c.variantCount > 1;
        return (
          <div
            key={c.id}
            className={`card overflow-hidden transition-all ${
              isFav ? "ring-4 ring-derby ring-offset-2" : ""
            }`}
          >
            {/* Header — chips always wrap on their own row above title so
                mobile (narrow) never squeezes the title into the badges. */}
            <div className="flex flex-col gap-3 p-5 sm:p-6 border-b border-derby-line">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {c.teamPick && (
                  <span className="chip bg-derby-ink text-white border-transparent">
                    ★ {c.teamPick}&apos;s pick
                  </span>
                )}
                {isFav && (
                  <span className="chip chip-blue">★ Your favorite</span>
                )}
              </div>
              <div>
                <div className="font-bold text-derby-ink text-lg leading-tight">
                  {c.label}
                </div>
                {c.description && (
                  <div className="text-sm text-derby-ink/60 mt-1.5 max-w-2xl leading-relaxed">
                    {c.description}
                  </div>
                )}
              </div>
            </div>

            {/* Big image — full card width, no height cap. On mobile,
                multi-variant sheets get a horizontal-scroll container so
                each sub-logo stays readable even when a single sheet packs
                3–4 logos side-by-side. */}
            <div className="relative w-full bg-derby-mist border-b border-derby-line">
              {errored ? (
                <div className="aspect-[16/9] flex flex-col items-center justify-center gap-2 text-derby-ink/40 text-center p-6">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" />
                    <circle cx="9" cy="9" r="1.5" />
                  </svg>
                  <span className="text-xs uppercase tracking-[0.14em] font-bold">
                    Image missing
                  </span>
                  <span className="text-[11px] text-derby-ink/40 font-mono">
                    {c.src}
                  </span>
                </div>
              ) : hasMultiple ? (
                // Multi-variant sheets: block scroll container on mobile
                // (flex + justify-center was hijacking overflow scrolling).
                // On sm+ the image fits full card width and scrolling is off.
                <div className="relative w-full overflow-x-auto sm:overflow-visible overscroll-x-contain touch-pan-x">
                  <div className="p-3 sm:p-6 inline-block sm:block align-top min-w-full">
                    <Image
                      src={c.src}
                      alt={c.label}
                      width={2400}
                      height={1800}
                      priority={idx < 2}
                      className={`block h-auto max-w-none sm:w-full sm:max-w-full ${variantWidthClass(
                        c.variantCount
                      )}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 92vw, 1300px"
                      onError={() =>
                        setImgError((s) => ({ ...s, [c.id]: true }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="relative w-full flex items-center justify-center p-3 sm:p-6">
                  <Image
                    src={c.src}
                    alt={c.label}
                    width={2400}
                    height={1800}
                    priority={idx < 2}
                    className="w-full h-auto max-w-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 92vw, 1300px"
                    onError={() =>
                      setImgError((s) => ({ ...s, [c.id]: true }))
                    }
                  />
                </div>
              )}
              {hasMultiple && (
                <div className="absolute top-4 right-4 chip bg-derby-ink text-white border-transparent shadow-lg">
                  {c.variantCount} variants
                </div>
              )}
              {hasMultiple && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden chip text-[10px] bg-white/90 shadow-md">
                  ← swipe to see each logo →
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-5 sm:p-8 flex flex-col gap-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-derby-ink/60 mb-2">
                  How much do you like this set?
                </div>
                <StarInput
                  value={rating.stars}
                  onChange={(v) => onRate(c.id, v)}
                />
                <div className="mt-2 text-sm text-derby-ink/60 min-h-[1.2em]">
                  {STAR_LABELS[rating.stars] ?? "Tap a star to rate"}
                </div>
              </div>

              {hasMultiple && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-derby-ink">
                    Which version did you like best?
                    <span className="text-derby-ink/50 font-normal">
                      {" "}
                      (describe it — "the one with palm trees", "left", "the
                      circular badge", etc.)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={rating.preferredVariant}
                    onChange={(e) => onVariant(c.id, e.target.value)}
                    placeholder="e.g., the middle one, top-left, the banner style…"
                    className="input"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-derby-ink">
                  What worked or didn&apos;t?
                  <span className="text-derby-ink/50 font-normal">
                    {" "}
                    (optional — color, font, illustration, vibe…)
                  </span>
                </label>
                <textarea
                  value={rating.note}
                  onChange={(e) => onNote(c.id, e.target.value)}
                  placeholder="e.g., 'Love the dog but the text feels dated' or 'The green-gold combo is perfect'"
                  className="textarea min-h-[100px]"
                />
              </div>

              <button
                type="button"
                onClick={() => onFavorite(isFav ? null : c.id)}
                className={`h-12 px-5 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all self-start ${
                  isFav
                    ? "bg-derby text-white hover:bg-derby-ink"
                    : "bg-derby-mist text-derby-ink hover:bg-derby-soft hover:text-derby"
                }`}
              >
                {isFav
                  ? "★ This is my overall favorite"
                  : "Make this my overall favorite"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Tailwind-literal width classes so JIT picks them up at build time.
// Target ~230-260px per sub-logo on mobile; desktop (sm+) falls back to w-full.
function variantWidthClass(count: number): string {
  if (count === 2) return "w-[520px]";
  if (count === 3) return "w-[720px]";
  return "w-[880px]"; // 4+ variants
}

const STAR_LABELS: Record<number, string> = {
  0: "Tap a star to rate",
  1: "Not a fan",
  2: "Meh",
  3: "It's okay",
  4: "I like it!",
  5: "Love it — 10/10",
};

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div
      className="flex gap-1.5"
      onMouseLeave={() => setHover(null)}
      role="radiogroup"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= display;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(value === i ? 0 : i)}
            className="p-1 -m-1 transition-transform hover:scale-110"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-10 w-10 sm:h-11 sm:w-11 transition-colors ${
                filled ? "text-derby" : "text-derby-line"
              }`}
              fill="currentColor"
            >
              <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
