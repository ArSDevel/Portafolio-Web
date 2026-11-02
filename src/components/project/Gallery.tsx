"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { isSvg } from "@/lib/areas";

export type GalleryItem = { src: string; caption: string };

// Image grid; clicking opens a fullscreen viewer with keyboard navigation.
export function Gallery({ items, closeLabel }: { items: GalleryItem[]; closeLabel: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  if (items.length === 0) return null;
  const current = open === null ? null : items[open];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="toon group relative block aspect-video w-full overflow-hidden rounded-xl bg-bg"
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 380px, 50vw"
                unoptimized={isSvg(item.src)}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-line/80 px-3 py-1.5 text-left font-mono text-xs">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-line/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
          >
            <motion.figure
              key={current.src}
              className="flex w-full max-w-5xl flex-col gap-3"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="toon relative aspect-video overflow-hidden rounded-2xl bg-bg">
                <Image src={current.src} alt={current.caption} fill sizes="90vw" unoptimized={isSvg(current.src)} className="object-contain" />
              </div>
              <figcaption className="flex items-center gap-3 font-mono text-sm">
                <span className="text-muted">
                  {(open ?? 0) + 1}/{items.length}
                </span>
                <span>{current.caption}</span>
                <span className="ml-auto flex gap-2">
                  {items.length > 1 && (
                    <>
                      <button type="button" onClick={() => step(-1)} className="btn-toon rounded-lg bg-panel px-3 py-1" aria-label="←">
                        ←
                      </button>
                      <button type="button" onClick={() => step(1)} className="btn-toon rounded-lg bg-panel px-3 py-1" aria-label="→">
                        →
                      </button>
                    </>
                  )}
                  <button type="button" onClick={() => setOpen(null)} className="btn-toon rounded-lg bg-coral px-3 py-1 text-line">
                    {closeLabel}
                  </button>
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
