"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

// Soft glow that follows the pointer. Uses CSS variables, so moving it never re-renders React.
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={handleMove} className={`group relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--lilac) 14%, transparent), transparent 70%)",
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
