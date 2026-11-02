"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string };

// Desktop links with an animated "active" pill, plus a mobile dropdown menu.
export function NavLinks({ items, menuLabel }: { items: Item[]; menuLabel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <ul className="ml-auto hidden items-center gap-1 md:flex">
        {items.map((item) => (
          <li key={item.href} className="relative">
            {isActive(item.href) && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-lg border-2 border-line bg-panel"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Link
              href={item.href}
              className={`relative block rounded-lg px-3 py-1.5 font-mono text-sm transition-colors ${
                isActive(item.href) ? "text-text" : "text-muted hover:text-text"
              }`}
            >
              <span className="text-lilac">./</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-toon ml-auto rounded-xl bg-panel px-3 py-1.5 font-mono text-xs font-bold md:hidden"
      >
        {open ? "✕" : "☰"} {menuLabel}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="toon absolute top-full right-4 left-4 mt-2 flex flex-col gap-1 rounded-2xl bg-panel p-3 md:hidden"
          >
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 font-mono text-sm ${isActive(item.href) ? "bg-panel-2 text-sun" : ""}`}
                >
                  <span className="text-lilac">./</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
