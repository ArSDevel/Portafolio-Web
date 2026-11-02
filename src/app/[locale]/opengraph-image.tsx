import { ImageResponse } from "next/og";
import { locales } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/get-dictionary";

export const alt = "Ath — @HolandaMexico";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#0b0a10";

// Social preview (Discord, X, WhatsApp…) in the site's cartoon-editor style.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const dict = await getDictionaryFor((await params).locale);
  const chips = [
    { label: dict.areas.items.modeling.title, bg: "#7ce0b6" },
    { label: dict.areas.items.building.title, bg: "#ffd166" },
    { label: dict.areas.items.scripting.title, bg: "#ff7a85" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 56,
          background: "#15121e",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.05) 2px, transparent 2px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#201c2e",
            border: `6px solid ${ink}`,
            borderRadius: 32,
            boxShadow: `14px 14px 0 ${ink}`,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", background: "#7cc4ff", borderBottom: `6px solid ${ink}` }}>
            {["#ff7a85", "#ffd166", "#7ce0b6"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c, border: `4px solid ${ink}` }} />
            ))}
            <div style={{ marginLeft: 12, fontSize: 26, fontWeight: 700, color: ink }}>Portfolio.server.luau</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px", gap: 18 }}>
            <div style={{ fontSize: 30, color: "#7d7891" }}>-- @HolandaMexico</div>
            <div style={{ display: "flex", fontSize: 108, fontWeight: 800, color: "#f2efe6", letterSpacing: -3 }}>
              Ath<span style={{ color: "#b79cff" }}>.</span>
            </div>
            <div style={{ fontSize: 40, color: "#ffd166" }}>{dict.hero.roles.join(" · ")}</div>
            <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  style={{
                    padding: "10px 22px",
                    fontSize: 28,
                    fontWeight: 700,
                    color: ink,
                    background: chip.bg,
                    border: `5px solid ${ink}`,
                    borderRadius: 16,
                    boxShadow: `6px 6px 0 ${ink}`,
                  }}
                >
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
