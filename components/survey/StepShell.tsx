"use client";

import type { ReactNode } from "react";

export function StepShell({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="chip chip-blue self-start">{eyebrow}</span>
        <h2 className="display text-4xl sm:text-5xl md:text-6xl text-derby-ink">
          {title}
          {titleAccent && (
            <span className="text-derby"> {titleAccent}</span>
          )}
        </h2>
        {subtitle && (
          <p className="text-base md:text-lg text-derby-ink/70 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
