import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { Locale } from "@/i18n/config";
import { areaMeta } from "@/lib/areas";
import type { Area } from "@/lib/content";

type Props = {
  area: Area;
  areaLabel: string;
  backLabel: string;
  title: string;
  summary: string;
  date: string | null;
  tags: readonly string[];
  locale: Locale;
};

export function ProjectHeader({ area, areaLabel, backLabel, title, summary, date, tags, locale }: Props) {
  const meta = areaMeta[area];
  const formatted = date
    ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", timeZone: "UTC" }).format(new Date(date))
    : null;

  return (
    <Reveal className="flex flex-col gap-4">
      <Link href={`/${locale}/${area}`} className="w-fit font-mono text-sm text-muted transition-colors hover:text-text">
        ← {backLabel}
      </Link>
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <span className={`toon rounded-md px-2 py-0.5 font-bold text-line ${meta.bg}`}>{areaLabel}</span>
        {formatted && <span className="text-muted">{formatted}</span>}
      </div>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
      <p className="max-w-2xl text-lg text-muted">{summary}</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag} className="rounded-md border-2 border-line bg-panel-2 px-2 py-0.5 font-mono text-xs">
            {tag}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
