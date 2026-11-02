"use client";

import { useSyncExternalStore } from "react";

export type CodeTheme = "studio" | "vscode";

const KEY = "code-theme";
const EVENT = "code-theme-change";

function read(): CodeTheme {
  try {
    return localStorage.getItem(KEY) === "vscode" ? "vscode" : "studio";
  } catch {
    return "studio";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Code theme shared by every code block on the page and remembered per visitor. */
export function useCodeTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "studio" as CodeTheme);

  function setTheme(next: CodeTheme) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Storage blocked (private mode): the choice just isn't remembered.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return [theme, setTheme] as const;
}
