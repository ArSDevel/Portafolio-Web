"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Window } from "@/components/ui/Window";
import type { ModelStats } from "./ModelScene";

// Three.js is heavy: load it only on pages that actually show a model, and only in the browser.
const ModelScene = dynamic(() => import("./ModelScene"), {
  ssr: false,
  loading: () => <div className="grid size-full place-items-center font-mono text-sm text-muted">Loading…</div>,
});

export type ViewerLabels = {
  title: string;
  wireframe: string;
  rotate: string;
  reset: string;
  hint: string;
  properties: string;
  triangles: string;
  vertices: string;
  meshes: string;
  materials: string;
};

type Extra = { label: string; value: string };

export function ModelViewer({ url, labels, extra }: { url: string; labels: ViewerLabels; extra: Extra[] }) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [stats, setStats] = useState<ModelStats | null>(null);
  const onStats = useCallback((s: ModelStats) => setStats(s), []);

  const fmt = (n: number | undefined) => (n === undefined ? "…" : n.toLocaleString());
  const rows: Extra[] = [
    { label: labels.triangles, value: fmt(stats?.triangles) },
    { label: labels.vertices, value: fmt(stats?.vertices) },
    { label: labels.meshes, value: fmt(stats?.meshes) },
    { label: labels.materials, value: fmt(stats?.materials) },
    ...extra,
  ];

  const toggle = (on: boolean) =>
    `rounded-lg border-2 border-line px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${
      on ? "bg-line text-text" : "bg-mint text-line hover:bg-white/40"
    }`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Window title={labels.title} accent="mint" bodyClassName="relative">
        <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-2">
          <button type="button" className={toggle(wireframe)} aria-pressed={wireframe} onClick={() => setWireframe((v) => !v)}>
            {labels.wireframe}
          </button>
          <button type="button" className={toggle(autoRotate)} aria-pressed={autoRotate} onClick={() => setAutoRotate((v) => !v)}>
            {labels.rotate}
          </button>
          <button type="button" className={toggle(false)} onClick={() => setResetKey((k) => k + 1)}>
            {labels.reset}
          </button>
        </div>
        <div className="aspect-[4/3] w-full touch-none sm:aspect-video">
          <ModelScene url={url} wireframe={wireframe} autoRotate={autoRotate} resetKey={resetKey} onStats={onStats} />
        </div>
        <p className="border-t-3 border-line px-4 py-2 font-mono text-[11px] text-muted">{labels.hint}</p>
      </Window>

      {/* Studio-style Properties panel */}
      <Window title={labels.properties} accent="lilac" bodyClassName="font-mono text-xs">
        <dl>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-2 border-b border-line/60 last:border-b-0">
              <dt className="border-r border-line/60 bg-panel-2/50 px-3 py-2 text-muted">{row.label}</dt>
              <dd className="px-3 py-2 font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Window>
    </div>
  );
}
