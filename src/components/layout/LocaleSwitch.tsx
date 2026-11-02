"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

type Props = {
  current: Locale;
  label: string;
};

// Swaps the first path segment (/es/... ↔ /en/...) and keeps the rest of the URL.
export function LocaleSwitch({ current, label }: Props) {
  const pathname = usePathname();
  const target = locales.find((l) => l !== current) ?? current;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <Link
      href={`/${target}${rest ? `/${rest}` : ""}`}
      hrefLang={target}
      className="btn-toon rounded-xl bg-panel px-3 py-1.5 font-mono text-xs font-bold"
    >
      <span className="text-muted">{current.toUpperCase()} → </span>
      {label}
    </Link>
  );
}
