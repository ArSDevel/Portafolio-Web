import { Areas } from "@/components/home/Areas";
import { Hero } from "@/components/home/Hero";
import { ProcessSteps } from "@/components/home/Process";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Stack } from "@/components/home/Stack";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getProfile } from "@/lib/content";
import { getFeaturedProjects, getProjectCounts } from "@/lib/projects";

export default async function Home() {
  const [locale, dict, profile, featured, counts] = await Promise.all([
    getLocale(),
    getDictionary(),
    getProfile(),
    getFeaturedProjects(),
    getProjectCounts(),
  ]);

  return (
    <>
      <Hero dict={dict} available={profile?.available ?? false} />
      <Areas dict={dict} locale={locale} counts={counts} />

      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pt-24">
          <SectionHeading index="02" kicker={dict.featured.kicker} title={dict.featured.title} subtitle={dict.featured.subtitle} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <li key={`${p.area}/${p.slug}`}>
                <Reveal delay={i * 0.08} className="h-full">
                  <ProjectCard area={p.area} slug={p.slug} entry={p.entry} locale={locale} areaLabel={dict.areas.items[p.area].title} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Stack dict={dict} index="03" />

      <section id="process" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pt-24">
        <SectionHeading index="04" kicker={dict.process.kicker} title={dict.process.title} subtitle={dict.process.subtitle} />
        <ProcessSteps steps={dict.process.steps} />
      </section>
    </>
  );
}
