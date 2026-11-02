export type ScriptKind = "Script" | "LocalScript" | "ModuleScript";

const styles: Record<ScriptKind, { bg: string; glyph: string }> = {
  Script: { bg: "bg-sky", glyph: "S" },
  LocalScript: { bg: "bg-mint", glyph: "L" },
  ModuleScript: { bg: "bg-lilac", glyph: "M" },
};

// Small badge for each script type (our own glyphs, not Roblox's icons).
export function ScriptIcon({ kind }: { kind: ScriptKind }) {
  const s = styles[kind];
  return (
    <span
      className={`grid size-5 shrink-0 place-items-center rounded-md border-2 border-line font-mono text-[10px] font-black text-line ${s.bg}`}
      aria-hidden
    >
      {s.glyph}
    </span>
  );
}

export function FolderIcon() {
  return (
    <svg viewBox="0 0 20 16" className="h-4 w-5 shrink-0" aria-hidden>
      <path
        d="M1.5 3.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"
        fill="var(--sun)"
        stroke="var(--line)"
        strokeWidth="2"
      />
    </svg>
  );
}
