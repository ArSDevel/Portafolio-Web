import type { Metadata } from "next";
import { AreaListing } from "@/components/project/AreaListing";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.areas.items.modeling.title,
    description: dict.listing.subtitles.modeling,
    alternates: alternatesFor(locale, "/modeling"),
  };
}

export default function ModelingPage() {
  return <AreaListing area="modeling" />;
}
