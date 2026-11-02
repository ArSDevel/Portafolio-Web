import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getProfile } from "@/lib/content";
import { CopyButton } from "./CopyButton";

const linkClass =
  "btn-toon flex items-center gap-2 rounded-xl bg-panel-2 px-4 py-2.5 font-mono text-sm font-bold";

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const profile = await getProfile();

  const links = [
    { label: "Roblox", href: profile?.roblox, dot: "bg-coral" },
    { label: "Talent Hub", href: profile?.talentHub, dot: "bg-sky" },
    { label: "DevForum", href: profile?.devforum, dot: "bg-lilac" },
    { label: "X / Twitter", href: profile?.twitter, dot: "bg-text" },
    { label: "YouTube", href: profile?.youtube, dot: "bg-coral" },
    { label: profile?.email ?? "", href: profile?.email ? `mailto:${profile.email}` : null, dot: "bg-sun" },
  ].filter((l): l is typeof l & { href: string } => Boolean(l.href));

  const discord = profile?.discord?.trim();
  const hasAny = Boolean(discord) || links.length > 0;

  return (
    <footer id="contact" className="mt-24 scroll-mt-20 border-t-3 border-line bg-panel">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-14">
        <p className="font-mono text-sm text-lilac">{"// "}{dict.footer.kicker}</p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">{dict.footer.title}</h2>
        <p className="max-w-xl text-muted">{hasAny ? dict.footer.text : dict.footer.soon}</p>

        {hasAny && (
          <div className="mt-2 flex flex-wrap gap-3">
            {discord && (
              <CopyButton value={discord} copiedLabel={dict.footer.copied} className={`${linkClass} bg-lilac text-line`}>
                <span className="size-2.5 rounded-full border-2 border-line bg-panel" />
                Discord: {discord}
              </CopyButton>
            )}
            {links.map((l) => (
              <a key={l.label} href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" className={linkClass}>
                <span className={`size-2.5 rounded-full border-2 border-line ${l.dot}`} />
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Editor-style status bar */}
      <div className="border-t-3 border-line bg-lilac font-mono text-[11px] font-bold text-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-1.5">
          <span>⎇ main</span>
          <span>✓ 0 errors</span>
          <span className="hidden sm:inline">Luau</span>
          <span className="ml-auto">{locale.toUpperCase()} · UTF-8</span>
          <span>© Ath · @HolandaMexico</span>
        </div>
      </div>
    </footer>
  );
}
