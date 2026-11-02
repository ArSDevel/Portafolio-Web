"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Window } from "@/components/ui/Window";
import { tokenizeLuau, type Token, type TokenType } from "@/lib/luau-lite";

const SCRIPT = `-- ServerScriptService/Portfolio.server.luau
local Players = game:GetService("Players")

type Creator = {
  name: string,
  roles: { string },
}

local Ath: Creator = {
  name = "HolandaMexico",
  roles = { "3D Modeler", "Builder", "Scripter" },
}

local function greet(player: Player)
  print(\`Hi, {player.DisplayName}! I'm {Ath.name} 👋\`)
end

Players.PlayerAdded:Connect(greet)`;

const OUTPUT = [
  { time: "00:00:01.337", text: "Portfolio loaded ✓", tone: "text-mint" },
  { time: "00:00:01.412", text: "Hi, Visitor! I'm HolandaMexico 👋", tone: "text-text" },
];

const CHARS_PER_TICK = 2;
const TICK_MS = 16;

export const tokenColor: Record<TokenType, string> = {
  comment: "text-[var(--syn-comment)] italic",
  string: "text-[var(--syn-string)]",
  number: "text-[var(--syn-number)]",
  keyword: "text-[var(--syn-keyword)] font-bold",
  builtin: "text-[var(--syn-builtin)]",
  function: "text-[var(--syn-function)]",
  type: "text-[var(--syn-type)]",
  plain: "text-[var(--syn-plain)]",
};

function renderTokens(tokens: Token[], limit: number) {
  const out = [];
  let used = 0;
  for (let i = 0; i < tokens.length && used < limit; i++) {
    const { type, text } = tokens[i];
    const visible = text.slice(0, limit - used);
    used += visible.length;
    out.push(
      <span key={i} className={tokenColor[type]}>
        {visible}
      </span>,
    );
  }
  return out;
}

export function CodeWindow({ outputLabel }: { outputLabel: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const tokens = useMemo(() => tokenizeLuau(SCRIPT), []);
  const lineCount = SCRIPT.split("\n").length;
  const [typed, setTyped] = useState(0);

  const shown = reduce ? SCRIPT.length : typed;
  const done = shown >= SCRIPT.length;

  useEffect(() => {
    if (reduce || !inView || done) return;
    const id = setTimeout(() => setTyped((n) => n + CHARS_PER_TICK), TICK_MS);
    return () => clearTimeout(id);
  }, [reduce, inView, done, typed]);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <Window title="Portfolio.server.luau" accent="sky" bodyClassName="flex text-[12.5px] leading-6 sm:text-[13px]">
        <div
          className="select-none border-r-2 border-line/60 bg-panel-2/60 px-3 py-4 text-right font-mono text-muted/60"
          aria-hidden
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="grid min-w-0 flex-1 overflow-x-auto px-4 py-4 font-mono">
          {/* Invisible full copy reserves the final size, so nothing jumps while typing. */}
          <code className="invisible [grid-area:1/1]" aria-hidden>
            {SCRIPT}
          </code>
          <code className="[grid-area:1/1]">
            {renderTokens(tokens, shown)}
            {!done && <span className="inline-block w-[1ch] animate-blink bg-sky">&nbsp;</span>}
          </code>
        </pre>
      </Window>

      <Window title={outputLabel} accent="mint" bodyClassName="min-h-[84px] px-4 py-3 font-mono text-xs">
        {done &&
          OUTPUT.map((line, i) => (
            <motion.p
              key={line.time}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.45 }}
              className="flex gap-3"
            >
              <span className="text-muted">{line.time}</span>
              <span className={line.tone}>{line.text}</span>
            </motion.p>
          ))}
      </Window>
    </div>
  );
}
