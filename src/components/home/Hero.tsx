import type { Dictionary } from "@/i18n/get-dictionary";
import { CodeWindow } from "./CodeWindow";
import { Spotlight } from "./Spotlight";
import { TypingRoles } from "./TypingRoles";

export function Hero({ dict, available }: { dict: Dictionary; available: boolean }) {
  const t = dict.hero;

  return (
    <Spotlight className="bg-grid animate-grid-pan border-b-3 border-line">
      <section
        id="top"
        className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1fr_1.15fr]"
      >
        <div className="flex min-w-0 flex-col gap-6">
          <span className="toon flex w-fit items-center gap-2 rounded-full bg-panel px-3 py-1 font-mono text-xs">
            <span className={`size-2 rounded-full ${available ? "animate-pulse-dot bg-mint" : "bg-sun"}`} />
            {available ? t.available : t.badge}
          </span>

          <h1 className="font-display text-5xl leading-[1.05] font-semibold sm:text-6xl">
            {t.hello} <span className="text-lilac">Ath</span>
            <br />
            <TypingRoles roles={t.roles} />
          </h1>

          <p className="max-w-md text-lg text-muted">{t.intro}</p>

          <div className="flex flex-wrap gap-3">
            <a href="#work" className="btn-toon rounded-xl bg-sun px-5 py-2.5 font-display font-semibold text-line">
              {t.ctaPrimary}
            </a>
            <a href="#contact" className="btn-toon rounded-xl bg-panel px-5 py-2.5 font-display font-semibold">
              {t.ctaSecondary}
            </a>
          </div>

          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs">
            {t.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-muted">{fact.label}</dt>
                <dd className="text-sm font-bold text-text">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 lg:animate-float">
          <CodeWindow outputLabel={t.outputLabel} />
        </div>
      </section>
    </Spotlight>
  );
}
