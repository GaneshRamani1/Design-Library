import { useEffect, useRef } from "react";

export function DocsToggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { Object.assign(ref.current!, { value: checked, label, showLabel: false }); }, [checked, label]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(Boolean((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <div className="flex items-center justify-between gap-4 text-sm text-zinc-300"><span>{label}</span><arc-docs-toggle ref={ref} /></div>;
}

export function DocsDropdown({ id, label, options, value, onChange }: { id: string; label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { Object.assign(ref.current!, { id, label, value, options: options.map((option) => ({ value: option, label: option })) }); }, [id, label, options, value]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-dropdown className="block w-full" ref={ref} />;
}

export function DocsSegmented({ id, label, options, value, onChange }: { id: string; label: string; options: Array<{ value: string; label: string }>; value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { Object.assign(ref.current!, { id, label, options, value }); }, [id, label, options, value]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-segmented className="block" ref={ref} />;
}

export function DocsTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const options = [{ value: "overview", label: "Overview" }, { value: "api", label: "API" }, { value: "appearance", label: "Appearance" }, { value: "playground", label: "Playground" }];
  useEffect(() => { Object.assign(ref.current!, { options, value }); }, [value]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-tabs className="block" ref={ref} />;
}
