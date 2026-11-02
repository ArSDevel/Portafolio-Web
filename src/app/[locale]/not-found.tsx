import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <section className="bg-grid flex min-h-[60vh] items-center border-b-3 border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-5 px-4 py-20">
        <p className="font-mono text-sm text-coral">✕ Error: Instance not found</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{dict.notFound.title}</h1>
        <p className="text-lg text-muted">{dict.notFound.text}</p>
        <Link href={`/${locale}`} className="btn-toon rounded-xl bg-sun px-5 py-2.5 font-display font-semibold text-line">
          {dict.notFound.back}
        </Link>
      </div>
    </section>
  );
}
