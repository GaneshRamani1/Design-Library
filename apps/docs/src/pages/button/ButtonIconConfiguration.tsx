import { useEffect, useMemo, useRef, useState } from "react";
import { CodeBlock, DocsSegmented } from "../../components";
import { setCustomElementProperties } from "../../utils/customElement";

type IconPosition = "start" | "end";
const icons = [{ value: "★", label: "Star" }, { value: "✓", label: "Check" }, { value: "→", label: "Arrow" }];

export function ButtonIconConfiguration() {
  const preview = useRef<HTMLElement>(null);
  const [icon, setIcon] = useState("★");
  const [position, setPosition] = useState<IconPosition>("start");

  useEffect(() => { void setCustomElementProperties(preview.current, { icon, iconPosition: position, variant: "secondary" }); }, [icon, position]);
  const source = useMemo(() => `<button
  dlButton
  icon="${icon}"
  iconPosition="${position}"
  variant="secondary"
>
  Add favorite
</button>`, [icon, position]);

  return <section id="configuration-icon" className="scroll-mt-24 overflow-hidden rounded-3xl border border-white/10 bg-white/[.025]"><header className="border-b border-white/10 p-5"><code className="text-base text-emerald-300">icon + iconPosition</code><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Add a supporting symbol and place it before or after the label. Use familiar icons that reinforce the action; keep the text label for clarity.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><DocsSegmented id="button-icon" label="Icon" options={icons.map((option) => ({ value: option.value, label: `${option.value} ${option.label}` }))} value={icon} onChange={setIcon} /><DocsSegmented id="button-icon-position" label="Position" options={[{ value: "start", label: "Start" }, { value: "end", label: "End" }]} value={position} onChange={(value) => setPosition(value as IconPosition)} /></div></header><div className="example-grid grid min-h-52 place-items-center p-8"><arc-button ref={preview}>Add favorite</arc-button></div><div className="border-t border-white/10 p-5"><p className="mb-4 text-sm leading-6 text-zinc-400"><code className="code-pill">icon</code> selects the symbol. <code className="code-pill">iconPosition</code> changes its visual order without changing the action’s accessible label.</p><CodeBlock code={source} /></div></section>;
}
