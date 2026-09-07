import { useEffect, useRef } from "react";
import { setCustomElementProperties } from "../utils/customElement";

export function DocsToggle({ checked, label, onChange, showTextLabel = true }: { checked: boolean; label: string; onChange: (value: boolean) => void; showTextLabel?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { void setCustomElementProperties(ref.current, { value: checked, label, showLabel: false }); }, [checked, label]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(Boolean((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <div className="flex items-center justify-between gap-4 text-sm text-zinc-300">{showTextLabel && <span>{label}</span>}<arc-docs-toggle className={showTextLabel ? "" : "ml-auto"} ref={ref} /></div>;
}

export function DocsDropdown({ id, label, options, value, onChange }: { id: string; label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { void setCustomElementProperties(ref.current, { id, label, value, options: options.map((option) => ({ value: option, label: option })) }); }, [id, label, options, value]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-dropdown className="block w-full" ref={ref} />;
}

export function DocsSearch({ id, label, placeholder, value, onChange }: { id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { void setCustomElementProperties(ref.current, { id, label, placeholder, value }); }, [id, label, placeholder, value]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-search className="block w-full" ref={ref} />;
}

export interface DocsChoice { value: string; label: string; description?: string; }

export function DocsSegmented({ id, label, options, value, onChange, showLabel = true, orientation = "horizontal" }: { id: string; label: string; options: DocsChoice[]; value: string; onChange: (value: string) => void; showLabel?: boolean; orientation?: "horizontal" | "vertical" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { void setCustomElementProperties(ref.current, { id, label, options, value, showLabel, orientation, presentation: "segmented" }); }, [id, label, options, value, showLabel, orientation]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-segmented className="block w-full" ref={ref} />;
}

export function DocsSelectableList({ id, label, options, value, onChange, showLabel = true }: { id: string; label: string; options: DocsChoice[]; value: string; onChange: (value: string) => void; showLabel?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { void setCustomElementProperties(ref.current, { id, label, options, value, showLabel, orientation: "vertical", presentation: "list" }); }, [id, label, options, value, showLabel]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-segmented className="block w-full" ref={ref} />;
}

export function DocsTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const options = [{ value: "overview", label: "Overview" }, { value: "api", label: "API" }, { value: "appearance", label: "Appearance" }, { value: "playground", label: "Playground" }];
  useEffect(() => { void setCustomElementProperties(ref.current, { options, value }); }, [value]);
  useEffect(() => {
    const element = ref.current!;
    const listener = (event: Event) => onChange(String((event as CustomEvent).detail));
    element.addEventListener("valueChange", listener);
    return () => element.removeEventListener("valueChange", listener);
  }, [onChange]);
  return <arc-docs-tabs className="block" ref={ref} />;
}
