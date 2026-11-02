"use client";

import { motion, useReducedMotion } from "motion/react";

const CUBE = 64;
const faces = [
  `rotateY(0deg) translateZ(${CUBE / 2}px)`,
  `rotateY(90deg) translateZ(${CUBE / 2}px)`,
  `rotateY(180deg) translateZ(${CUBE / 2}px)`,
  `rotateY(-90deg) translateZ(${CUBE / 2}px)`,
  `rotateX(90deg) translateZ(${CUBE / 2}px)`,
  `rotateX(-90deg) translateZ(${CUBE / 2}px)`,
];

// Modeling: a spinning wireframe cube with a diagonal edge per face (like triangulated quads).
export function WireCube() {
  return (
    <div className="grid h-full place-items-center [perspective:500px]">
      <div
        className="relative animate-spin-slow [transform-style:preserve-3d]"
        style={{ width: CUBE, height: CUBE }}
      >
        {faces.map((transform) => (
          <div
            key={transform}
            className="absolute inset-0 border-2 border-mint bg-mint/5"
            style={{
              transform,
              backgroundImage:
                "linear-gradient(to top right, transparent calc(50% - 1px), var(--mint) 50%, transparent calc(50% + 1px))",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const blocks = [
  { x: 0, y: 2, color: "bg-sun" },
  { x: 1, y: 2, color: "bg-coral" },
  { x: 2, y: 2, color: "bg-sky" },
  { x: 0.5, y: 1, color: "bg-lilac" },
  { x: 1.5, y: 1, color: "bg-mint" },
  { x: 1, y: 0, color: "bg-sun" },
];

// Building: blocks drop in one by one and form a small structure, then loop.
export function BlockStack() {
  const reduce = useReducedMotion();
  const size = 26;

  return (
    <div className="grid h-full place-items-center">
      <div className="relative" style={{ width: size * 3, height: size * 3 }}>
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            className={`toon absolute rounded-md ${b.color}`}
            style={{ width: size, height: size, left: b.x * size, top: b.y * size, boxShadow: "var(--shadow-toon-sm)" }}
            initial={reduce ? false : { y: -60, opacity: 0 }}
            animate={reduce ? undefined : { y: [-60, 0, 0, 0], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4,
              times: [0, 0.12, 0.85, 1],
              delay: i * 0.25,
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const lines = [
  { indent: 0, width: 70, color: "bg-[var(--syn-keyword)]" },
  { indent: 1, width: 55, color: "bg-[var(--syn-builtin)]" },
  { indent: 1, width: 80, color: "bg-[var(--syn-string)]" },
  { indent: 2, width: 45, color: "bg-[var(--syn-function)]" },
  { indent: 1, width: 35, color: "bg-[var(--syn-number)]" },
  { indent: 0, width: 25, color: "bg-[var(--syn-keyword)]" },
];

// Scripting: indented "code" bars that type themselves out, then loop.
export function CodeBars() {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col justify-center gap-2 px-6">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className={`h-2.5 origin-left rounded-full ${l.color}`}
          style={{ marginLeft: l.indent * 16, width: `${l.width}%` }}
          initial={reduce ? false : { scaleX: 0 }}
          animate={reduce ? undefined : { scaleX: [0, 1, 1, 0] }}
          transition={{
            duration: 4.2,
            times: [0, 0.15, 0.85, 1],
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
      ))}
    </div>
  );
}
