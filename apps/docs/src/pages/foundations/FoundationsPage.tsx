import { useState } from "react";
import { CodeBlock, DocsSearch, PageToc } from "../../components";
import componentStatus from "../../generated/component-status.json";

const tokenGroups = [
  {
    name: "Forest",
    token: "--dl-primary",
    value: "#285b45",
    purpose: "Primary actions and emphasis",
    components: "Button, Link, Checkbox, Radio, Toggle, Progress",
  },
  {
    name: "Sage",
    token: "--dl-primary-soft",
    value: "#edf4ee",
    purpose: "Quiet selected and supporting surfaces",
    components: "Badge, Tabs, Segmented buttons, Chips",
  },
  {
    name: "Ink",
    token: "--dl-text",
    value: "#202a24",
    purpose: "Primary content",
    components: "All components",
  },
  {
    name: "Stone",
    token: "--dl-muted",
    value: "#647068",
    purpose: "Supporting content",
    components: "Labels, hints, metadata, placeholders",
  },
  {
    name: "Canvas",
    token: "--dl-background",
    value: "#f7f8f5",
    purpose: "Application background",
    components: "Application and documentation shells",
  },
  {
    name: "Border",
    token: "--dl-border",
    value: "#dce2da",
    purpose: "Dividers and component outlines",
    components: "Inputs, cards, overlays, dividers",
  },
  {
    name: "Focus",
    token: "--dl-focus",
    value: "#3577b9",
    purpose: "Keyboard focus indication",
    components: "Every interactive component",
  },
  {
    name: "Danger",
    token: "--dl-danger",
    value: "#ab3434",
    purpose: "Destructive and error states",
    components: "Validation, alerts, notifications, destructive actions",
  },
];

function FoundationLayout({ children, items }: { children: React.ReactNode; items: { id: string; label: string }[] }) {
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-5 md:px-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12">
      <article className="min-w-0 max-w-4xl">{children}</article>
      <PageToc items={items} />
    </div>
  );
}

export function InstallationPage() {
  const toc = [
    { id: "overview", label: "Overview" },
    { id: "install", label: "Install" },
    { id: "styles", label: "Styles" },
    { id: "component", label: "Import a component" },
    { id: "forms", label: "Forms" },
    { id: "themes", label: "Themes" },
  ];
  return (
    <FoundationLayout items={toc}>
      <header id="overview" className="scroll-mt-24 py-24">
        <p className="eyebrow">Foundations / Getting started</p>
        <h1 className="home-title">Make Arcwell UI yours.</h1>
        <p className="home-copy mt-6">Install the Angular design library, load its shared tokens, and import only the standalone components your feature uses.</p>
      </header>
      <section id="install" className="scroll-mt-24 border-t border-white/10 py-14">
        <p className="eyebrow">Step 1</p>
        <h2 className="home-title">Build and install the package.</h2>
        <div className="mt-7">
          <CodeBlock code={`npm install\nnpm run pack:library\nnpm install /path/to/design-library/dist/arcwell-ui-0.1.0.tgz`} />
        </div>
      </section>
      <section id="styles" className="scroll-mt-24 border-t border-white/10 py-14">
        <p className="eyebrow">Step 2</p>
        <h2 className="home-title">Load shared styles once.</h2>
        <p className="home-copy mt-5">Add the design tokens and component foundations to the application’s global stylesheet.</p>
        <div className="mt-7">
          <CodeBlock code={`@import '@arcwell/ui/styles.css';`} />
        </div>
      </section>
      <section id="component" className="scroll-mt-24 border-t border-white/10 py-14">
        <p className="eyebrow">Step 3</p>
        <h2 className="home-title">Import a standalone component.</h2>
        <div className="mt-7">
          <CodeBlock code={`import { ButtonComponent } from '@arcwell/ui';\n\n@Component({\n  imports: [ButtonComponent],\n  template: '<button dlButton>Continue</button>'\n})\nexport class ExampleComponent {}`} />
        </div>
      </section>
      <section id="forms" className="scroll-mt-24 border-t border-white/10 py-14">
        <p className="eyebrow">Forms</p>
        <h2 className="home-title">Choose the Angular form style that fits.</h2>
        <p className="home-copy mt-5">
          Input controls work with template-driven and reactive forms. Import <code className="code-pill">FormsModule</code> or <code className="code-pill">ReactiveFormsModule</code>, then provide every field with a stable ID and visible label.
        </p>
      </section>
      <section id="themes" className="scroll-mt-24 border-t border-white/10 py-14">
        <p className="eyebrow">Themes</p>
        <h2 className="home-title">Switch palettes at a theme boundary.</h2>
        <p className="home-copy mt-5">
          Set <code className="code-pill">data-theme</code> on the document or a section. Descendant components inherit the selected tokens.
        </p>
        <div className="mt-7">
          <CodeBlock code={`<html data-theme="dark">\n  <app-root></app-root>\n</html>`} />
        </div>
      </section>
    </FoundationLayout>
  );
}

export function TokensPage() {
  const [query, setQuery] = useState("");
  const visibleTokens = tokenGroups.filter((item) => `${item.name} ${item.token} ${item.purpose} ${item.components}`.toLowerCase().includes(query.toLowerCase()));
  const toc = [
    { id: "overview", label: "Overview" },
    { id: "palette", label: "Palette" },
    { id: "override", label: "Override tokens" },
    { id: "scope", label: "Scope" },
  ];
  return (
    <FoundationLayout items={toc}>
      <header id="overview" className="scroll-mt-24 py-24">
        <p className="eyebrow">Foundations / Tokens</p>
        <h1 className="home-title">A naturally balanced palette.</h1>
        <p className="home-copy mt-6">Semantic tokens keep color decisions consistent across themes and components. Change the token value while preserving its purpose.</p>
      </header>
      <section id="palette" className="scroll-mt-24 border-t border-white/10 py-14">
        <h2 className="home-title">Core color tokens</h2>
        <div className="mt-7">
          <DocsSearch id="token-search" label="Search tokens" value={query} onChange={setQuery} placeholder="Search by token, purpose, or component…" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {visibleTokens.map((item) => (
            <article className="overflow-hidden rounded-2xl border border-white/10" key={item.token}>
              <div className="h-28" style={{ background: `var(${item.token}, ${item.value})` }} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-white">{item.name}</strong>
                  <span className="font-mono text-xs text-zinc-500">{item.value}</span>
                </div>
                <code className="mt-3 block text-sm text-emerald-300">{item.token}</code>
                <p className="mt-2 text-sm text-zinc-500">{item.purpose}</p>
                <p className="mt-3 text-xs text-zinc-600">Used by: {item.components}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="override" className="scroll-mt-24 border-t border-white/10 py-14">
        <h2 className="home-title">Override semantic values.</h2>
        <p className="home-copy mt-5">Define tokens at the application theme boundary to apply them consistently.</p>
        <div className="mt-7">
          <CodeBlock code={`:root {\n  --dl-primary: #285b45;\n  --dl-radius: 10px;\n  --dl-font: 'Inter', sans-serif;\n}`} />
        </div>
      </section>
      <section id="scope" className="scroll-mt-24 border-t border-white/10 py-14">
        <h2 className="home-title">Scope deliberate exceptions.</h2>
        <p className="home-copy mt-5">Apply component tokens to a narrow wrapper or instance. This keeps exceptions local and avoids changing unrelated screens.</p>
      </section>
    </FoundationLayout>
  );
}

export function ComponentStatusPage() {
  const [query, setQuery] = useState("");
  const components = componentStatus.components.filter((item) => `${item.component} ${item.selector} ${item.status}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <FoundationLayout
      items={[
        { id: "overview", label: "Overview" },
        { id: "matrix", label: "Status matrix" },
      ]}
    >
      <header id="overview" className="scroll-mt-24 py-24">
        <p className="eyebrow">Foundations / Quality</p>
        <h1 className="home-title">Component status.</h1>
        <p className="home-copy mt-6">This generated matrix records release maturity, automated accessibility coverage, responsive support, themes, and tested browser engines.</p>
      </header>
      <section id="matrix" className="scroll-mt-24 border-t border-white/10 py-14">
        <DocsSearch id="status-search" label="Search components" value={query} onChange={setQuery} placeholder="Search component, selector, or status…" />
        <div className="mt-7 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="p-4">Component</th>
                <th className="p-4">Selector</th>
                <th className="p-4">Status</th>
                <th className="p-4">Coverage</th>
                <th className="p-4">Themes</th>
              </tr>
            </thead>
            <tbody>
              {components.map((item) => (
                <tr className="border-t border-white/10" key={item.component}>
                  <td className="p-4 font-medium text-white">{item.component}</td>
                  <td className="p-4">
                    <code className="code-pill">{item.selector}</code>
                  </td>
                  <td className="p-4 text-emerald-300">{item.status}</td>
                  <td className="p-4 text-zinc-400">
                    {item.accessibility} · responsive · {item.browsers.join(", ")}
                  </td>
                  <td className="p-4 text-zinc-400">{item.themes.join(" / ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </FoundationLayout>
  );
}
