import { stack } from "@/data/stack";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "./SectionHeading";

export function Stack({ dict, index = "02" }: { dict: Dictionary; index?: string }) {
  const t = dict.stack;
  // The list is rendered twice so the -50% translate loops seamlessly.
  const loop = [...stack, ...stack];

  return (
    <section id="stack" className="scroll-mt-20 pt-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading index={index} kicker={t.kicker} title={t.title} subtitle={t.subtitle} />
      </div>

      <div className="group mt-10 overflow-hidden border-y-3 border-line bg-panel py-5">
        <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {loop.map((tool, i) => (
            <li
              key={`${tool.name}-${i}`}
              aria-hidden={i >= stack.length}
              className="toon flex items-center gap-3 rounded-xl bg-panel-2 px-5 py-3 font-mono text-sm font-bold"
            >
              <span className={`size-3 rounded-sm border-2 border-line ${tool.color}`} />
              {tool.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
