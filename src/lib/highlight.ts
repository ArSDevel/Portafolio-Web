import { cacheLife } from "next/cache";
import {
  createHighlighter,
  createJavaScriptRegexEngine,
  type ShikiTransformer,
  type ThemeRegistration,
} from "shiki";

/**
 * "Studio" theme: colors inspired by Roblox Studio's dark script editor,
 * mapped onto the TextMate scopes of Shiki's Luau grammar.
 */
const studioTheme: ThemeRegistration = {
  name: "ath-studio",
  type: "dark",
  colors: { "editor.background": "#201c2e", "editor.foreground": "#cccccc" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#7d7891", fontStyle: "italic" } },
    { scope: ["string", "string.interpolated", "string.other.multiline"], settings: { foreground: "#adf195" } },
    { scope: ["constant.character.escape"], settings: { foreground: "#ffc600" } },
    { scope: ["constant.numeric"], settings: { foreground: "#ffc600" } },
    {
      scope: ["keyword.control", "keyword.operator.logical", "storage.modifier.local", "storage.type", "constant.language", "variable.language.self"],
      settings: { foreground: "#f86d7c", fontStyle: "bold" },
    },
    { scope: ["support.function", "support.constant"], settings: { foreground: "#84d6f7" } },
    { scope: ["entity.name.function"], settings: { foreground: "#fdfbac" } },
    { scope: ["entity.name.type", "support.type", "keyword.operator.typecast"], settings: { foreground: "#b79cff" } },
    { scope: ["variable.parameter"], settings: { foreground: "#e4e1ee" } },
    { scope: ["variable.other.property", "variable.property"], settings: { foreground: "#e4e1ee" } },
    { scope: ["meta.attribute", "storage.type.attribute", "keyword.operator.attribute"], settings: { foreground: "#ff9e64" } },
    { scope: ["keyword.operator", "punctuation"], settings: { foreground: "#cccccc" } },
  ],
};

let highlighter: ReturnType<typeof createHighlighter> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: [studioTheme, "dark-plus"],
    langs: ["luau"],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/** Parses "3-5, 12" into the set {3, 4, 5, 12}. */
export function parseLineRanges(input: string | null | undefined): Set<number> {
  const lines = new Set<number>();
  for (const part of (input ?? "").split(",")) {
    const [start, end = start] = part.split("-").map((n) => Number.parseInt(n, 10));
    if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
    for (let i = Math.min(start, end); i <= Math.max(start, end) && i - start < 500; i++) lines.add(i);
  }
  return lines;
}

function highlightLines(lines: Set<number>): ShikiTransformer {
  return {
    name: "highlight-lines",
    line(node, line) {
      if (lines.has(line)) this.addClassToHast(node, "hl");
    },
  };
}

/**
 * Highlights Luau with both themes at once. Colors are emitted as CSS variables
 * (--shiki-studio / --shiki-vscode), so switching theme is a pure CSS change.
 */
export async function highlightLuau(code: string, highlight?: string | null) {
  "use cache";
  cacheLife("max");
  const shiki = await getHighlighter();
  return shiki.codeToHtml(code.replace(/\s+$/, ""), {
    lang: "luau",
    themes: { studio: "ath-studio", vscode: "dark-plus" },
    defaultColor: false,
    transformers: [highlightLines(parseLineRanges(highlight))],
  });
}
