"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DerbyBadge } from "@/components/DerbyBadge";
import { Hero } from "@/components/Hero";
import { ProgressBar } from "./ProgressBar";
import { StepShell } from "./StepShell";
import { OptionGrid } from "./OptionGrid";
import { LogoRatingStep } from "./LogoRating";
import {
  DEFAULT_DATA,
  LOGO_CONCEPTS,
  RELATIONSHIP_OPTIONS,
  STEP_ORDER,
  VIBE_OPTIONS,
  type StepId,
  type SurveyData,
} from "@/lib/survey-config";

const STORAGE_KEY = "barknfly_survey_v2";

function toggleInList(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function getRating(data: SurveyData, id: string) {
  return (
    data.ratings[id] ?? { stars: 0, note: "", preferredVariant: "" }
  );
}

export function SurveyContainer() {
  const [step, setStep] = useState<StepId>("intro");
  const [data, setData] = useState<SurveyData>(DEFAULT_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...DEFAULT_DATA, ...JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, hydrated]);

  const stepIdx = STEP_ORDER.indexOf(step);
  const isFirst = stepIdx <= 0;
  const isLast = step === "review";

  const update = <K extends keyof SurveyData>(key: K, value: SurveyData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const go = (dir: 1 | -1) => {
    const next = STEP_ORDER[stepIdx + dir];
    if (next) {
      setStep(next);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const ratedCount = useMemo(
    () =>
      Object.values(data.ratings).filter((r) => r && r.stars > 0).length,
    [data.ratings]
  );

  const canProceed = useMemo(() => {
    switch (step) {
      case "intro":
        return true;
      case "about-you":
        return data.fullName.trim().length > 1 && data.relationship.length > 0;
      case "rate-logos":
        return ratedCount >= 1; // at least one logo rated
      case "vibe":
        return data.vibes.length >= 1;
      case "review":
        return true;
    }
  }, [step, data, ratedCount]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <ThankYou />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      {step === "intro" ? (
        <Hero onStart={() => setStep("about-you")} />
      ) : (
        <main className={`flex-1 w-full ${step === "rate-logos" ? "max-w-6xl" : "max-w-4xl"} mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-14 relative z-10`}>
          <div className="mb-8">
            <ProgressBar current={step} />
          </div>

          <div className={`card ${step === "rate-logos" ? "p-4 sm:p-6" : "p-6 sm:p-10"}`}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {step === "about-you" && (
                <StepShell
                  eyebrow="Step 01 · Say hi"
                  title="First, who's"
                  titleAccent="rating?"
                  subtitle="We're asking friends, family, and pet people to help us pick the Bark & Fly logo. Takes ~3 minutes."
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Your name"
                      required
                      value={data.fullName}
                      onChange={(v) => update("fullName", v)}
                      placeholder="Taylor"
                    />
                    <Field
                      label="Email (optional)"
                      type="email"
                      value={data.email}
                      onChange={(v) => update("email", v)}
                      placeholder="In case we want to follow up"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>How do you know us?</Label>
                    <OptionGrid
                      options={RELATIONSHIP_OPTIONS}
                      selected={data.relationship ? [data.relationship] : []}
                      onToggle={(v) =>
                        update(
                          "relationship",
                          v === data.relationship ? "" : v
                        )
                      }
                      multi={false}
                      cols={3}
                    />
                  </div>
                </StepShell>
              )}

              {step === "rate-logos" && (
                <StepShell
                  eyebrow={`Step 02 · Rate the logos (${ratedCount}/${LOGO_CONCEPTS.length})`}
                  title="Rate every"
                  titleAccent="logo."
                  subtitle="Give each concept 1–5 stars. Leave a quick thought if you feel like it. Then tap ★ on your favorite."
                >
                  <LogoRatingStep
                    ratings={data.ratings}
                    favoriteConceptId={data.favoriteConceptId}
                    onRate={(id, stars) =>
                      update("ratings", {
                        ...data.ratings,
                        [id]: { ...getRating(data, id), stars },
                      })
                    }
                    onNote={(id, note) =>
                      update("ratings", {
                        ...data.ratings,
                        [id]: { ...getRating(data, id), note },
                      })
                    }
                    onVariant={(id, preferredVariant) =>
                      update("ratings", {
                        ...data.ratings,
                        [id]: { ...getRating(data, id), preferredVariant },
                      })
                    }
                    onFavorite={(id) => update("favoriteConceptId", id)}
                  />
                </StepShell>
              )}

              {step === "vibe" && (
                <StepShell
                  eyebrow="Step 03 · Vibe check"
                  title="What should the"
                  titleAccent="brand feel like?"
                  subtitle="Pick at least one. Pairs work great — 'playful + premium' says a lot."
                >
                  <OptionGrid
                    options={VIBE_OPTIONS}
                    selected={data.vibes}
                    onToggle={(v) =>
                      update("vibes", toggleInList(data.vibes, v))
                    }
                    cols={3}
                  />
                  <TextArea
                    label="If you were naming a pet resort, what would you call it? (optional)"
                    value={data.nameSuggestion}
                    onChange={(v) => update("nameSuggestion", v)}
                    placeholder="Bark & Fly is the current name — but if you've got a better one, we want to hear it."
                  />
                  <TextArea
                    label="Anything else we should know?"
                    value={data.anythingElse}
                    onChange={(v) => update("anythingElse", v)}
                    placeholder="Designs you love, brands that inspire, wild ideas…"
                  />
                </StepShell>
              )}

              {step === "review" && (
                <StepShell
                  eyebrow="Step 04 · Review"
                  title="That's it."
                  titleAccent="Lock it in?"
                  subtitle="Here's your feedback. Hit submit and we'll factor it into the final pick."
                >
                  <ReviewSummary data={data} />
                </StepShell>
              )}
            </motion.div>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-derby-line pt-6">
              <button
                type="button"
                className="btn-ghost disabled:opacity-40"
                onClick={() => go(-1)}
                disabled={isFirst}
              >
                ← Back
              </button>

              {isLast ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit feedback →"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => go(1)}
                  disabled={!canProceed}
                >
                  Continue →
                </button>
              )}
            </div>
          </div>

          <FooterMark />
        </main>
      )}
    </div>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-30 bg-[color:var(--background)]/85 backdrop-blur border-b border-derby-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <DerbyBadge variant="header" />
        <div className="hidden sm:flex items-center gap-3">
          <span className="chip">Bark &amp; Fly · Logo Vote</span>
        </div>
      </div>
    </header>
  );
}

function ThankYou() {
  return (
    <main className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center flex flex-col items-center gap-6"
        >
          <div className="chip chip-blue">Received · Thank you</div>
          <h1 className="display text-5xl md:text-7xl">
            <span>You just shaped</span>
            <br />
            <span className="text-derby">Bark &amp; Fly.</span>
          </h1>
          <p className="text-lg text-derby-ink/70">
            Every rating, every favorite, every note — it all factors into the
            final logo. Thanks for taking the time.
          </p>
          <Link href="/" className="btn-primary">
            Back to start →
          </Link>
          <FooterMark />
        </motion.div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-derby-ink">
        {label}
        {required && <span className="text-derby"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-derby-ink">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="textarea min-h-[100px]"
      />
    </label>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-semibold text-derby-ink">{children}</span>
  );
}

function ReviewSummary({ data }: { data: SurveyData }) {
  const rated = LOGO_CONCEPTS.map((c) => ({
    ...c,
    rating: data.ratings[c.id],
    isFav: data.favoriteConceptId === c.id,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col divide-y divide-derby-line rounded-2xl border border-derby-line bg-derby-mist/60 overflow-hidden">
        <SummaryRow label="Name" value={data.fullName || "—"} />
        <SummaryRow label="Email" value={data.email || "(not provided)"} />
        <SummaryRow label="You are" value={data.relationship || "—"} />
        <SummaryRow label="Vibe picks" value={data.vibes.join(", ") || "—"} />
        {data.nameSuggestion && (
          <SummaryRow label="Name idea" value={data.nameSuggestion} />
        )}
        <SummaryRow
          label="Favorite"
          value={
            rated.find((r) => r.isFav)?.label ?? "(not picked)"
          }
        />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-derby-ink/60 mb-3">
          Your ratings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rated.map((r) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                r.isFav
                  ? "border-derby bg-derby-soft"
                  : "border-derby-line bg-white"
              }`}
            >
              <span className="text-xs font-bold text-derby-ink/60 w-8">
                {r.label.replace("Concept ", "")}
              </span>
              <div className="flex gap-0.5 flex-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 ${
                      r.rating && r.rating.stars >= i
                        ? "text-derby"
                        : "text-derby-line"
                    }`}
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6z" />
                  </svg>
                ))}
              </div>
              {r.isFav && (
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-derby">
                  ★ Fav
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {data.anythingElse && (
        <div className="rounded-2xl border border-derby-line bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-derby-ink/60 mb-2">
            Notes
          </div>
          <p className="text-derby-ink">{data.anythingElse}</p>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm">
      <span className="font-semibold uppercase tracking-[0.1em] text-[11px] text-derby-ink/60 self-start">
        {label}
      </span>
      <span className="text-derby-ink">{value}</span>
    </div>
  );
}

function FooterMark() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <div className="h-px w-16 bg-derby-line" />
      <div className="flex items-center gap-3 text-derby-ink/60">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          Brought to you by
        </span>
        <Image
          src="/derby-logo.png"
          alt="Derby Digital"
          width={100}
          height={30}
          style={{ height: "auto" }}
        />
      </div>
    </div>
  );
}
