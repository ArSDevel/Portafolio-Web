import { createReader } from "@keystatic/core/reader";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

/** Cache tag for everything read from Keystatic; invalidated whenever the panel saves. */
export const CONTENT_TAG = "content";

export type Area = "modeling" | "building" | "scripting";

type Localized = { es: string; en: string };

/** Picks the visitor's language, falling back to Spanish when English is empty. */
export const pick = (value: Localized, locale: Locale) =>
  value[locale]?.trim() || value.es;

export async function getModelingProjects() {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  return sortByDate(await reader.collections.modeling.all());
}

export async function getBuildingProjects() {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  return sortByDate(await reader.collections.building.all());
}

export async function getScriptingProjects() {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  return sortByDate(await reader.collections.scripting.all());
}

export async function getProfile() {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  return reader.singletons.profile.read();
}

const bySlug = <T extends { slug: string }>(items: T[], slug: string) =>
  items.find((item) => item.slug === slug) ?? null;

export const getModelingProject = async (slug: string) => bySlug(await getModelingProjects(), slug);
export const getBuildingProject = async (slug: string) => bySlug(await getBuildingProjects(), slug);
export const getScriptingProject = async (slug: string) => bySlug(await getScriptingProjects(), slug);

export type ModelingProject =Awaited<ReturnType<typeof getModelingProjects>>[number];
export type BuildingProject = Awaited<ReturnType<typeof getBuildingProjects>>[number];
export type ScriptingProject = Awaited<ReturnType<typeof getScriptingProjects>>[number];

function sortByDate<T extends { entry: { date: string | null } }>(items: T[]) {
  return items.sort((a, b) => (b.entry.date ?? "").localeCompare(a.entry.date ?? ""));
}

/** Title in the visitor's language. */
export const projectTitle = (
  entry: { title: string; titleEn: string },
  locale: Locale,
) => (locale === "en" && entry.titleEn.trim()) || entry.title;
