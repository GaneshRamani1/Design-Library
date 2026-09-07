import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ApiTable, CodeBlock, ComponentHeader, ComponentPlayground, DocsTabs, EventReference, FeatureGrid, NativePreview, PageSection, PageToc } from "../components";
import { componentLoaders } from "./catalog";
import type { ComponentDoc } from "./types";

export function ComponentReferencePage() {
  const { slug } = useParams();
  const [component, setComponent] = useState<ComponentDoc>();
  const [tab, setTab] = useState("overview");
  const loader = slug ? componentLoaders[slug] : undefined;

  useEffect(() => {
    let current = true;
    setComponent(undefined);
    if (loader) void loader().then((docs) => { if (current) setComponent(docs); });
    return () => { current = false; };
  }, [loader]);

  if (!loader) return <Navigate to="/components/card" replace />;
  if (!component) return <div className="mx-auto max-w-4xl px-5 py-28 text-zinc-500 md:px-10">Loading component documentation…</div>;
  const configurations = component.configuration.filter((item) => item.kind === "configuration");
  const variations = component.configuration.filter((item) => item.kind === "variation");
  const appearance = component.configuration.filter((item) => item.kind === "appearance");
  const events = component.configuration.filter((item) => item.kind === "event");
  const propertyItems = (items: typeof configurations, kind: string) => [...new Set(items.map((item) => item.property))].map((property) => ({ id: `${kind}-${property.replaceAll(".", "-")}`, label: property }));
  const toc = tab === "overview" ? [{ id: "preview", label: "Live component" }, { id: "usage", label: "Usage" }, { id: "examples", label: "Examples" }, { id: "configuration", label: "Configuration", children: propertyItems(configurations, "configuration") }, { id: "variations", label: "Variations", children: propertyItems(variations, "variation") }, { id: "patterns", label: "Patterns" }]
    : tab === "api" ? [{ id: "inputs", label: "Inputs", children: component.inputs.map((item) => ({ id: `input-${item.name}`, label: item.name })) }, { id: "outputs", label: "Outputs", children: component.outputs.map((item) => ({ id: `output-${item.name}`, label: item.name })) }, { id: "projection", label: "Projection" }, { id: "methods", label: "Methods" }, { id: "types", label: "Public types" }]
    : tab === "appearance" ? [{ id: "overrides", label: "Overrides", children: propertyItems(appearance, "appearance") }]
    : [{ id: "playground", label: "Playground" }];

  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-5 md:px-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12"><article className="min-w-0 max-w-4xl">
      <ComponentHeader category={component.category} title={component.title} description={component.description} selector={component.selector} />
      <div className="sticky top-16 z-20 border-y border-white/10 bg-black/90 py-2 backdrop-blur-xl"><DocsTabs value={tab} onChange={(value) => { setTab(value); window.scrollTo({ top: 0, behavior: "smooth" }); }} /></div>
      {tab === "overview" && <>
      <PageSection id="preview" title="Live component"><NativePreview component={component} /></PageSection>
      <PageSection id="usage" title="Usage"><div className="space-y-4">{component.integration.map((decision) => <p className="max-w-3xl leading-7 text-zinc-400" key={decision}>{decision}</p>)}</div></PageSection>
      <PageSection id="examples" title="Examples"><div className="grid gap-3 sm:grid-cols-2">{component.behavioralExamples.map((example) => <article className="rounded-2xl border border-white/10 bg-white/[.025] p-5" key={example.label}><h3 className="font-semibold text-white">{example.label}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{example.description || `Demonstrates the ${example.label.toLowerCase()} behavior.`}</p></article>)}</div><h3 className="mb-4 mt-8 text-xl font-semibold text-white">Documented defaults</h3><CodeBlock code={component.defaults} /></PageSection>
      <PageSection id="configuration" title="Configuration"><FeatureGrid component={component} items={configurations} emptyMessage="No dedicated configuration examples are required." /></PageSection>
      <PageSection id="variations" title="Variations"><FeatureGrid component={component} items={variations} emptyMessage="This component does not declare separate visual variations." /></PageSection>
      <PageSection id="patterns" title="Composition patterns">{component.patterns.length ? <div className="grid gap-3 sm:grid-cols-2">{component.patterns.map((pattern) => <article className="rounded-2xl border border-white/10 p-5" key={pattern.label}><h3 className="font-semibold text-white">{pattern.label}</h3><p className="mt-2 text-sm text-zinc-400">{pattern.description || "A verified multi-component composition."}</p></article>)}</div> : <p className="text-zinc-500">No multi-component composition is required for the basic use case.</p>}</PageSection>
      </>}
      {tab === "api" && <>
      <PageSection id="inputs" title="Inputs and models"><ApiTable items={component.inputs} /></PageSection>
      <PageSection id="outputs" title="Outputs and events"><EventReference outputs={component.outputs} examples={events} /></PageSection>
      <PageSection id="projection" title="Content projection">{component.slots.length ? <ul className="space-y-2 text-zinc-400">{component.slots.map((slot) => <li key={slot}><code className="code-pill">{slot}</code></li>)}</ul> : <p className="text-zinc-500">This component declares no content projection slots.</p>}</PageSection>
      <PageSection id="methods" title="Public methods and state">{component.methods.length ? <ul className="grid gap-2 sm:grid-cols-2">{component.methods.map((method) => <li className="rounded-xl border border-white/10 bg-white/[.025] p-3 font-mono text-xs text-zinc-300" key={method}>{method}</li>)}</ul> : <p className="text-zinc-500">No consumer-facing public methods are documented.</p>}</PageSection>
      <PageSection id="types" title="Related public types"><CodeBlock code={component.relatedTypes} /></PageSection>
      </>}
      {tab === "appearance" && <PageSection id="overrides" title="Appearance overrides"><p className="mb-6 max-w-2xl leading-7 text-zinc-400">Use <code className="code-pill">appearance</code> for coordinated instance changes and <code className="code-pill">styleTokens</code> for scoped <code className="code-pill">--dl-*</code> overrides.</p><FeatureGrid component={component} items={appearance} emptyMessage="This API does not expose dedicated appearance settings." /></PageSection>}
      {tab === "playground" && <PageSection id="playground" title="Interactive playground"><p className="mb-6 max-w-3xl leading-7 text-zinc-400">Configure every public input, inspect the real component, copy the resulting Angular markup, and trigger outputs in one place.</p><ComponentPlayground component={component} /></PageSection>}
    </article><PageToc items={toc} /></div>
  );
}
