import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LocaleSwitch } from "./LocaleSwitch";
import { NavLinks } from "./NavLinks";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = [
    { href: `/${locale}/modeling`, label: dict.nav.modeling },
    { href: `/${locale}/building`, label: dict.nav.building },
    { href: `/${locale}/scripting`, label: dict.nav.scripting },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-3 border-line bg-bg/85 backdrop-blur">
      <nav className="relative mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 md:gap-6">
        <Link href={`/${locale}`} className="group flex items-center gap-2.5">
          <span className="toon grid size-9 place-items-center rounded-xl bg-sun font-display text-lg font-bold text-line transition-transform group-hover:-rotate-6">
            A
          </span>
          <span className="font-display text-xl font-semibold">Ath</span>
          <span className="hidden font-mono text-xs text-muted lg:inline">@HolandaMexico</span>
        </Link>

        <NavLinks items={items} menuLabel={dict.nav.menu} />
        <LocaleSwitch current={locale} label={dict.nav.switchLocale} />
      </nav>
    </header>
  );
}
