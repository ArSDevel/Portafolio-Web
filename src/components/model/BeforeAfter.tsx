"use client";

import Image from "next/image";
import { useState } from "react";
import { isSvg } from "@/lib/areas";

type Props = {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
};

// Drag the handle (or use the keyboard on the slider) to compare two images.
export function BeforeAfter({ before, after, beforeLabel, afterLabel }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div className="toon relative aspect-video select-none overflow-hidden rounded-2xl bg-bg">
      <Image src={after} alt={afterLabel} fill sizes="(min-width: 1024px) 1100px, 100vw" unoptimized={isSvg(after)} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={beforeLabel} fill sizes="(min-width: 1024px) 1100px, 100vw" unoptimized={isSvg(before)} className="object-cover" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-sun" style={{ left: `${pos}%` }}>
        <span className="toon absolute top-1/2 left-1/2 grid size-10 -translate-1/2 place-items-center rounded-full bg-sun font-mono text-sm font-bold text-line">
          ⇆
        </span>
      </div>

      <span className="absolute top-3 left-3 rounded-md border-2 border-line bg-panel px-2 py-0.5 font-mono text-xs">{beforeLabel}</span>
      <span className="absolute top-3 right-3 rounded-md border-2 border-line bg-mint px-2 py-0.5 font-mono text-xs text-line">{afterLabel}</span>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${beforeLabel} / ${afterLabel}`}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
