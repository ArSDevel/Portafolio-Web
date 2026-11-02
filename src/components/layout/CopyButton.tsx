"use client";

import { useState, type ReactNode } from "react";

type Props = { value: string; copiedLabel: string; className?: string; children: ReactNode };

// Copies `value` to the clipboard and briefly shows a confirmation.
export function CopyButton({ value, copiedLabel, className, children }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked; the value is still visible to copy by hand.
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? `✓ ${copiedLabel}` : children}
    </button>
  );
}
