import { useState } from "react";
import type { ComponentDoc, ConfigurationExample } from "../pages/types";
import { ConfigurationRenderer, inferredValue } from "./ConfigurationRenderer";
import { DocsSegmented, DocsToggle } from "./DocsControls";

function choiceLabel(example: ConfigurationExample) {
  const value = inferredValue(example);
  if (typeof value === "boolean") return value ? "On" : "Off";
  if (["string", "number"].includes(typeof value) && value !== "Example") return String(value);
  return example.label.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function ConfigurationGroup({ component, examples }: { component: ComponentDoc; examples: ConfigurationExample[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = examples[selectedIndex] ?? examples[0];
  if (!selected) return null;
  const values = examples.map(inferredValue);
  const booleanChoice = examples.length === 2 && values.every((value) => typeof value === "boolean");
  const enabled = Boolean(values[selectedIndex]);

  const anchor = `${selected.kind}-${selected.property.replaceAll(".", "-")}`;
  return <section id={anchor} className="scroll-mt-24 overflow-hidden rounded-3xl border border-white/10 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]"><header className="grid content-start gap-5 border-b border-white/10 bg-white/[.025] p-5 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between gap-4"><div><code className="text-base text-emerald-300">{selected.property}</code><p className="mt-2 text-xs leading-5 text-zinc-600">Change the value to update this example.</p></div>{booleanChoice && <DocsToggle checked={enabled} label={selected.property} showTextLabel={false} onChange={(nextValue) => { const next = values.findIndex((value) => value === nextValue); if (next >= 0) setSelectedIndex(next); }} />}</div>{!booleanChoice && examples.length > 1 ? <DocsSegmented id={`${component.slug}-${selected.property}`} label={selected.property} showLabel={false} options={examples.map((example, index) => ({ value: String(index), label: choiceLabel(example) }))} value={String(selectedIndex)} onChange={(value) => setSelectedIndex(Number(value))} /> : null}</header><ConfigurationRenderer component={component} example={selected} embedded /></section>;
}
