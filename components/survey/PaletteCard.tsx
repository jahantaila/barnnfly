"use client";

export function PaletteCard({
  id,
  name,
  desc,
  colors,
  selected,
  onSelect,
}: {
  id: string;
  name: string;
  desc: string;
  colors: string[];
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      data-selected={selected}
      className="option flex-col items-stretch gap-4 !p-5"
    >
      <div className="flex gap-1.5 h-14 rounded-xl overflow-hidden">
        {colors.map((c) => (
          <div
            key={c}
            className="flex-1"
            style={{ background: c }}
            aria-hidden
          />
        ))}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-bold text-derby-ink">{name}</div>
          <div className="text-sm text-derby-ink/60 mt-0.5">{desc}</div>
        </div>
        <span
          className={`mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            selected ? "border-derby bg-derby" : "border-derby-line bg-white"
          }`}
          aria-hidden
        >
          {selected && (
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
      </div>
    </button>
  );
}
