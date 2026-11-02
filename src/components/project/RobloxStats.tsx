import type { Locale } from "@/i18n/config";
import { getExperienceStats } from "@/lib/roblox";

type Labels = { live: string; playing: string; visits: string; favorites: string; play: string };

export async function RobloxStats({ placeId, locale, labels }: { placeId: string; locale: Locale; labels: Labels }) {
  const stats = await getExperienceStats(placeId);
  if (!stats) return null;

  const fmt = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const items = [
    { label: labels.playing, value: fmt.format(stats.playing), color: "bg-mint" },
    { label: labels.visits, value: fmt.format(stats.visits), color: "bg-sun" },
    { label: labels.favorites, value: fmt.format(stats.favorites), color: "bg-coral" },
  ];

  return (
    <div className="toon flex flex-col gap-4 rounded-2xl bg-panel p-5 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 font-mono text-xs text-mint">
          <span className="size-2 animate-pulse-dot rounded-full bg-mint" /> {labels.live}
        </span>
        <span className="font-display text-xl font-semibold">{stats.name}</span>
      </div>
      <dl className="flex flex-wrap gap-3 sm:ml-auto">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border-2 border-line bg-panel-2 px-4 py-2">
            <dt className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
              <span className={`size-2 rounded-sm ${item.color}`} />
              {item.label}
            </dt>
            <dd className="font-display text-lg font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
      <a href={stats.url} target="_blank" rel="noreferrer" className="btn-toon rounded-xl bg-mint px-4 py-2 text-center font-display font-semibold text-line">
        {labels.play} ↗
      </a>
    </div>
  );
}
