import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { areas } from "@/lib/areas";
import { getProjectsByArea } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

type Entry = { path: string; priority: number; date?: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await Promise.all(areas.map(getProjectsByArea))).flat();

  const entries: Entry[] = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.6 },
    ...areas.map((area) => ({ path: `/${area}`, priority: 0.8 })),
    ...projects.map((p) => ({ path: `/${p.area}/${p.slug}`, priority: 0.7, date: p.entry.date })),
  ];

  return entries.map(({ path, priority, date }) => ({
    url: `${siteUrl}/es${path}`,
    lastModified: date ? new Date(date) : undefined,
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
    },
  }));
}
