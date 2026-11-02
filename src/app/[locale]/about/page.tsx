import type { Metadata } from "next";
import Link from "next/link";
import { Stack } from "@/components/home/Stack";
import { Reveal } from "@/components/motion/Reveal";
import { Window } from "@/components/ui/Window";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { areaMeta, areas, paragraphs } from "@/lib/areas";
import { getProfile, pick } from "@/lib/content";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return { title: dict.about.title, alternates: alternatesFor(locale, "/about") };
}

export default async function AboutPage() {
  const [locale, dict, profile] = await Promise.all([getLocale(), getDictionary(), getProfile()]);
  const about = profile ? pick(profile.about, locale) : "";
  const available = profile?.available ?? true;

  const rows = [
    { label: "user", value: "@HolandaMexico" },
    { label: "display", value: "Ath" },
    profile?.location && { label: dict.about.location.toLowerCase(), value: profile.location },
    { label: dict.about.status.toLowerCase(), value: available ? dict.about.available : dict.about.unavailable },
  ].filter((r): r is { label: string; value: string } => Boolean(r));

  return (
    <>
      <section className="bg-grid border-b-3 border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="flex flex-col gap-5">
            <p className="font-mono text-sm text-lilac">{"// "}{dict.about.kicker}</p>
            <h1 className="font-display text-5xl font-semibold">{dict.about.title}</h1>
            <div className="flex flex-col gap-4 text-lg leading-relaxed text-text/90">
              {paragraphs(about).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <Window title="profile.json" accent="sun" bodyClassName="p-5 font-mono text-sm">
              <p className="text-muted">{"{"}</p>
              {rows.map((row, i) => (
                <p key={row.label} className="pl-5">
                  <span className="text-sky">&quot;{row.label}&quot;</span>
                  <span className="text-muted">: </span>
                  <span className="text-[var(--syn-string)]">&quot;{row.value}&quot;</span>
                  {i < rows.length - 1 && <span className="text-muted">,</span>}
                </p>
              ))}
              <p className="text-muted">{"}"}</p>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-20">
        <Reveal className="flex flex-col gap-6">
          <h2 className="font-display text-3xl font-semibold">{dict.about.whatIDo}</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {areas.map((area) => (
              <li key={area}>
                <Link
                  href={`/${locale}/${area}`}
                  className="toon group flex h-full flex-col gap-2 rounded-2xl bg-panel p-5 transition-transform hover:-translate-y-1"
                >
                  <span className={`h-1.5 w-10 rounded-full ${areaMeta[area].bg}`} />
                  <span className="font-display text-xl font-semibold group-hover:text-sun">{dict.areas.items[area].title}</span>
                  <span className="text-sm text-muted">{dict.areas.items[area].description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Stack dict={dict} />
    </>
  );
}
