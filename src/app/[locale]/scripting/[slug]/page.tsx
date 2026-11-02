import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ScriptExplorer, type ExplorerScript } from "@/components/code/ScriptExplorer";
import { Gallery } from "@/components/project/Gallery";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectSkeleton } from "@/components/project/ProjectSkeleton";
import { Block, Description, YouTube } from "@/components/project/ProjectSections";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getScriptingProject, pick, projectTitle } from "@/lib/content";
import { highlightLuau } from "@/lib/highlight";
import { staticSlugs } from "@/lib/projects";
import { alternatesFor } from "@/lib/site";

export function generateStaticParams() {
  return staticSlugs("scripting");
}

export async function generateMetadata({ params }: PageProps<"/[locale]/scripting/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [locale, project] = await Promise.all([getLocale(), getScriptingProject(slug)]);
  if (!project) return {};
  return {
    title: projectTitle(project.entry, locale),
    description: pick(project.entry.summary, locale),
    alternates: alternatesFor(locale, `/scripting/${slug}`),
  };
}

// params are URL data: read them inside Suspense so the shared shell stays prefetchable.
export default function ScriptingProjectPage({ params }: PageProps<"/[locale]/scripting/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ScriptingProject params={params} />
    </Suspense>
  );
}

async function ScriptingProject({ params }: Pick<PageProps<"/[locale]/scripting/[slug]">, "params">) {
  const { slug } = await params;
  const [locale, dict, project] = await Promise.all([getLocale(), getDictionary(), getScriptingProject(slug)]);
  if (!project) notFound();
  const { entry } = project;
  const title = projectTitle(entry, locale);

  const scripts: ExplorerScript[] = await Promise.all(
    entry.scripts
      .filter((s) => s.code.trim())
      .map(async (s) => ({
        name: s.name,
        kind: s.kind,
        location: s.location,
        code: s.code,
        html: await highlightLuau(s.code, s.highlight),
      })),
  );

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-14">
      <ProjectHeader
        area="scripting"
        areaLabel={dict.areas.items.scripting.title}
        backLabel={dict.project.back}
        title={title}
        summary={pick(entry.summary, locale)}
        date={entry.date}
        tags={entry.tags}
        locale={locale}
      />

      <Block kicker={dict.project.description}>
        <Description text={pick(entry.description, locale)} />
        {entry.repoUrl && (
          <a href={entry.repoUrl} target="_blank" rel="noreferrer" className="btn-toon w-fit rounded-xl bg-panel px-4 py-2 font-mono text-sm font-bold">
            {dict.project.repo} ↗
          </a>
        )}
      </Block>

      {scripts.length > 0 && (
        <Block kicker={dict.project.code}>
          <ScriptExplorer scripts={scripts} labels={dict.explorer} />
        </Block>
      )}

      {entry.video && (
        <Block kicker={dict.project.video}>
          <YouTube url={entry.video} title={title} />
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
