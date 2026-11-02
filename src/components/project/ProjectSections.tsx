import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { paragraphs, youtubeId } from "@/lib/areas";

/** Titled block used inside project pages ("// galería", "// código"...). */
export function Block({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-5">
      <h2 className="font-mono text-sm text-lilac">{"// "}{kicker}</h2>
      {children}
    </Reveal>
  );
}

export function Description({ text }: { text: string }) {
  const parts = paragraphs(text);
  if (parts.length === 0) return null;
  return (
    <div className="flex max-w-3xl flex-col gap-4 text-[17px] leading-relaxed">
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}

export function YouTube({ url, title }: { url: string | null; title: string }) {
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <div className="toon aspect-video overflow-hidden rounded-2xl bg-bg">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        className="size-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="toon rounded-2xl border-dashed bg-panel p-10 text-center font-mono text-sm text-muted">
      {text}
    </div>
  );
}
