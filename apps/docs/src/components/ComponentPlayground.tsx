import { useEffect, useMemo, useRef, useState } from "react";
import type { ApiItem, ComponentDoc } from "../pages/types";
import { CodeBlock } from "./CodeBlock";
import { DocsDropdown, DocsToggle } from "./DocsControls";

const directives = new Set([
  "carousel",
  "link",
  "popover",
  "tooltip",
  "validation",
]);

function initialValue(input: ApiItem, component: ComponentDoc): unknown {
  const value = input.defaultValue.trim();
  if (value === "true" || value === "false") return value === "true";
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (/^".*"$/.test(value)) return value.slice(1, -1);
  if (input.name === "id") return `playground-${component.slug}`;
  if (["label", "heading", "title"].includes(input.name))
    return component.title;
  if (input.name === "description")
    return `Interactive ${component.title} example.`;
  if (input.name === "options")
    return [
      { value: "one", label: "First option" },
      { value: "two", label: "Second option" },
    ];
  if (input.name === "items")
    return [
      { value: "one", label: "First item" },
      { value: "two", label: "Second item" },
    ];
  if (value === "{}") return {};
  if (value === "[]") return [];
  return "";
}

function choices(type: string) {
  return [...type.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function isComplex(input: ApiItem, value: unknown) {
  return (
    typeof value === "object" ||
    /Record|\[\]|Array|Appearance|Config|Option|Item/.test(input.type)
  );
}

function angularValue(value: unknown) {
  if (typeof value === "string") return `'${value.replaceAll("'", "\\'")}'`;
  return JSON.stringify(value);
}

function sourceFor(component: ComponentDoc, values: Record<string, unknown>) {
  const selector = component.selector.split(",")[0].trim();
  const bindings = component.inputs
    .map((input) => `  [${input.name}]="${angularValue(values[input.name])}"`)
    .join("\n");
  if (selector.startsWith("["))
    return `<div\n  ${selector.slice(1, -1)}\n${bindings}\n>\n  Content\n</div>`;
  const attribute = selector.match(/^(\w+)\[([^\]]+)\]$/);
  const tag = attribute?.[1] ?? selector;
  const marker = attribute ? `  ${attribute[2]}\n` : "";
  return `<${tag}\n${marker}${bindings}\n>\n  ${component.title} content\n</${tag}>`;
}

function Control({
  input,
  value,
  update,
}: {
  input: ApiItem;
  value: unknown;
  update: (value: unknown) => void;
}) {
  const options = choices(input.type);
  if (input.type === "boolean")
    return (
      <DocsToggle
        checked={Boolean(value)}
        label={input.name}
        onChange={update}
      />
    );
  if (options.length > 1)
    return (
      <DocsDropdown
        id={`control-${input.name}`}
        label={input.name}
        value={String(value)}
        options={options}
        onChange={update}
      />
    );
  if (isComplex(input, value))
    return (
      <label className="control">
        <span>
          {input.name} <small className="text-zinc-600">JSON</small>
        </span>
        <textarea
          className="min-h-24 rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-white outline-none"
          defaultValue={JSON.stringify(value, null, 2)}
          key={JSON.stringify(value)}
          onBlur={(event) => {
            try {
              update(JSON.parse(event.target.value));
            } catch {
              event.target.value = JSON.stringify(value, null, 2);
            }
          }}
        />
      </label>
    );
  const numeric = input.type.includes("number");
  return (
    <label className="control">
      <span>{input.name}</span>
      <input
        type={numeric ? "number" : "text"}
        value={String(value ?? "")}
        onChange={(event) =>
          update(numeric ? Number(event.target.value) : event.target.value)
        }
      />
    </label>
  );
}

export function ComponentPlayground({
  component,
}: {
  component: ComponentDoc;
}) {
  const host = useRef<HTMLDivElement>(null);
  const initial = useMemo(
    () =>
      Object.fromEntries(
        component.inputs.map((input) => [
          input.name,
          initialValue(input, component),
        ]),
      ),
    [component],
  );
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [events, setEvents] = useState<string[]>([]);
  const source = useMemo(
    () => sourceFor(component, values),
    [component, values],
  );

  useEffect(() => setValues(initial), [initial]);
  useEffect(() => {
    if (!host.current || directives.has(component.slug)) return;
    const element = document.createElement(`arc-${component.slug}`);
    Object.assign(element, values);
    element.textContent = `${component.title} content`;
    const listeners = component.outputs.map((output) => {
      const listener = (event: Event) =>
        setEvents((current) =>
          [
            `${output.name}: ${JSON.stringify((event as CustomEvent).detail)}`,
            ...current,
          ].slice(0, 5),
        );
      element.addEventListener(output.name, listener);
      return [output.name, listener] as const;
    });
    host.current.replaceChildren(element);
    return () =>
      listeners.forEach(([name, listener]) =>
        element.removeEventListener(name, listener),
      );
  }, [component, values]);

  return (
    <div className="space-y-5">
      <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <form
          className="max-h-[42rem] space-y-5 overflow-y-auto border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r"
          onSubmit={(event) => event.preventDefault()}
        >
          {component.inputs.map((input) => (
            <Control
              input={input}
              key={input.name}
              value={values[input.name]}
              update={(value) =>
                setValues((current) => ({ ...current, [input.name]: value }))
              }
            />
          ))}
          {!component.inputs.length && (
            <p className="text-sm text-zinc-500">
              This component has no configurable inputs.
            </p>
          )}
          <button
            className="text-xs font-medium text-zinc-500 hover:text-white"
            onClick={() => setValues(initial)}
            type="button"
          >
            Reset all controls
          </button>
        </form>
        <div className="min-w-0">
          <div className="example-grid grid min-h-80 place-items-center p-5 sm:p-6 md:p-10">
            {directives.has(component.slug) ? (
              <div className="text-center">
                <code className="text-emerald-300">{component.selector}</code>
                <p className="mt-3 text-sm text-zinc-500">
                  Apply this directive to the compatible Angular host shown in
                  the generated code.
                </p>
              </div>
            ) : (
              <div ref={host} className="w-full max-w-xl" />
            )}
          </div>
          <div className="border-t border-white/10 p-4 sm:p-5">
            <CodeBlock code={source} />
          </div>
        </div>
      </div>
      {component.outputs.length > 0 && (
        <section
          aria-live="polite"
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.025]"
        >
          <header className="border-b border-white/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-300">
              Live output
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Outputs and events
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Interact with the preview above. The newest emitted payload
              appears first.
            </p>
          </header>
          <div className="p-5 font-mono text-xs text-zinc-400">
            {events.length ? (
              <ol className="space-y-2">
                {events.map((event, index) => (
                  <li
                    className="break-all rounded-lg bg-black/20 p-3"
                    key={`${event}-${index}`}
                  >
                    {event}
                  </li>
                ))}
              </ol>
            ) : (
              <p>No events emitted yet.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
