import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { componentLoaders } from "../pages/catalog";
import type { ComponentDoc } from "../pages/types";
import { DocsSearch } from "./DocsControls";

interface SearchEntry { title: string; context: string; path: string; terms: string; }

function entriesFor(doc: ComponentDoc): SearchEntry[] {
  const path = `/components/${doc.slug}`;
  const component = { title: doc.title, context: doc.category, path, terms: `${doc.title} ${doc.category} ${doc.description}` };
  const inputs = doc.inputs.map((item) => ({ title: item.name, context: `${doc.title} · Input`, path, terms: `${item.name} ${item.type} ${item.description}` }));
  const outputs = doc.outputs.map((item) => ({ title: item.name, context: `${doc.title} · Output`, path, terms: `${item.name} ${item.type} ${item.description}` }));
  const configs = doc.configuration.map((item) => ({ title: item.property, context: `${doc.title} · ${item.kind}`, path, terms: `${item.property} ${item.label} ${item.description}` }));
  return [component, ...inputs, ...outputs, ...configs];
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [entries, setEntries] = useState<SearchEntry[]>([
    { title: "Overview", context: "Welcome", path: "/", terms: "overview welcome design system" },
    { title: "Installation", context: "Foundations", path: "/foundations/installation", terms: "install setup foundations" },
    { title: "Tokens", context: "Foundations", path: "/foundations/tokens", terms: "tokens color spacing theme foundations" },
  ]);

  useEffect(() => {
    void Promise.allSettled(Object.values(componentLoaders).map((load) => load())).then((results) => {
      const docs = results.flatMap((result) => result.status === "fulfilled" ? entriesFor(result.value) : []);
      setEntries((current) => [...current.slice(0, 3), ...docs]);
    });
  }, []);

  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return entries.filter((entry) => terms.every((term) => `${entry.title} ${entry.context} ${entry.terms}`.toLowerCase().includes(term))).slice(0, 8);
  }, [entries, query]);

  return <div className="relative" onFocusCapture={() => setFocused(true)} onBlurCapture={() => window.setTimeout(() => setFocused(false), 120)}><DocsSearch id="global-docs-search" label="Search documentation" placeholder="Search all documentation…" value={query} onChange={setQuery} />{focused && query.trim() && <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-2xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">{results.length ? results.map((result, index) => <button className="block w-full rounded-xl px-3 py-2.5 text-left hover:bg-white/5" key={`${result.path}-${result.context}-${result.title}-${index}`} onMouseDown={(event) => event.preventDefault()} onClick={() => { navigate(result.path); setQuery(""); setFocused(false); }} type="button"><span className="block text-sm text-white">{result.title}</span><span className="mt-0.5 block text-xs text-zinc-500">{result.context}</span></button>) : <p className="p-4 text-sm text-zinc-500">No documentation matches “{query}”.</p>}</div>}</div>;
}
