"use client";

import { motion, useReducedMotion } from "motion/react";

type Step = { title: string; description: string };

const colors = ["bg-sky", "bg-mint", "bg-sun", "bg-coral", "bg-lilac"];

// Pipeline of steps; the connecting line "fills" as the section scrolls into view.
export function ProcessSteps({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mt-12">
      <motion.div
        className="absolute top-7 right-8 left-8 hidden h-1 origin-left rounded-full bg-lilac md:block"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        aria-hidden
      />
      <ol className="relative grid gap-6 md:grid-cols-5">
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            className="flex flex-col gap-3"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ delay: 0.2 + i * 0.22, type: "spring", stiffness: 140, damping: 16 }}
          >
            <span
              className={`toon grid size-14 place-items-center rounded-2xl font-mono text-lg font-bold text-line ${colors[i % colors.length]}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl font-semibold">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
