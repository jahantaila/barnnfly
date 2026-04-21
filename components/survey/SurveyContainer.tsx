"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DerbyBadge } from "@/components/DerbyBadge";
import { ProgressBar } from "./ProgressBar";
import { StepShell } from "./StepShell";
import { OptionGrid } from "./OptionGrid";
import { PaletteCard } from "./PaletteCard";
import { LogoVote } from "./LogoVote";
import {
  BUSINESS_STAGES,
  DEFAULT_DATA,
  IMAGERY_OPTIONS,
  LOGO_STYLE_OPTIONS,
  PALETTE_OPTIONS,
  PERSONALITY_OPTIONS,
  PET_OPTIONS,
  PRICE_TIERS,
  SERVICE_OPTIONS,
  STEP_ORDER,
  TONE_OPTIONS,
  type StepId,
  type SurveyData,
} from "@/lib/survey-config";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-derby-soft via-white to-derby-mist" />
  ),
});

const STORAGE_KEY = "barknfly_survey_v1";

function toggleInList(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
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

  const canProceed = useMemo(() => {
    switch (step) {
      case "intro":
        return true;
      case "about-you":
        return data.fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(data.email);
      case "vision":
        return data.businessStage.length > 0 && data.services.length > 0;
      case "audience":
        return data.priceTier.length > 0 && data.petTypes.length > 0;
      case "personality":
        return data.personality.length >= 2;
      case "logo-direction":
        return data.logoStyles.length > 0;
      case "palette":
        return data.palette.length > 0;
      case "logo-vote":
        return true;
      case "voice":
        return data.toneAdjectives.length > 0;
      case "review":
        return true;
    }
  }, [step, data]);

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
        <IntroHero onStart={() => setStep("about-you")} />
      ) : (
        <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-16 relative z-10">
          <div className="mb-10">
            <ProgressBar current={step} />
          </div>

          <div className="card p-6 sm:p-10">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div>
                {step === "about-you" && (
                  <StepShell
                    eyebrow="Step 01 · Who you are"
                    title="Let's get to know"
                    titleAccent="you."
                    subtitle="We'll use this to tailor concepts and send your brand package."
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Full name"
                        required
                        value={data.fullName}
                        onChange={(v) => update("fullName", v)}
                        placeholder="Jane Doe"
                      />
                      <Field
                        label="Role / title"
                        value={data.role}
                        onChange={(v) => update("role", v)}
                        placeholder="Founder, Owner, GM…"
                      />
                      <Field
                        label="Email"
                        required
                        type="email"
                        value={data.email}
                        onChange={(v) => update("email", v)}
                        placeholder="you@barknfly.com"
                      />
                      <Field
                        label="Phone"
                        type="tel"
                        value={data.phone}
                        onChange={(v) => update("phone", v)}
                        placeholder="(555) 867-5309"
                      />
                    </div>
                  </StepShell>
                )}

                {step === "vision" && (
                  <StepShell
                    eyebrow="Step 02 · The vision"
                    title="What is Bark"
                    titleAccent="& Fly?"
                    subtitle="Tell us where you are in the journey and what the resort will offer."
                  >
                    <div className="flex flex-col gap-2">
                      <Label>Where are you in the journey?</Label>
                      <OptionGrid
                        options={BUSINESS_STAGES.map((s) => ({ label: s }))}
                        selected={
                          data.businessStage ? [data.businessStage] : []
                        }
                        onToggle={(v) =>
                          update("businessStage", v === data.businessStage ? "" : v)
                        }
                        multi={false}
                        cols={2}
                      />
                    </div>
                    <Field
                      label="City / service area"
                      value={data.location}
                      onChange={(v) => update("location", v)}
                      placeholder="e.g., Nashville, TN"
                    />
                    <div className="flex flex-col gap-2">
                      <Label>Services offered (pick all that apply)</Label>
                      <OptionGrid
                        options={SERVICE_OPTIONS}
                        selected={data.services}
                        onToggle={(v) =>
                          update("services", toggleInList(data.services, v))
                        }
                        cols={2}
                      />
                    </div>
                    <TextArea
                      label="What's the one thing that'll make Bark & Fly different?"
                      value={data.uniqueValue}
                      onChange={(v) => update("uniqueValue", v)}
                      placeholder="e.g., airport proximity, live webcams, luxury suites…"
                    />
                  </StepShell>
                )}

                {step === "audience" && (
                  <StepShell
                    eyebrow="Step 03 · Dream customer"
                    title="Who are we"
                    titleAccent="building for?"
                  >
                    <TextArea
                      label="Describe your dream customer in a sentence."
                      value={data.dreamCustomer}
                      onChange={(v) => update("dreamCustomer", v)}
                      placeholder="e.g., busy professionals flying out of the airport who want 5-star care for their dogs"
                    />
                    <div className="flex flex-col gap-2">
                      <Label>Who do you serve?</Label>
                      <OptionGrid
                        options={PET_OPTIONS}
                        selected={data.petTypes}
                        onToggle={(v) =>
                          update("petTypes", toggleInList(data.petTypes, v))
                        }
                        cols={3}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Price positioning</Label>
                      <OptionGrid
                        options={PRICE_TIERS.map((t) => ({
                          label: t.label,
                          desc: t.sub,
                        }))}
                        selected={
                          data.priceTier
                            ? [
                                PRICE_TIERS.find(
                                  (t) => t.value === data.priceTier
                                )?.label ?? "",
                              ]
                            : []
                        }
                        onToggle={(label) => {
                          const tier = PRICE_TIERS.find(
                            (t) => t.label === label
                          );
                          update(
                            "priceTier",
                            tier && tier.value !== data.priceTier
                              ? tier.value
                              : ""
                          );
                        }}
                        multi={false}
                        cols={2}
                      />
                    </div>
                  </StepShell>
                )}

                {step === "personality" && (
                  <StepShell
                    eyebrow="Step 04 · Personality"
                    title="How should the"
                    titleAccent="brand feel?"
                    subtitle="Pick at least 2–4 that capture the vibe. Pairs work great ('playful + premium')."
                  >
                    <OptionGrid
                      options={PERSONALITY_OPTIONS}
                      selected={data.personality}
                      onToggle={(v) =>
                        update("personality", toggleInList(data.personality, v))
                      }
                      cols={3}
                    />
                    <TextArea
                      label="Anything the brand absolutely shouldn't feel like?"
                      value={data.dealBreakers}
                      onChange={(v) => update("dealBreakers", v)}
                      placeholder="e.g., clinical, cheap, kiddie-cartoonish"
                    />
                  </StepShell>
                )}

                {step === "logo-direction" && (
                  <StepShell
                    eyebrow="Step 05 · Logo direction"
                    title="How should the"
                    titleAccent="logo look?"
                    subtitle="Pick the style(s) + any imagery you'd love to see explored."
                  >
                    <div className="flex flex-col gap-2">
                      <Label>Logo styles to explore</Label>
                      <OptionGrid
                        options={LOGO_STYLE_OPTIONS}
                        selected={data.logoStyles}
                        onToggle={(v) =>
                          update("logoStyles", toggleInList(data.logoStyles, v))
                        }
                        cols={2}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Imagery you'd love to see considered</Label>
                      <OptionGrid
                        options={IMAGERY_OPTIONS}
                        selected={data.imagery}
                        onToggle={(v) =>
                          update("imagery", toggleInList(data.imagery, v))
                        }
                        cols={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextArea
                        label="A brand you admire (in any industry)"
                        value={data.competitorLoves}
                        onChange={(v) => update("competitorLoves", v)}
                        placeholder="e.g., Chewy, Bark, Four Seasons…"
                      />
                      <TextArea
                        label="A brand that's NOT you"
                        value={data.competitorAvoids}
                        onChange={(v) => update("competitorAvoids", v)}
                        placeholder="e.g., Petco vibes, big-box feel…"
                      />
                    </div>
                  </StepShell>
                )}

                {step === "palette" && (
                  <StepShell
                    eyebrow="Step 06 · Palette"
                    title="Pick a color"
                    titleAccent="direction."
                    subtitle="We'll refine the exact hex values in design — just pick the vibe closest to Bark & Fly."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PALETTE_OPTIONS.map((p) => (
                        <PaletteCard
                          key={p.id}
                          {...p}
                          selected={data.palette === p.id}
                          onSelect={(id) =>
                            update("palette", id === data.palette ? "" : id)
                          }
                        />
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === "logo-vote" && (
                  <StepShell
                    eyebrow="Step 07 · Logo vote"
                    title="Vote on the"
                    titleAccent="concepts."
                    subtitle="Rate each concept and mark your overall favorite. Placeholders show where the Bark & Fly logo tests will live."
                  >
                    <LogoVote
                      votes={data.logoVotes}
                      favorite={data.logoFavorite}
                      feedback={data.logoFeedback}
                      onVote={(id, v) =>
                        update("logoVotes", { ...data.logoVotes, [id]: v })
                      }
                      onFavorite={(id) => update("logoFavorite", id)}
                      onFeedback={(v) => update("logoFeedback", v)}
                    />
                  </StepShell>
                )}

                {step === "voice" && (
                  <StepShell
                    eyebrow="Step 08 · Voice"
                    title="How does Bark & Fly"
                    titleAccent="sound?"
                  >
                    <Field
                      label="Tagline or elevator pitch (optional)"
                      value={data.tagline}
                      onChange={(v) => update("tagline", v)}
                      placeholder="e.g., First-class care before takeoff."
                    />
                    <div className="flex flex-col gap-2">
                      <Label>Pick the tones that fit</Label>
                      <OptionGrid
                        options={TONE_OPTIONS}
                        selected={data.toneAdjectives}
                        onToggle={(v) =>
                          update(
                            "toneAdjectives",
                            toggleInList(data.toneAdjectives, v)
                          )
                        }
                        cols={3}
                      />
                    </div>
                    <TextArea
                      label="Anything else we should know?"
                      value={data.anythingElse}
                      onChange={(v) => update("anythingElse", v)}
                      placeholder="Timelines, hard constraints, must-haves, partner names…"
                    />
                  </StepShell>
                )}

                {step === "review" && (
                  <StepShell
                    eyebrow="Step 09 · Review"
                    title="Lock it in."
                    subtitle="Here's what you told us. Hit submit and our Derby Digital team takes it from here."
                  >
                    <ReviewSummary data={data} />
                  </StepShell>
                )}
              </div>
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
                  {submitting ? "Submitting…" : "Submit survey →"}
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
    <header className="sticky top-0 z-30 bg-[color:var(--background)]/80 backdrop-blur border-b border-derby-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <DerbyBadge variant="header" />
        <div className="hidden sm:flex items-center gap-3">
          <span className="chip">Bark &amp; Fly · Brand Survey</span>
        </div>
      </div>
    </header>
  );
}

function IntroHero({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 pointer-events-none">
          <HeroCanvas />
        </div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-6"
        >
          <DerbyBadge variant="inline" />
          <h1 className="display text-[14vw] sm:text-7xl md:text-8xl text-derby-ink leading-[0.9]">
            Let&apos;s brand
            <br />
            <span className="text-derby">Bark &amp; Fly.</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-derby-ink/70 leading-relaxed">
            A 5-minute founder survey to lock in the logo, palette, voice, and
            positioning for your new pet resort. Every answer shapes what your
            Derby Digital team builds.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <button className="btn-primary" onClick={onStart}>
              Start the survey →
            </button>
            <span className="text-sm text-derby-ink/60">
              9 quick steps · ~5 minutes · auto-saves
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-16 md:mt-24"
        >
          <div className="card p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-derby-ink/60 mb-5">
              What you&apos;ll help us shape
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "◆", label: "Brand personality & voice" },
                { icon: "✦", label: "Logo direction and imagery" },
                { icon: "●", label: "Color palette and vibe" },
                { icon: "▲", label: "Target customer positioning" },
                { icon: "◎", label: "Logo concept voting" },
                { icon: "✺", label: "Services and differentiators" },
              ].map((row) => (
                <li key={row.label} className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-derby-soft text-derby font-bold flex items-center justify-center text-base">
                    {row.icon}
                  </span>
                  <span className="text-derby-ink font-medium">
                    {row.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <FooterMark />
        </div>
      </div>
    </main>
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
            <span>You just kicked off</span>
            <br />
            <span className="text-derby">Bark &amp; Fly.</span>
          </h1>
          <p className="text-lg text-derby-ink/70">
            Our Derby Digital team will review your answers and come back within
            2–3 business days with the first round of concepts.
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
  const palette = PALETTE_OPTIONS.find((p) => p.id === data.palette);
  const tier = PRICE_TIERS.find((t) => t.value === data.priceTier);
  const rows: Array<[string, React.ReactNode]> = [
    ["Name", data.fullName || "—"],
    ["Email", data.email || "—"],
    ["Location", data.location || "—"],
    ["Stage", data.businessStage || "—"],
    ["Services", data.services.join(", ") || "—"],
    ["Pets served", data.petTypes.join(", ") || "—"],
    ["Price tier", tier?.label ?? "—"],
    ["Personality", data.personality.join(", ") || "—"],
    ["Logo styles", data.logoStyles.join(", ") || "—"],
    ["Imagery", data.imagery.join(", ") || "—"],
    [
      "Palette",
      palette ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex gap-0.5">
            {palette.colors.map((c) => (
              <span
                key={c}
                className="h-4 w-4 rounded-sm border border-derby-line"
                style={{ background: c }}
              />
            ))}
          </span>
          {palette.name}
        </span>
      ) : (
        "—"
      ),
    ],
    ["Tagline", data.tagline || "—"],
    ["Tones", data.toneAdjectives.join(", ") || "—"],
    ["Favorite concept", data.logoFavorite || "—"],
  ];
  return (
    <div className="flex flex-col divide-y divide-derby-line rounded-2xl border border-derby-line bg-derby-mist/60 overflow-hidden">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm"
        >
          <span className="font-semibold uppercase tracking-[0.1em] text-[11px] text-derby-ink/60 self-start">
            {k}
          </span>
          <span className="text-derby-ink">{v}</span>
        </div>
      ))}
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
          src="/derby-logo.svg"
          alt="Derby Digital"
          width={90}
          height={28}
          style={{ height: "auto" }}
        />
      </div>
    </div>
  );
}
