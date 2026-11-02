import { cacheLife } from "next/cache";

export type ExperienceStats = {
  name: string;
  playing: number;
  visits: number;
  favorites: number;
  url: string;
};

/**
 * Public Roblox stats for a place. Runs on the server (Roblox's API blocks
 * browser requests via CORS) and is cached for an hour.
 * Returns null on any failure so the page simply hides the panel.
 */
export async function getExperienceStats(placeId: string): Promise<ExperienceStats | null> {
  "use cache";
  cacheLife("hours");

  if (!/^\d+$/.test(placeId)) return null;
  try {
    const universeRes = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    if (!universeRes.ok) return null;
    const { universeId } = (await universeRes.json()) as { universeId?: number };
    if (!universeId) return null;

    const gamesRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    if (!gamesRes.ok) return null;
    const { data } = (await gamesRes.json()) as {
      data?: { name: string; playing: number; visits: number; favoritedCount: number }[];
    };
    const game = data?.[0];
    if (!game) return null;

    return {
      name: game.name,
      playing: game.playing,
      visits: game.visits,
      favorites: game.favoritedCount,
      url: `https://www.roblox.com/games/${placeId}`,
    };
  } catch {
    return null;
  }
}
