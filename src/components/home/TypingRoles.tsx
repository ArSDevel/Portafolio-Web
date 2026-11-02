"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1600;

// Types each role, holds it, deletes it, then moves to the next one.
export function TypingRoles({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = roles[index];

    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && text === full) delay = HOLD_MS;

    const id = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      } else {
        setText(full.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(id);
  }, [text, deleting, index, roles, reduce]);

  return (
    <span className="text-sun">
      {reduce ? roles[0] : text}
      <span className="ml-0.5 inline-block w-[0.55ch] animate-blink bg-sun" aria-hidden>
        &nbsp;
      </span>
    </span>
  );
}
