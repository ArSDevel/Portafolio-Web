"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { useCodeTheme } from "@/lib/use-code-theme";
import { FolderIcon, ScriptIcon, type ScriptKind } from "./ScriptIcon";

export type ExplorerScript = {
  name: string;
  kind: ScriptKind;
  location: string;
  code: string;
  html: string;
};

type Labels = {
  explorer: string;
  copy: string;
  copied: string;
  lines: string;
};

export function ScriptExplorer({ scripts, labels }: { scripts: ExplorerScript[]; labels: Labels }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useCodeTheme();

  // Group scripts by their service/folder, keeping the original order.
  const groups = useMemo(() => {
    const map = new Map<string, { script: ExplorerScript; index: number }[]>();
    scripts.forEach((script, index) => {
      const list = map.get(script.location) ?? [];
      list.push({ script, index });
      map.set(script.location, list);
    });
    return [...map];
  }, [scripts]);

  const current = scripts[active];
  if (!current) return null;
  const lineCount = current.code.trimEnd().split("\n").length;

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; nothing else to do.
    }
  }

  return (
    <div className="toon grid overflow-hidden rounded-2xl bg-panel lg:grid-cols-[260px_1fr]">
      {/* Explorer */}
      <aside className="border-b-3 border-line bg-panel-2/50 lg:border-r-3 lg:border-b-0">
        <p className="border-b-3 border-line bg-lilac px-4 py-2 font-mono text-xs font-bold text-line">
          {labels.explorer}
        </p>
        <ul className="flex flex-col gap-1 p-3 font-mono text-[13px]">
          {groups.map(([location, items]) => (
            <li key={location}>
              <p className="flex items-center gap-2 px-2 py-1 text-muted">
                <FolderIcon />
                {location}
              </p>
              <ul className="ml-4 border-l-2 border-dashed border-muted/30 pl-2">
                {items.map(({ script, index }) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-current={index === active}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                        index === active ? "bg-sun/15 text-sun" : "hover:bg-panel"
                      }`}
                    >
                      <ScriptIcon kind={script.kind} />
                      <span className="truncate">{script.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b-3 border-line bg-sky px-3 py-2 text-line">
          <ScriptIcon kind={current.kind} />
          <span className="font-mono text-xs font-bold">{current.name}</span>
          <span className="font-mono text-[11px] opacity-70">
            · {current.kind} · {lineCount} {labels.lines}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border-2 border-line font-mono text-[11px] font-bold">
              {(["studio", "vscode"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  aria-pressed={theme === t}
                  className={`px-2 py-1 transition-colors ${theme === t ? "bg-line text-text" : "bg-sky hover:bg-white/30"}`}
                >
                  {t === "studio" ? "Studio" : "VS Code"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border-2 border-line bg-sun px-2.5 py-1 font-mono text-[11px] font-bold transition-transform active:translate-y-0.5"
            >
              {copied ? `✓ ${labels.copied}` : labels.copy}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            data-code-theme={theme}
            className="code-view min-w-0 transition-colors"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            // Trusted: HTML produced at build time by Shiki from the repo's own content.
            dangerouslySetInnerHTML={{ __html: current.html }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
