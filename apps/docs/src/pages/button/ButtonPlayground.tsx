import { useEffect, useMemo, useRef, useState } from "react";
import { CodeBlock, DocsDropdown, DocsToggle } from "../../components";
import { setCustomElementProperties } from "../../utils/customElement";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function ButtonPlayground() {
  const buttonRef = useRef<HTMLElement>(null);
  const [label, setLabel] = useState("Continue");
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Working…");
  const [fullWidth, setFullWidth] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastEvent, setLastEvent] = useState("No events yet");
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    void setCustomElementProperties(buttonRef.current, {
      variant,
      size,
      disabled,
      loading,
      loadingLabel,
      fullWidth,
    });
  }, [variant, size, disabled, loading, loadingLabel, fullWidth]);

  const source = useMemo(
    () =>
      `<button\n  dlButton\n  variant="${variant}"\n  size="${size}"\n  [disabled]="${disabled}"\n  [loading]="${loading}"\n  loadingLabel="${loadingLabel}"\n  [fullWidth]="${fullWidth}"\n>\n  ${label}\n</button>`,
    [label, variant, size, disabled, loading, loadingLabel, fullWidth],
  );

  return (
    <div className="space-y-5">
      <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:grid-cols-[300px_1fr]">
        <form
          className="space-y-5 border-b border-white/10 p-6 lg:border-b-0 lg:border-r"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="control">
            <span>Label</span>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </label>
          <DocsDropdown
            id="button-variant"
            label="Variant"
            options={["primary", "secondary", "tertiary", "ghost", "danger"]}
            value={variant}
            onChange={(value) => setVariant(value as ButtonVariant)}
          />
          <DocsDropdown
            id="button-size"
            label="Size"
            options={["sm", "md", "lg"]}
            value={size}
            onChange={(value) => setSize(value as ButtonSize)}
          />
          <DocsToggle
            checked={disabled}
            label="Disabled"
            onChange={(value) => {
              setDisabled(value);
              if (value) setLoading(false);
            }}
          />
          <DocsToggle
            checked={loading}
            label="Loading"
            onChange={(value) => {
              setLoading(value);
              if (value) setDisabled(false);
            }}
          />
          <label className="control">
            <span>Loading label</span>
            <input
              value={loadingLabel}
              onChange={(event) => {
                setLoadingLabel(event.target.value);
                setLoading(Boolean(event.target.value));
                if (event.target.value) setDisabled(false);
              }}
            />
          </label>
          <DocsToggle
            checked={fullWidth}
            label="Full width"
            onChange={setFullWidth}
          />
        </form>

        <div className="min-w-0">
          <div className="example-grid flex min-h-72 items-center justify-center p-8">
            <div className="w-full max-w-sm text-center">
              <arc-button
                ref={buttonRef}
                onClick={(event) => {
                  if (disabled || loading) return;
                  const entry = `${event.type} · MouseEvent · ${new Date().toLocaleTimeString()}`;
                  setClickCount((count) => count + 1);
                  setLastEvent(`${event.type} · MouseEvent`);
                  setEvents((current) => [entry, ...current].slice(0, 5));
                }}
              >
                {label}
              </arc-button>
            </div>
          </div>
          <div className="border-t border-white/10 p-5">
            <CodeBlock code={source} />
          </div>
        </div>
      </div>
      <section
        aria-live="polite"
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.025]"
      >
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="font-semibold text-white">Outputs and events</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Interact with the enabled button to inspect its native click
              event.
            </p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-zinc-500">Click count</span>
            <strong className="font-mono text-emerald-300">{clickCount}</strong>
          </div>
        </header>
        <div className="grid gap-px bg-white/10 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <div className="bg-zinc-950 p-5">
            <span className="text-xs text-zinc-500">Latest event</span>
            <strong className="mt-2 block font-mono text-sm text-white">
              {lastEvent}
            </strong>
          </div>
          <div className="bg-zinc-950 p-5">
            {events.length ? (
              <ol className="space-y-2">
                {events.map((entry, index) => (
                  <li
                    className="font-mono text-xs text-zinc-400"
                    key={`${entry}-${index}`}
                  >
                    {entry}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-zinc-500">
                {disabled || loading
                  ? "Events are suppressed while the button is disabled or loading."
                  : "No events emitted yet. Click the preview button."}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
