"use client";

type Option = { label: string; desc?: string; emoji?: string };

export function OptionGrid({
  options,
  selected,
  onToggle,
  multi = true,
  cols = 2,
}: {
  options: Option[] | string[];
  selected: string[];
  onToggle: (label: string) => void;
  multi?: boolean;
  cols?: 1 | 2 | 3;
}) {
  const normalized: Option[] = options.map((o) =>
    typeof o === "string" ? { label: o } : o
  );
  const colClass =
    cols === 1 ? "grid-cols-1" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-3`}>
      {normalized.map((o) => {
        const isSelected = selected.includes(o.label);
        return (
          <button
            key={o.label}
            type="button"
            data-selected={isSelected}
            className="option"
            onClick={() => onToggle(o.label)}
          >
            {o.emoji && (
              <span className="text-xl" aria-hidden>
                {o.emoji}
              </span>
            )}
            <span className="flex-1">
              <span className="block font-semibold text-derby-ink">
                {o.label}
              </span>
              {o.desc && (
                <span className="block text-sm text-derby-ink/60 mt-0.5">
                  {o.desc}
                </span>
              )}
            </span>
            <span
              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? "border-derby bg-derby"
                  : "border-derby-line bg-white"
              }`}
              aria-hidden
            >
              {isSelected && (
                <svg
                  viewBox="0 0 20 20"
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    d="M4 10l4 4 8-8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
