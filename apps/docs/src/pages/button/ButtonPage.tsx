import { useState } from "react";
import { buttonApi } from "./button.api";
import { ButtonPlayground } from "./ButtonPlayground";
import { ButtonVariants } from "./ButtonVariants";
import { ButtonIconConfiguration } from "./ButtonIconConfiguration";
import {
  ApiTable,
  CodeBlock,
  DocsSearch,
  DocsTabs,
  FeatureGrid,
  OutputTable,
  PageToc,
} from "../../components";
import buttonDocs from "../catalog/button/docs.json";
import type { ComponentDoc } from "../types";

export function ButtonPage() {
  const [tab, setTab] = useState("overview");
  const [apiQuery, setApiQuery] = useState("");
  const component = buttonDocs as ComponentDoc;
  const configuration = component.configuration.filter(
    (item) =>
      item.kind === "configuration" &&
      !["icon", "iconPosition"].includes(item.property),
  );
  const appearance = component.configuration.filter(
    (item) => item.kind === "appearance",
  );
  const matchesApi = (item: {
    name: string;
    type: string;
    description: string;
  }) =>
    `${item.name} ${item.type} ${item.description}`
      .toLowerCase()
      .includes(apiQuery.toLowerCase().trim());
  const filteredInputs = buttonApi.inputs.filter(matchesApi);
  const filteredOutputs = buttonApi.outputs.filter(matchesApi);
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-4 sm:px-5 md:px-8 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12">
      <article className="min-w-0 w-full max-w-4xl py-12 md:py-20">
        <header id="overview" className="scroll-mt-24">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-zinc-500">
            Actions / Button
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl md:text-7xl">
            Button
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Triggers an action or submits a form with clear hierarchy, loading
            feedback, and native keyboard behavior.
          </p>
        </header>

        <div className="docs-tabbar sticky top-[64px] z-20 mt-8 min-w-0 border-y py-2 backdrop-blur-xl md:mt-12 md:py-3">
          <DocsTabs value={tab} onChange={setTab} />
        </div>

        {tab === "overview" && (
          <>
            <section id="variations" className="scroll-mt-24 py-16">
              <h2 className="mb-8 text-3xl font-semibold text-white">
                Variations
              </h2>
              <p className="mb-7 max-w-2xl text-zinc-400">
                The variants share one component API. Switch between them to
                compare hierarchy, guidance, rendering, and code in the same
                place.
              </p>
              <ButtonVariants />
            </section>

            <section
              id="configuration"
              className="scroll-mt-24 border-t border-white/10 py-16"
            >
              <h2 className="mb-3 text-3xl font-semibold text-white">
                Configuration
              </h2>
              <p className="mb-8 max-w-2xl text-zinc-400">
                Related inputs share one interactive example when they describe
                the same feature. Select values to understand what they change
                and copy the formatted Angular configuration.
              </p>
              <div className="space-y-5">
                <ButtonIconConfiguration />
                <FeatureGrid
                  component={component}
                  items={configuration}
                  emptyMessage="No configuration inputs are documented."
                />
              </div>
            </section>
          </>
        )}

        {tab === "api" && (
          <section id="api" className="scroll-mt-24 py-16">
            <p className="eyebrow">Reference</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Button API
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Configure behavior through inputs and handle activation through
              the native click event.
            </p>
            <div className="my-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {[
                [buttonApi.inputs.length, "Inputs"],
                [buttonApi.outputs.length, "Event"],
                [0, "Custom outputs"],
              ].map(([value, label]) => (
                <div className="bg-zinc-950 p-5" key={label}>
                  <strong className="text-2xl text-white">{value}</strong>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-zinc-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[.025] p-4">
              <DocsSearch
                id="button-api-search"
                label="Search this API"
                placeholder="Search inputs, events, or types…"
                value={apiQuery}
                onChange={setApiQuery}
              />
              <p className="mt-3 text-xs text-zinc-500">
                {apiQuery
                  ? `${filteredInputs.length + filteredOutputs.length} matching API entries`
                  : "Search only within the Button API"}
              </p>
            </div>
            <div id="api-inputs" className="scroll-mt-28">
              <h3 className="mb-2 text-xl font-semibold text-white">Inputs</h3>
              <p className="mb-5 text-sm leading-6 text-zinc-400">
                Inputs control presentation, state, content, and native form
                behavior.
              </p>
              <ApiTable
                items={filteredInputs}
                emptyMessage={`No Button inputs match “${apiQuery}”.`}
              />
            </div>
            <div id="api-events" className="scroll-mt-28">
              <h3 className="mb-2 mt-12 text-xl font-semibold text-white">
                Outputs and events
              </h3>
              <p className="mb-5 max-w-2xl text-sm leading-6 text-zinc-400">
                Button keeps native browser behavior, so it exposes the DOM{" "}
                <code className="code-pill">click</code> event instead of
                declaring a custom Angular output. Bind it with{" "}
                <code className="code-pill">(click)</code> in Angular.
              </p>
              {filteredOutputs.length ? (
                <OutputTable items={filteredOutputs} />
              ) : (
                <p className="rounded-2xl border border-white/10 p-5 text-sm text-zinc-500">
                  No Button events match “{apiQuery}”.
                </p>
              )}
            </div>
            <div id="api-usage" className="scroll-mt-28 pt-10">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Usage example
              </h3>
              <p className="mb-5 text-sm leading-6 text-zinc-400">
                Bind the native event while preserving the button’s semantic
                type and projected label.
              </p>
              <CodeBlock
                code={
                  '<button\n  dlButton\n  type="button"\n  (click)="continue($event)"\n>\n  Continue\n</button>'
                }
              />
            </div>
          </section>
        )}
        {tab === "appearance" && (
          <section id="appearance" className="scroll-mt-24 py-16">
            <h2 className="mb-3 text-3xl font-semibold text-white">
              Appearance
            </h2>
            <p className="mb-8 max-w-2xl text-zinc-400">
              Use scoped appearance inputs for deliberate instance changes while
              preserving the shared design tokens.
            </p>
            <FeatureGrid
              component={component}
              items={appearance}
              emptyMessage="No appearance overrides are documented."
            />
          </section>
        )}
        {tab === "playground" && (
          <section id="playground" className="scroll-mt-24 py-16">
            <h2 className="mb-3 text-3xl font-semibold text-white">
              Playground
            </h2>
            <p className="mb-8 text-zinc-400">
              Configure the real Angular component and inspect the resulting
              Angular markup.
            </p>
            <ButtonPlayground />
          </section>
        )}
      </article>
      <PageToc
        items={
          tab === "overview"
            ? [
                { id: "overview", label: "Overview" },
                { id: "variations", label: "Variations" },
                {
                  id: "configuration",
                  label: "Configuration",
                  children: [
                    { id: "configuration-icon", label: "Icon and position" },
                    { id: "configuration-fullWidth", label: "Full width" },
                    {
                      id: "configuration-loadingLabel",
                      label: "Loading label",
                    },
                    { id: "configuration-size", label: "Size" },
                    { id: "configuration-disabled", label: "Disabled" },
                    { id: "configuration-loading", label: "Loading" },
                    {
                      id: "configuration-loadingMinWidth",
                      label: "Loading minimum width",
                    },
                    { id: "configuration-type", label: "Native type" },
                  ],
                },
              ]
            : tab === "api"
              ? [
                  {
                    id: "api",
                    label: "API reference",
                    children: [
                      { id: "api-inputs", label: "Inputs" },
                      { id: "api-events", label: "Outputs and events" },
                      { id: "api-usage", label: "Usage example" },
                    ],
                  },
                ]
              : tab === "appearance"
                ? [{ id: "appearance", label: "Appearance" }]
                : [{ id: "playground", label: "Playground" }]
        }
      />
    </div>
  );
}
