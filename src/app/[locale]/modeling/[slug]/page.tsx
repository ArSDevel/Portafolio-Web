import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BeforeAfter } from "@/components/model/BeforeAfter";
import { ModelViewer } from "@/components/model/ModelViewer";
import { Gallery } from "@/components/project/Gallery";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectSkeleton } from "@/components/project/ProjectSkeleton";
import { Block, Description } from "@/components/project/ProjectSections";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getModelingProject, pick, projectTitle } from "@/lib/content";
import { staticSlugs } from "@/lib/projects";
import { alternatesFor } from "@/lib/site";

export function generateStaticParams() {
  return staticSlugs("modeling");
}

export async function generateMetadata({ params }: PageProps<"/[locale]/modeling/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [locale, project] = await Promise.all([getLocale(), getModelingProject(slug)]);
  if (!project) return {};
  return {
    title: projectTitle(project.entry, locale),
    description: pick(project.entry.summary, locale),
    alternates: alternatesFor(locale, `/modeling/${slug}`),
  };
}

// params are URL data: read them inside Suspense so the shared shell stays prefetchable.
export default function ModelingProjectPage({ params }: PageProps<"/[locale]/modeling/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ModelingProject params={params} />
    </Suspense>
  );
}

async function ModelingProject({ params }: Pick<PageProps<"/[locale]/modeling/[slug]">, "params">) {
  const { slug } = await params;
  const [locale, dict, project] = await Promise.all([getLocale(), getDictionary(), getModelingProject(slug)]);
  if (!project) notFound();
  const { entry } = project;
  const v = dict.viewer;

  const extra = [
    entry.textures && { label: v.textures, value: entry.textures },
    entry.software && { label: v.software, value: entry.software },
    { label: v.mobile, value: entry.mobileOptimized ? `✓ ${v.yes}` : v.no },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-14">
      <ProjectHeader
        area="modeling"
        areaLabel={dict.areas.items.modeling.title}
        backLabel={dict.project.back}
        title={projectTitle(entry, locale)}
        summary={pick(entry.summary, locale)}
        date={entry.date}
        tags={entry.tags}
        locale={locale}
      />

      {entry.model && (
        <Block kicker={dict.project.model}>
          <ModelViewer url={entry.model} labels={v} extra={extra} />
        </Block>
      )}

      <Block kicker={dict.project.description}>
        <Description text={pick(entry.description, locale)} />
      </Block>

      {entry.before && entry.after && (
        <Block kicker={dict.project.compare}>
          <BeforeAfter before={entry.before} after={entry.after} beforeLabel={dict.compare.before} afterLabel={dict.compare.after} />
        </Block>
      )}

      {entry.gallery.length > 0 && (
        <Block kicker={dict.project.gallery}>
          <Gallery
            items={entry.gallery.filter((g) => g.image).map((g) => ({ src: g.image!, caption: pick(g.caption, locale) }))}
            closeLabel={dict.project.close}
          />
        </Block>
      )}
    </article>
  );
}
