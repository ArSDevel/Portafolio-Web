import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";

/**
 * Picks the visitor's language from the Accept-Language header,
 * e.g. "en-US,en;q=0.9,es;q=0.8". Only "es" and "en" are supported.
 */
function getPreferredLocale(acceptLanguage: string | null): Locale {
  // TODO(human): parse acceptLanguage and return "es" or "en".
  void acceptLanguage;
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (hasLocale(firstSegment)) return;

  const target = getPreferredLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, the Keystatic panel and any file with an extension.
  matcher: ["/((?!_next|api|keystatic|.*\\..*).*)"],
};
