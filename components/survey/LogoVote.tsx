"use client";

import Image from "next/image";
import { useState } from "react";
import { LOGO_CONCEPTS } from "@/lib/survey-config";

type Vote = "love" | "like" | "pass" | null;

export function LogoVote({
  votes,
  favorite,
  feedback,
  onVote,
  onFavorite,
  onFeedback,
}: {
  votes: Record<string, Vote>;
  favorite: string | null;
  feedback: string;
  onVote: (id: string, v: Vote) => void;
  onFavorite: (id: string | null) => void;
  onFeedback: (text: string) => void;
}) {
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LOGO_CONCEPTS.map((c) => {
          const v = votes[c.id] ?? null;
          const isFav = favorite === c.id;
          const errored = imgError[c.id];
          return (
            <div
              key={c.id}
              className={`card overflow-hidden flex flex-col transition-all ${
                isFav ? "ring-4 ring-derby ring-offset-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] bg-derby-mist border-b border-derby-line flex items-center justify-center">
                {errored ? (
                  <div className="flex flex-col items-center gap-2 text-derby-ink/40 text-center p-6">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-10 w-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 16l5-5 4 4 3-3 6 6" />
                      <circle cx="9" cy="9" r="1.5" />
                    </svg>
                    <span className="text-xs uppercase tracking-[0.14em] font-semibold">
                      {c.caption}
                    </span>
                    <span className="text-[11px] text-derby-ink/40">
                      Drop logo into <code>/public/logos/{c.id}.png</code>
                    </span>
                  </div>
                ) : (
                  <Image
                    src={c.src}
                    alt={c.caption}
                    fill
                    className="object-contain p-6"
                    onError={() =>
                      setImgError((s) => ({ ...s, [c.id]: true }))
                    }
                  />
                )}
                {isFav && (
                  <div className="absolute top-3 right-3 chip chip-blue">
                    ★ Favorite
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-derby-ink/60">
                    {c.caption}
                  </span>
                  <button
                    type="button"
                    onClick={() => onFavorite(isFav ? null : c.id)}
                    className={`text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full transition-all ${
                      isFav
                        ? "bg-derby text-white"
                        : "bg-derby-mist text-derby-ink hover:bg-derby-soft hover:text-derby"
                    }`}
                  >
                    {isFav ? "★ Top Pick" : "Mark favorite"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "love", label: "Love", emoji: "♥" },
                      { v: "like", label: "Like", emoji: "👍" },
                      { v: "pass", label: "Pass", emoji: "⏭" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => onVote(c.id, v === opt.v ? null : opt.v)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                        v === opt.v
                          ? opt.v === "love"
                            ? "bg-derby text-white border-derby"
                            : opt.v === "like"
                            ? "bg-derby-ink text-white border-derby-ink"
                            : "bg-derby-ink/5 text-derby-ink/50 border-derby-line"
                          : "bg-white border-derby-line text-derby-ink/70 hover:border-derby"
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <label className="block text-sm font-semibold text-derby-ink mb-2">
          What did you like or want to change about the concepts?
        </label>
        <textarea
          className="textarea min-h-[120px]"
          placeholder="e.g., I love the wings on concept 2 but want the font to feel bolder..."
          value={feedback}
          onChange={(e) => onFeedback(e.target.value)}
        />
      </div>
    </div>
  );
}
