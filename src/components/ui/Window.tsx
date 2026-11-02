import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  accent?: "mint" | "sun" | "coral" | "sky" | "lilac";
  className?: string;
  bodyClassName?: string;
};

const accentBg = {
  mint: "bg-mint",
  sun: "bg-sun",
  coral: "bg-coral",
  sky: "bg-sky",
  lilac: "bg-lilac",
} as const;

// Cartoon "editor window": title bar with traffic lights + body.
export function Window({
  title,
  children,
  accent = "lilac",
  className = "",
  bodyClassName = "",
}: Props) {
  return (
    <div className={`toon overflow-hidden rounded-2xl bg-panel ${className}`}>
      <div
        className={`flex items-center gap-3 border-b-3 border-line px-4 py-2 text-line ${accentBg[accent]}`}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full border-2 border-line bg-coral" />
          <span className="size-3 rounded-full border-2 border-line bg-sun" />
          <span className="size-3 rounded-full border-2 border-line bg-mint" />
        </span>
        <span className="truncate font-mono text-xs font-bold">{title}</span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
