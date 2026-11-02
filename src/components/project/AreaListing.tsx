import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import type { Area } from "@/lib/content";
import { getProjectsByArea } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./ProjectSections";

const indexOf: Record<Area, string> = { modeling: "01", building: "02", scripting: "03" };

export async function AreaListing({ area }: { area: Area }) {
  const [locale, dict, projects] = await Promise.all([getLocale(), getDictionary(), getProjectsByArea(area)]);
  const label = dict.areas.items[area].title;

  return (
    <section className="bg-grid border-b-3 border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <SectionHeading index={indexOf[area]} kicker={dict.listing.kicker} title={label} subtitle={dict.listing.subtitles[area]} />

        <div className="mt-10">
          {projects.length === 0 ? (
            <EmptyState text={dict.listing.empty} />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <ProjectCard area={area} slug={p.slug} entry={p.entry} locale={locale} areaLabel={label} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
