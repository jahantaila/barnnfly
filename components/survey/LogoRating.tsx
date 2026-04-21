"use client";

import Image from "next/image";
import { useState } from "react";
import { LOGO_CONCEPTS, type LogoRating, type SurveyData } from "@/lib/survey-config";

export function LogoRatingStep({
  ratings,
  favoriteConceptId,
  onRate,
  onNote,
  onFavorite,
}: {
  ratings: SurveyData["ratings"];
  favoriteConceptId: string | null;
  onRate: (conceptId: string, stars: number) => void;
  onNote: (conceptId: string, note: string) => void;
  onFavorite: (conceptId: string | null) => void;
}) {
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-4">
      {LOGO_CONCEPTS.map((c, idx) => {
        const rating: LogoRating = ratings[c.id] ?? { stars: 0, note: "" };
        const isFav = favoriteConceptId === c.id;
        const errored = imgError[c.id];
        return (
          <div
            key={c.id}
            className={`card overflow-hidden transition-all ${
              isFav ? "ring-4 ring-derby ring-offset-2" : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto md:min-h-[320px] bg-derby-mist border-b md:border-b-0 md:border-r border-derby-line flex items-center justify-center">
                {errored ? (
                  <div className="flex flex-col items-center gap-2 text-derby-ink/40 text-center p-6">
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
                      {c.label}
                    </span>
                    <span className="text-[11px] text-derby-ink/40 font-mono">
                      /public/logos/{c.id}.png
                    </span>
                  </div>
                ) : (
                  <Image
                    src={c.src}
                    alt={c.label}
                    fill
                    className="object-contain p-8"
                    onError={() =>
                      setImgError((s) => ({ ...s, [c.id]: true }))
                    }
                  />
                )}
                {isFav && (
                  <div className="absolute top-4 right-4 chip chip-blue shadow-lg">
                    ★ Favorite
                  </div>
                )}
                <div className="absolute top-4 left-4 chip">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Rating controls */}
              <div className="p-6 md:p-8 flex flex-col gap-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-derby-ink/60 mb-2">
                    Your rating
                  </div>
                  <StarInput
                    value={rating.stars}
                    onChange={(v) => onRate(c.id, v)}
                  />
                  <div className="mt-2 text-sm text-derby-ink/60 min-h-[1.2em]">
                    {STAR_LABELS[rating.stars] ?? "Tap a star to rate"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-derby-ink mb-2">
                    Quick thought (optional)
                  </label>
                  <textarea
                    value={rating.note}
                    onChange={(e) => onNote(c.id, e.target.value)}
                    placeholder="What do you like or want to change?"
                    className="textarea min-h-[80px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onFavorite(isFav ? null : c.id)}
                  className={`h-11 px-5 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all ${
                    isFav
                      ? "bg-derby text-white hover:bg-derby-ink"
                      : "bg-derby-mist text-derby-ink hover:bg-derby-soft hover:text-derby"
                  }`}
                >
                  {isFav ? "★ Your favorite" : "Make this my favorite"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
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
              className={`h-9 w-9 transition-colors ${
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
