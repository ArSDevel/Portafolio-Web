import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Window } from "@/components/ui/Window";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { areaMeta, areas } from "@/lib/areas";
import type { Area } from "@/lib/content";
import { BlockStack, CodeBars, WireCube } from "./AreaVisuals";
import { SectionHeading } from "./SectionHeading";

const visuals = { modeling: WireCube, building: BlockStack, scripting: CodeBars } as const;

type Props = { dict: Dictionary; locale: Locale; counts: Record<Area, number> };

export function Areas({ dict, locale, counts }: Props) {
  const t = dict.areas;

  return (
    <section id="work" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pt-24">
      <SectionHeading index="01" kicker={t.kicker} title={t.title} subtitle={t.subtitle} />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {areas.map((key, i) => {
          const item = t.items[key];
          const meta = areaMeta[key];
          const Visual = visuals[key];
          return (
            <Reveal key={key} delay={i * 0.12}>
              <TiltCard className="h-full">
                <Link href={`/${locale}/${key}`} className="group block h-full">
                  <Window title={`${key}${meta.ext}`} accent={meta.accent} className="h-full" bodyClassName="flex h-full flex-col">
                    <div className="h-40 border-b-3 border-line bg-grid bg-bg/60">
                      <Visual />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <h3 className="font-display text-2xl font-semibold transition-colors group-hover:text-sun">{item.title}</h3>
                      <p className="text-sm text-muted">{item.description}</p>
                      <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                        {item.tags.map((tag) => (
                          <li key={tag} className="rounded-md border-2 border-line bg-panel-2 px-2 py-0.5 font-mono text-[11px]">
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <p className="flex items-center justify-between font-mono text-xs">
                        <span className="text-muted">
                          <span className={meta.text}>●</span> {counts[key]} {t.projects}
                        </span>
                        <span className="transition-transform group-hover:translate-x-1">{t.explore} →</span>
                      </p>
                    </div>
                  </Window>
                </Link>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
