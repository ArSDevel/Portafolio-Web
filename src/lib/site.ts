/**
 * Public URL of the site, used for canonical links, sitemap and social images.
 * Set NEXT_PUBLIC_SITE_URL once you have a custom domain; on Vercel the
 * production URL is detected automatically.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Canonical + hreflang links for a path that exists in every locale, e.g. "/modeling". */
export function alternatesFor(locale: string, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: { es: `/es${path}`, en: `/en${path}`, "x-default": `/es${path}` },
  };
}
