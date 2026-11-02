/**
 * Tiny Luau tokenizer for decorative, animated snippets.
 * Real project scripts will be highlighted with Shiki (phase 4).
 */
export type TokenType =
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "builtin"
  | "function"
  | "type"
  | "plain";

export type Token = { type: TokenType; text: string };

const KEYWORDS = new Set([
  "and", "break", "continue", "do", "else", "elseif", "end", "false", "for",
  "function", "if", "in", "local", "nil", "not", "or", "repeat", "return",
  "then", "true", "until", "while", "export", "type",
]);

const BUILTINS = new Set([
  "game", "workspace", "script", "print", "warn", "require", "task",
  "Instance", "Vector3", "CFrame", "Color3", "Enum", "math", "string",
  "table", "self",
]);

// Order matters: comments and strings must win over everything else.
const PATTERN =
  /(--[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+|.)/g;

export function tokenizeLuau(source: string): Token[] {
  const tokens: Token[] = [];
  let prevWord = "";

  for (const match of source.matchAll(PATTERN)) {
    const [text, comment, str, num, word] = match;
    const rest = source.slice((match.index ?? 0) + text.length);

    let type: TokenType = "plain";
    if (comment) type = "comment";
    else if (str) type = "string";
    else if (num) type = "number";
    else if (word) {
      if (KEYWORDS.has(word)) type = "keyword";
      else if (BUILTINS.has(word)) type = "builtin";
      else if (/^\s*[(`"]/.test(rest)) type = "function";
      else if (prevWord === ":" && /^[A-Z]/.test(word)) type = "type";
    }

    tokens.push({ type, text });
    if (text.trim()) prevWord = text;
  }

  return tokens;
}
