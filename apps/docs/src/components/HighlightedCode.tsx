import type { ReactNode } from "react";

const tokens =
  /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Za-z][\w-]*|\[[\w.-]+\]|\([\w.-]+\)|\b(?:true|false|null|undefined|const|let|import|from|export|class|return|new)\b|[{}=<>])/g;

function tokenClass(token: string) {
  if (
    token.startsWith("<!--") ||
    token.startsWith("/*") ||
    token.startsWith("//")
  )
    return "code-comment";
  if (token.startsWith('"') || token.startsWith("'")) return "code-string";
  if (token.startsWith("<")) return "code-tag";
  if (token.startsWith("[") || token.startsWith("(")) return "code-binding";
  if (
    /^(true|false|null|undefined|const|let|import|from|export|class|return|new)$/.test(
      token,
    )
  )
    return "code-keyword";
  return "code-punctuation";
}

export function HighlightedCode({ code }: { code: string }) {
  const output: ReactNode[] = [];
  let cursor = 0;
  for (const match of code.matchAll(tokens)) {
    const index = match.index ?? 0;
    if (index > cursor) output.push(code.slice(cursor, index));
    output.push(
      <span className={tokenClass(match[0])} key={`${index}-${match[0]}`}>
        {match[0]}
      </span>,
    );
    cursor = index + match[0].length;
  }
  if (cursor < code.length) output.push(code.slice(cursor));
  return <>{output}</>;
}
