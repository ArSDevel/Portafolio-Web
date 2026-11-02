import { notFound } from "next/navigation";
import { locale } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import type es from "./dictionaries/es.json";

export type Dictionary = typeof es;

// `satisfies` makes the build fail if en.json is missing a key from es.json.
const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () =>
    import("./dictionaries/en.json").then((m) => m.default satisfies Dictionary),
};

/** Current locale from the URL; unknown values (e.g. /fr) become a 404. */
export async function getLocale(): Promise<Locale> {
  const current = await locale();
  if (current === undefined || !hasLocale(current)) notFound();
  return current;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

/** For places where root params aren't available yet (e.g. OG image route handlers). */
export const getDictionaryFor = (value: string): Promise<Dictionary> =>
  dictionaries[hasLocale(value) ? value : "es"]();
