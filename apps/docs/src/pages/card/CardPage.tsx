import { useEffect, useMemo, useRef, useState } from "react";
import { CodeBlock, DocsDropdown, DocsToggle, PageToc } from "../../components";

const api = [
  { name: "heading", type: "string", default: '""', description: "Primary title displayed in the card header." },
  { name: "description", type: "string", default: '""', description: "Supporting text shown below the heading." },
  { name: "headingLevel", type: "2 | 3 | 4", default: "3", description: "Semantic heading level used for the card title." },
  { name: "surface", type: '"glass" | "solid" | "transparent"', default: '"glass"', description: "Sets the card background treatment." },
  { name: "showHeader", type: "boolean", default: "true", description: "Controls whether the configured header is rendered." },
  { name: "showFooter", type: "boolean", default: "false", description: "Shows content projected with the cardFooter attribute." },
];

const tokens = [
  ["--dl-card-surface", "Background color or gradient"],
  ["--dl-card-border", "Card border color"],
  ["--dl-card-radius", "Corner radius"],
  ["--dl-card-shadow", "Resting elevation"],
  ["--dl-card-blur", "Backdrop-filter value"],
  ["--dl-ui-padding", "Instance-level internal spacing"],
];

const nav = ["Overview", "Examples", "API", "Patterns", "Overrides", "Accessibility", "Playground"];

function Code({ children }: { children: string }) {
  return <CodeBlock code={children} />;
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-24 border-t border-white/10 py-16">
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p>
    <h2 className="mb-8 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
    {children}
  </section>;
}

function Example({ title, description, children, code }: { title: string; description: string; children: React.ReactNode; code: string }) {
  return <article className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
    <div className="border-b border-white/10 px-6 py-5 lg:border-b-0 lg:border-r"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p></div>
    <div className="min-w-0"><div className="example-grid flex min-h-72 items-center justify-center p-6 md:p-10">{children}</div>
    <details className="border-t border-white/10"><summary className="cursor-pointer px-6 py-4 text-sm font-medium text-zinc-300">View Angular code</summary><div className="px-4 pb-4"><Code>{code}</Code></div></details></div>
  </article>;
}

function CardPlayground() {
  const card = useRef<HTMLElement>(null);
  const [heading, setHeading] = useState("Monthly activity");
  const [description, setDescription] = useState("Results for September");
  const [surface, setSurface] = useState<"glass" | "solid" | "transparent">("glass");
  const [level, setLevel] = useState<2 | 3 | 4>(3);
  const [header, setHeader] = useState(true);
  const [footer, setFooter] = useState(true);

  useEffect(() => {
    Object.assign(card.current!, { heading, description, surface, headingLevel: level, showHeader: header, showFooter: footer });
  }, [heading, description, surface, level, header, footer]);

  const source = useMemo(() => `<dl-card\n  heading="${heading}"\n  description="${description}"\n  surface="${surface}"\n  [headingLevel]="${level}"\n  [showHeader]="${header}"\n  [showFooter]="${footer}"\n>\n  <p>1,428 completed reviews</p>\n  <dl-button cardFooter variant="primary">View report</dl-button>\n</dl-card>`, [heading, description, surface, level, header, footer]);

  return <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:grid-cols-[300px_1fr]">
    <form className="space-y-5 border-b border-white/10 p-6 lg:border-b-0 lg:border-r" onSubmit={(event) => event.preventDefault()}>
      <label className="control"><span>Heading</span><input value={heading} onChange={(e) => setHeading(e.target.value)} /></label>
      <label className="control"><span>Description</span><input value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <DocsDropdown id="card-surface" label="Surface" options={["glass", "solid", "transparent"]} value={surface} onChange={(value) => setSurface(value as typeof surface)} />
      <DocsDropdown id="card-heading-level" label="Heading level" options={["2", "3", "4"]} value={String(level)} onChange={(value) => setLevel(Number(value) as typeof level)} />
      <DocsToggle checked={header} label="Show header" onChange={setHeader} />
      <DocsToggle checked={footer} label="Show footer" onChange={setFooter} />
    </form>
    <div className="min-w-0">
      <div className="example-grid flex min-h-96 items-center justify-center p-6 md:p-12">
        <arc-card ref={card} className="w-full max-w-md"><p className="mb-0 mt-0 text-sm text-zinc-300">1,428 completed reviews</p><arc-button cardFooter variant="primary">View report</arc-button></arc-card>
      </div>
      <div className="border-t border-white/10 p-4"><Code>{source}</Code></div>
    </div>
  </div>;
}

export function CardPage() {
  return (
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-5 md:px-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12">
        <div className="min-w-0 max-w-4xl">
          <section id="overview" className="scroll-mt-24 py-20 md:py-28"><div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-zinc-500"><span>Layout</span><span>/</span><span className="text-zinc-300">Card</span></div><h1 className="max-w-3xl text-5xl font-semibold tracking-[-.04em] text-white md:text-7xl">Structure content with clarity.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">Card groups related information and actions into a flexible surface. Use it for dashboard summaries, settings groups, and focused tasks.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#examples" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">View examples</a><a href="#api" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white">Read the API</a></div></section>
          <Section id="examples" eyebrow="Examples" title="Start with the common cases">
            <div className="space-y-8"><Example title="Default card" description="A clear heading, supporting text, and projected content." code={'<dl-card\n  heading="Account overview"\n  description="Current plan and usage"\n>\n  <p>12 active team members</p>\n</dl-card>'}><arc-card className="w-full max-w-md" heading="Account overview" description="Current plan and usage"><p className="mb-0 text-sm text-zinc-300">12 active team members</p></arc-card></Example><Example title="Surface variations" description="Choose a surface according to hierarchy and surrounding content." code={'<dl-card surface="glass">...</dl-card>\n<dl-card surface="solid">...</dl-card>\n<dl-card surface="transparent">...</dl-card>'}><div className="grid w-full gap-4 sm:grid-cols-3"><arc-card heading="Glass" surface="glass" /><arc-card heading="Solid" surface="solid" /><arc-card heading="Transparent" surface="transparent" /></div></Example></div>
          </Section>
          <Section id="api" eyebrow="Reference" title="Component API"><p className="mb-8 leading-7 text-zinc-400">Import <code className="code-pill">CardComponent</code> from <code className="code-pill">@arcwell/ui</code>. All inputs use Angular signal inputs and update reactively.</p><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="p-4">Input</th><th className="p-4">Type</th><th className="p-4">Default</th><th className="p-4">Purpose</th></tr></thead><tbody>{api.map(row => <tr className="border-t border-white/10" key={row.name}><td className="p-4 font-mono text-emerald-300">{row.name}</td><td className="p-4 font-mono text-xs text-zinc-300">{row.type}</td><td className="p-4 font-mono text-xs text-zinc-500">{row.default}</td><td className="p-4 leading-6 text-zinc-400">{row.description}</td></tr>)}</tbody></table></div><h3 className="mb-3 mt-10 text-xl font-semibold text-white">Content projection</h3><p className="leading-7 text-zinc-400">Place primary content in the default projection area. Add <code className="code-pill">cardFooter</code> to footer actions and enable <code className="code-pill">showFooter</code>.</p></Section>
          <Section id="patterns" eyebrow="Patterns" title="Use cards with intent"><div className="grid gap-4 md:grid-cols-2"><div className="guidance good"><strong>Use a card for</strong><ul><li>A related summary and action</li><li>A small settings group</li><li>A dashboard metric or status</li></ul></div><div className="guidance"><strong>Avoid cards when</strong><ul><li>Content has no meaningful group</li><li>Every item becomes a nested surface</li><li>A plain section offers enough structure</li></ul></div></div></Section>
          <Section id="overrides" eyebrow="Appearance" title="Override with stable tokens"><p className="mb-8 max-w-2xl leading-7 text-zinc-400">Set design tokens at a theme boundary for system-wide changes. Use the instance-level <code className="code-pill">--dl-ui-*</code> properties for a deliberate one-off treatment.</p><div className="grid gap-8 lg:grid-cols-2"><div className="overflow-hidden rounded-2xl border border-white/10">{tokens.map(([token, purpose]) => <div className="border-b border-white/10 p-4 last:border-0" key={token}><code className="text-sm text-emerald-300">{token}</code><p className="mt-1 text-sm text-zinc-500">{purpose}</p></div>)}</div><Code>{`.analytics-card {\n  --dl-ui-padding: 32px;\n  --dl-card-radius: 20px;\n  --dl-card-border: rgba(255,255,255,.2);\n  --dl-card-shadow: 0 24px 60px #0006;\n}`}</Code></div></Section>
          <Section id="accessibility" eyebrow="Accessibility" title="Keep the structure meaningful"><div className="space-y-4 text-zinc-400"><p className="leading-7">Choose <code className="code-pill">headingLevel</code> from the page hierarchy, not the preferred visual size. The component renders a real <code className="code-pill">h2</code>, <code className="code-pill">h3</code>, or <code className="code-pill">h4</code>.</p><p className="leading-7">Keep actions descriptive and place them in the footer when they affect the complete card. A card is a visual grouping and does not add an unnecessary landmark role.</p></div></Section>
          <Section id="playground" eyebrow="Try it" title="Interactive playground"><p className="mb-6 text-zinc-400">Every control updates the real Angular component and produces copyable Angular markup.</p><CardPlayground /></Section>
        </div>
        <PageToc items={nav.map((label) => ({ id: label.toLowerCase(), label }))} />
      </div>
  );
}
