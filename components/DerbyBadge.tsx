import Image from "next/image";

type DerbyBadgeProps = {
  variant?: "header" | "inline" | "footer";
  className?: string;
};

export function DerbyBadge({ variant = "header", className = "" }: DerbyBadgeProps) {
  if (variant === "header") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Image
          src="/derby-logo.svg"
          alt="Derby Digital"
          width={140}
          height={42}
          priority
          style={{ height: "auto" }}
        />
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-derby-line bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-derby-ink/80 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-derby opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-derby" />
        </span>
        Powered by{" "}
        <Image
          src="/derby-logo.svg"
          alt="Derby Digital"
          width={70}
          height={22}
          style={{ height: "auto" }}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 text-derby-ink/60 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
        A Derby Digital project
      </span>
      <Image
        src="/derby-logo.svg"
        alt="Derby Digital"
        width={100}
        height={30}
        style={{ height: "auto" }}
      />
    </div>
  );
}
