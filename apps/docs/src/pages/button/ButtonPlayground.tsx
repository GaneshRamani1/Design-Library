import { useEffect, useMemo, useRef, useState } from "react";
import { DocsDropdown, DocsToggle } from "../../components";
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
    () => `<button\n  dlButton\n  variant="${variant}"\n  size="${size}"\n  [disabled]="${disabled}"\n  [loading]="${loading}"\n  loadingLabel="${loadingLabel}"\n  [fullWidth]="${fullWidth}"\n>\n  ${label}\n</button>`,
    [label, variant, size, disabled, loading, loadingLabel, fullWidth],
  );

  return (
    <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:grid-cols-[300px_1fr]">
      <form className="space-y-5 border-b border-white/10 p-6 lg:border-b-0 lg:border-r" onSubmit={(event) => event.preventDefault()}>
        <label className="control"><span>Label</span><input value={label} onChange={(event) => setLabel(event.target.value)} /></label>
        <DocsDropdown id="button-variant" label="Variant" options={["primary", "secondary", "tertiary", "ghost", "danger"]} value={variant} onChange={(value) => setVariant(value as ButtonVariant)} />
        <DocsDropdown id="button-size" label="Size" options={["sm", "md", "lg"]} value={size} onChange={(value) => setSize(value as ButtonSize)} />
        <DocsToggle checked={disabled} label="Disabled" onChange={setDisabled} />
        <DocsToggle checked={loading} label="Loading" onChange={setLoading} />
        <label className="control"><span>Loading label</span><input value={loadingLabel} onChange={(event) => setLoadingLabel(event.target.value)} /></label>
        <DocsToggle checked={fullWidth} label="Full width" onChange={setFullWidth} />
      </form>

      <div className="min-w-0">
        <div className="example-grid flex min-h-72 items-center justify-center p-8">
          <div className="w-full max-w-sm text-center">
            <arc-button
              ref={buttonRef}
              onClick={(event) => {
                if (disabled || loading) return;
                setClickCount((count) => count + 1);
                setLastEvent(`${event.type} · MouseEvent`);
              }}
            >
              {label}
            </arc-button>
            <div aria-live="polite" className="mx-auto mt-6 max-w-xs rounded-xl border border-white/10 bg-black/40 p-3 text-left text-xs text-zinc-400">
              <div className="flex justify-between"><span>Last event</span><strong className="font-mono text-emerald-300">{lastEvent}</strong></div>
              <div className="mt-2 flex justify-between"><span>Click count</span><strong className="font-mono text-white">{clickCount}</strong></div>
            </div>
          </div>
        </div>
        <pre className="overflow-x-auto border-t border-white/10 p-5 text-[13px] leading-6 text-zinc-300"><code>{source}</code></pre>
      </div>
    </div>
  );
}
