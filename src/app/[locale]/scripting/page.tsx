import type { Metadata } from "next";
import { AreaListing } from "@/components/project/AreaListing";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.areas.items.scripting.title,
    description: dict.listing.subtitles.scripting,
    alternates: alternatesFor(locale, "/scripting"),
  };
}

export default function ScriptingPage() {
  return <AreaListing area="scripting" />;
}
