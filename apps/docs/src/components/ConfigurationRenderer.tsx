import { useEffect, useRef, useState } from "react";
import type { ComponentDoc, ConfigurationExample } from "../pages/types";
import { DocsButton } from "./DocsButton";

const directiveSlugs = new Set(["carousel", "link", "popover", "tooltip", "validation"]);

export function inferredValue(example: ConfigurationExample) {
  const text = example.description;
  if (/turned (?:on|true)|has it turned on/i.test(text) || /true$/i.test(example.label)) return true;
  if (/turned (?:off|false)|has it turned off/i.test(text) || /false$/i.test(example.label)) return false;
  const quoted = text.match(/[“"]([^”"]+)[”"]/g)?.at(-1)?.slice(1, -1);
  if (quoted !== undefined) return /^-?\d+(\.\d+)?$/.test(quoted) ? Number(quoted) : quoted;
  if (example.property === "options" || example.property === "items") return [{ value: "one", label: "First option" }, { value: "two", label: "Second option" }];
  if (example.property === "appearance") return { radius: "18px", padding: "20px" };
  if (example.property === "styleTokens") return { "--dl-primary": "#a7f3d0" };
  return "Example";
}

function baseProperties(component: ComponentDoc) {
  const properties: Record<string, unknown> = {};
  for (const input of component.inputs) {
    if (input.name === "id") properties.id = `config-${component.slug}`;
    if (input.name === "label") properties.label = component.title;
    if (input.name === "heading") properties.heading = component.title;
    if (input.name === "description") properties.description = `Configured ${component.title} example.`;
    if (input.name === "options") properties.options = [{ value: "one", label: "First option" }, { value: "two", label: "Second option" }];
    if (input.name === "items") properties.items = [{ value: "one", label: "First item" }, { value: "two", label: "Second item" }];
  }
  return properties;
}

function setProperty(properties: Record<string, unknown>, path: string, value: unknown) {
  const [root, child] = path.split(".");
  properties[root] = child ? { ...(properties[root] as object ?? {}), [child]: value } : value;
}

function binding(value: unknown) {
  if (typeof value === "string") return `'${value.replaceAll("'", "\\'")}'`;
  return JSON.stringify(value);
}

function selectorMarkup(component: ComponentDoc, property: string, value: unknown) {
  const selector = component.selector.split(",")[0].trim();
  const nested = property.split(".");
  const bindingName = nested[0];
  const bindingValue = nested[1] ? { [nested[1]]: value } : value;
  if (selector.startsWith("[")) return `<div\n  ${selector.slice(1, -1)}\n  [${bindingName}]="${binding(bindingValue)}"\n>\n  Content\n</div>`;
  const attributeSelector = selector.match(/^(\w+)\[([^\]]+)\]$/);
  if (attributeSelector) {
    const dependency = property === "loadingLabel" ? `\n  [loading]="true"` : "";
    return `<${attributeSelector[1]}\n  ${attributeSelector[2]}\n  [${bindingName}]="${binding(bindingValue)}"${dependency}\n>\n  ${component.title}\n</${attributeSelector[1]}>`;
  }
  return `<${selector}\n  [${bindingName}]="${binding(bindingValue)}"\n>\n  ${component.title} content\n</${selector}>`;
}

export function ConfigurationRenderer({ component, example, embedded = false }: { component: ComponentDoc; example: ConfigurationExample; embedded?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [renderOverlay, setRenderOverlay] = useState(false);
  const value = inferredValue(example);
  const source = selectorMarkup(component, example.property, value);
  const requiresTrigger = component.category === "Overlays";

  useEffect(() => {
    if (!host.current || directiveSlugs.has(component.slug) || (requiresTrigger && !renderOverlay)) return;
    const element = document.createElement(`arc-${component.slug}`);
    const properties = baseProperties(component);
    setProperty(properties, example.property, value);
    if (example.property === "loadingLabel") properties.loading = true;
    Object.assign(element, properties);
    element.textContent = `${component.title} content`;
    host.current.replaceChildren(element);
  }, [component, example.property, renderOverlay, requiresTrigger, value]);

  const valueLabel = typeof value === "object" ? example.label : String(value);
  return <article className={`overflow-hidden bg-white/[.025] ${embedded ? "" : "rounded-2xl border border-white/10"}`}><div className="flex items-start justify-between gap-3 p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-zinc-600">What this value changes</p><p className="mt-2 text-sm leading-6 text-zinc-300">{example.description}</p></div><code className="shrink-0 text-xs text-zinc-500">{valueLabel}</code></div><div className="example-grid grid min-h-40 place-items-center border-y border-white/10 p-5">{directiveSlugs.has(component.slug) ? <code className="text-sm text-emerald-300">{component.selector}</code> : requiresTrigger && !renderOverlay ? <DocsButton onClick={() => setRenderOverlay(true)} size="md" variant="primary">Render preview</DocsButton> : <div ref={host} className="w-full max-w-md" />}</div><div className="relative bg-black/40 p-4 pr-24"><pre className="overflow-x-auto text-xs leading-5 text-zinc-400"><code>{source}</code></pre><DocsButton className="absolute right-3 top-3" onClick={() => { void navigator.clipboard.writeText(source); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</DocsButton></div></article>;
}
