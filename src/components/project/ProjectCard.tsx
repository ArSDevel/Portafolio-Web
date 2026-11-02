import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "@/components/motion/TiltCard";
import { Window } from "@/components/ui/Window";
import type { Locale } from "@/i18n/config";
import { areaMeta, isSvg } from "@/lib/areas";
import { pick, projectTitle, type Area } from "@/lib/content";

type CardEntry = {
  title: string;
  titleEn: string;
  summary: { es: string; en: string };
  cover: string;
  tags: readonly string[];
};

type Props = {
  area: Area;
  slug: string;
  entry: CardEntry;
  locale: Locale;
  areaLabel: string;
};

export function ProjectCard({ area, slug, entry, locale, areaLabel }: Props) {
  const meta = areaMeta[area];
  const title = projectTitle(entry, locale);

  return (
    <TiltCard className="h-full">
      <Link href={`/${locale}/${area}/${slug}`} className="group block h-full">
        <Window title={`${slug}${meta.ext}`} accent={meta.accent} className="h-full" bodyClassName="flex h-full flex-col">
          <div className="relative aspect-video overflow-hidden border-b-3 border-line bg-bg">
            <Image
              src={entry.cover}
              alt={title}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              unoptimized={isSvg(entry.cover)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <span className={`font-mono text-[11px] font-bold uppercase ${meta.text}`}>{areaLabel}</span>
            <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-sun">{title}</h3>
            <p className="text-sm text-muted">{pick(entry.summary, locale)}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-3">
              {entry.tags.slice(0, 3).map((tag) => (
                <li key={tag} className="rounded-md border-2 border-line bg-panel-2 px-2 py-0.5 font-mono text-[11px]">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </Window>
      </Link>
    </TiltCard>
  );
}
