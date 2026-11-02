import type { ReactNode } from "react";

// Separate root layout: the admin panel lives outside the /es and /en site.
export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
