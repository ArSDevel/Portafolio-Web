import type { Area } from "./content";

// Per-area visual identity, shared by cards, headers and listings.
export const areaMeta: Record<Area, { accent: "mint" | "sun" | "coral"; ext: string; bg: string; text: string }> = {
  modeling: { accent: "mint", ext: ".blend", bg: "bg-mint", text: "text-mint" },
  building: { accent: "sun", ext: ".rbxl", bg: "bg-sun", text: "text-sun" },
  scripting: { accent: "coral", ext: ".luau", bg: "bg-coral", text: "text-coral" },
};

export const areas = ["modeling", "building", "scripting"] as const satisfies readonly Area[];

/** next/image can't optimize SVGs by default; serve them as-is. */
export const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

/** Extracts the video id from common YouTube URL shapes. */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

/** Splits a multi-line description into paragraphs on blank lines. */
export const paragraphs = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
