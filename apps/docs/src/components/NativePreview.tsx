import { useEffect, useRef, useState } from "react";
import type { ComponentDoc } from "../pages/types";

const directives = new Set(["carousel", "link", "popover", "tooltip", "validation"]);

function sampleValue(name: string, type: string, fallback: string, title: string) {
  if (name === "id") return `docs-${title.toLowerCase().replaceAll(" ", "-")}`;
  if (["label", "heading", "title"].includes(name)) return title;
  if (name === "description") return `A live ${title} example from Arcwell UI.`;
  if (name === "options" || name === "items") return [{ value: "one", label: "First option" }, { value: "two", label: "Second option" }];
  if (name === "value" && type.includes("number")) return 40;
  if (fallback === "Required") return type.includes("number") ? 0 : title;
  if (fallback === "true") return true;
  if (fallback === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(fallback)) return Number(fallback);
  if (/^".*"$/.test(fallback)) return fallback.slice(1, -1);
  return undefined;
}

export function NativePreview({ component }: { component: ComponentDoc }) {
  const host = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!host.current || directives.has(component.slug)) return;
    const element = document.createElement(`arc-${component.slug}`);
    element.textContent = `${component.title} content`;
    for (const input of component.inputs) {
      const value = sampleValue(input.name, input.type, input.defaultValue, component.title);
      if (value !== undefined) Object.assign(element, { [input.name]: value });
    }
    const listeners = component.outputs.map((output) => {
      const listener = (event: Event) => setEvents((current) => [`${output.name}: ${JSON.stringify((event as CustomEvent).detail)}`, ...current].slice(0, 4));
      element.addEventListener(output.name, listener);
      return [output.name, listener] as const;
    });
    host.current.replaceChildren(element);
    return () => listeners.forEach(([name, listener]) => element.removeEventListener(name, listener));
  }, [component]);

  if (directives.has(component.slug)) return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6"><p className="text-sm text-zinc-400">This Angular directive is applied to a compatible host element.</p><code className="mt-4 block text-emerald-300">{component.selector}</code></div>;
  return <div className="overflow-hidden rounded-3xl border border-white/10"><div className="example-grid grid min-h-64 place-items-center p-8"><div ref={host} className="w-full max-w-xl" /></div><div aria-live="polite" className="border-t border-white/10 bg-black p-4 text-xs text-zinc-500">{events.length ? events.map((event) => <div key={event}>{event}</div>) : "Interact with the component to inspect emitted outputs."}</div></div>;
}
