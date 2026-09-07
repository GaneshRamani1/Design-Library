import { useState } from "react";
import { CodeBlock, DocsSegmented } from "../../components";
import { buttonExamples } from "./button.examples";

export function ButtonVariants() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = buttonExamples[selectedIndex] ?? buttonExamples[0];
  if (!selected) return null;

  const chooseVariant = (value: string) => {
    const index = buttonExamples.findIndex((example) => example.id === value);
    if (index >= 0) setSelectedIndex(index);
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <header className="border-b border-white/10 bg-white/[.025] p-5 md:p-6 lg:border-b-0 lg:border-r">
        <code className="text-base text-emerald-300">variant</code>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Choose the button hierarchy that fits the action. Select a variant to
          update the preview, guidance, and Angular example together.
        </p>
        <div className="mt-5 w-full overflow-x-auto pb-1">
          <DocsSegmented
            id="button-variant-example"
            label="Button variant"
            showLabel={false}
            orientation="vertical"
            options={buttonExamples.map((example) => ({
              value: example.id,
              label: example.title,
            }))}
            value={selected.id}
            onChange={chooseVariant}
          />
        </div>
      </header>
      <div className="min-w-0"><div className="example-grid grid min-h-56 place-items-center p-8 md:min-h-64">
        {selected.preview}
      </div><div className="border-t border-white/10 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-zinc-600">
          When to use {selected.title.toLowerCase()}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
          {selected.description}
        </p>
        <div className="mt-5">
          <CodeBlock code={selected.source} />
        </div>
      </div></div>
    </article>
  );
}
