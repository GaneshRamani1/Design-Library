import { useState } from "react";
import { buttonApi } from "./button.api";
import { ButtonPlayground } from "./ButtonPlayground";
import { ButtonVariants } from "./ButtonVariants";
import { ButtonIconConfiguration } from "./ButtonIconConfiguration";
import { DocsTabs, FeatureGrid, PageToc } from "../../components";
import buttonDocs from "../catalog/button/docs.json";
import type { ComponentDoc } from "../types";

export function ButtonPage() {
  const [tab, setTab] = useState("overview");
  const component = buttonDocs as ComponentDoc;
  const configuration = component.configuration.filter((item) => item.kind === "configuration" && !["icon", "iconPosition"].includes(item.property));
  const appearance = component.configuration.filter((item) => item.kind === "appearance");
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-5 md:px-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12"><article className="min-w-0 max-w-4xl py-20">
      <header id="overview" className="scroll-mt-24">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-zinc-500">Actions / Button</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-.04em] text-white md:text-7xl">Button</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Triggers an action or submits a form with clear hierarchy, loading feedback, and native keyboard behavior.</p>
      </header>

      <div className="docs-tabbar sticky top-[64px] z-20 mt-12 border-y py-3 backdrop-blur-xl">
        <DocsTabs value={tab} onChange={setTab} />
      </div>

      {tab === "overview" && <><section id="variations" className="scroll-mt-24 py-16">
        <h2 className="mb-8 text-3xl font-semibold text-white">Variations</h2>
        <p className="mb-7 max-w-2xl text-zinc-400">The variants share one component API. Switch between them to compare hierarchy, guidance, rendering, and code in the same place.</p>
        <ButtonVariants />
      </section>

      <section id="configuration" className="scroll-mt-24 border-t border-white/10 py-16"><h2 className="mb-3 text-3xl font-semibold text-white">Configuration</h2><p className="mb-8 max-w-2xl text-zinc-400">Related inputs share one interactive example when they describe the same feature. Select values to understand what they change and copy the formatted Angular configuration.</p><div className="space-y-5"><ButtonIconConfiguration /><FeatureGrid component={component} items={configuration} emptyMessage="No configuration inputs are documented." /></div></section></>}

      {tab === "api" && <section id="api" className="scroll-mt-24 py-16">
        <h2 className="mb-8 text-3xl font-semibold text-white">API</h2>
        <h3 className="mb-4 text-xl font-semibold text-white">Inputs</h3>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="p-4">Input</th><th className="p-4">Type</th><th className="p-4">Default</th><th className="p-4">Purpose</th></tr></thead>
            <tbody>{buttonApi.inputs.map((item) => <tr className="border-t border-white/10" key={item.name}><td className="p-4 font-mono text-emerald-300">{item.name}</td><td className="p-4 font-mono text-xs text-zinc-300">{item.type}</td><td className="p-4 font-mono text-xs text-zinc-500">{item.defaultValue}</td><td className="p-4 leading-6 text-zinc-400">{item.description}</td></tr>)}</tbody>
          </table>
        </div>

        <h3 className="mb-2 mt-10 text-xl font-semibold text-white">Outputs and events</h3>
        <p className="mb-5 max-w-2xl text-sm leading-6 text-zinc-400">Button keeps native browser behavior, so it exposes the DOM <code className="code-pill">click</code> event instead of declaring a custom Angular output. Bind it with <code className="code-pill">(click)</code> in Angular.</p>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="p-4">Event</th><th className="p-4">Payload</th><th className="p-4">Source</th><th className="p-4">Behavior</th></tr></thead>
            <tbody>{buttonApi.outputs.map((item) => <tr className="border-t border-white/10" key={item.name}><td className="p-4 font-mono text-emerald-300">{item.name}</td><td className="p-4 font-mono text-xs text-zinc-300">{item.type}</td><td className="p-4 text-xs text-zinc-500">{item.defaultValue}</td><td className="p-4 leading-6 text-zinc-400">{item.description}</td></tr>)}</tbody>
          </table>
        </div>
        <pre className="docs-code-surface mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#090909] p-5 text-[13px] leading-6 text-zinc-300"><code>{'<button dlButton (click)="continue()">Continue</button>'}</code></pre>
      </section>}
      {tab === "appearance" && <section id="appearance" className="scroll-mt-24 py-16"><h2 className="mb-3 text-3xl font-semibold text-white">Appearance</h2><p className="mb-8 max-w-2xl text-zinc-400">Use scoped appearance inputs for deliberate instance changes while preserving the shared design tokens.</p><FeatureGrid component={component} items={appearance} emptyMessage="No appearance overrides are documented." /></section>}
      {tab === "playground" && <section id="playground" className="scroll-mt-24 py-16"><h2 className="mb-3 text-3xl font-semibold text-white">Playground</h2><p className="mb-8 text-zinc-400">Configure the real Angular component and inspect the resulting Angular markup.</p><ButtonPlayground /></section>}
    </article><PageToc items={tab === "overview" ? [{id:"overview",label:"Overview"},{id:"variations",label:"Variations"},{id:"configuration",label:"Configuration"}] : tab === "api" ? [{id:"api",label:"API and events"}] : tab === "appearance" ? [{id:"appearance",label:"Appearance"}] : [{id:"playground",label:"Playground"}]} /></div>
  );
}
