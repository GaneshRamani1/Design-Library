import { useState } from "react";
import { DocsButton } from "./DocsButton";
import { HighlightedCode } from "./HighlightedCode";

export function CodeBlock({ code, language = "Angular" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="docs-code-surface group overflow-hidden rounded-2xl border border-white/10 bg-[#090909]"><div className="flex h-11 items-center justify-between border-b border-white/10 px-4"><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-zinc-500">{language}</span><DocsButton onClick={() => { void navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</DocsButton></div><pre className="max-h-96 overflow-auto p-5 text-[13px] leading-6 text-zinc-300"><code><HighlightedCode code={code} /></code></pre></div>;
}
