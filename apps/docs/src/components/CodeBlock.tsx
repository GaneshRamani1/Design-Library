import { useState } from "react";
import { DocsButton } from "./DocsButton";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#090909]"><DocsButton className="absolute right-3 top-3 z-10" onClick={() => { void navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</DocsButton><pre className="max-h-96 overflow-auto p-5 pr-24 text-[13px] leading-6 text-zinc-300"><code>{code}</code></pre></div>;
}
