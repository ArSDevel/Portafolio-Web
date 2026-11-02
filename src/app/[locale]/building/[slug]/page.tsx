import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "@/components/project/Gallery";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectSkeleton } from "@/components/project/ProjectSkeleton";
import { Block, Description, YouTube } from "@/components/project/ProjectSections";
import { RobloxStats } from "@/components/project/RobloxStats";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getBuildingProject, pick, projectTitle } from "@/lib/content";
import { staticSlugs } from "@/lib/projects";
import { alternatesFor } from "@/lib/site";

export function generateStaticParams() {
  return staticSlugs("building");
}

export async function generateMetadata({ params }: PageProps<"/[locale]/building/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [locale, project] = await Promise.all([getLocale(), getBuildingProject(slug)]);
  if (!project) return {};
  return {
    title: projectTitle(project.entry, locale),
    description: pick(project.entry.summary, locale),
    alternates: alternatesFor(locale, `/building/${slug}`),
  };
}

// params are URL data: read them inside Suspense so the shared shell stays prefetchable.
export default function BuildingProjectPage({ params }: PageProps<"/[locale]/building/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <BuildingProject params={params} />
    </Suspense>
  );
}

async function BuildingProject({ params }: Pick<PageProps<"/[locale]/building/[slug]">, "params">) {
  const { slug } = await params;
  const [locale, dict, project] = await Promise.all([getLocale(), getDictionary(), getBuildingProject(slug)]);
  if (!project) notFound();
  const { entry } = project;
  const title = projectTitle(entry, locale);
  const placeId = entry.placeId.trim();

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-14">
      <ProjectHeader
        area="building"
        areaLabel={dict.areas.items.building.title}
        backLabel={dict.project.back}
        title={title}
        summary={pick(entry.summary, locale)}
        date={entry.date}
        tags={entry.tags}
        locale={locale}
      />

      {(placeId || entry.experienceUrl) && (
        <Block kicker={dict.project.experience}>
          {placeId && <RobloxStats placeId={placeId} locale={locale} labels={dict.roblox} />}
          {entry.experienceUrl && (
            <a href={entry.experienceUrl} target="_blank" rel="noreferrer" className="btn-toon w-fit rounded-xl bg-sun px-4 py-2 font-display font-semibold text-line">
              {dict.project.openExperience} ↗
            </a>
          )}
        </Block>
      )}

      <Block kicker={dict.project.description}>
        <Description text={pick(entry.description, locale)} />
      </Block>

      {entry.gallery.length > 0 && (
        <Block kicker={dict.project.gallery}>
          <Gallery
            items={entry.gallery.filter((g) => g.image).map((g) => ({ src: g.image!, caption: pick(g.caption, locale) }))}
            closeLabel={dict.project.close}
          />
        </Block>
      )}

      {entry.video && (
        <Block kicker={dict.project.video}>
          <YouTube url={entry.video} title={title} />
        </Block>
      )}
    </article>
  );
}
