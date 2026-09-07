import { useMemo } from "react";
import { useActiveSection } from "../hooks/useActiveSection";

export interface TocItem { id: string; label: string; children?: TocItem[]; }
const flatten = (items: TocItem[]): TocItem[] => items.flatMap((item) => [item, ...flatten(item.children ?? [])]);

function TocLink({ item, active, child = false }: { item: TocItem; active: string; child?: boolean }) {
  const selected = active === item.id;
  const classes = child
    ? `ml-2 block truncate rounded-md border-l py-1 pl-4 text-xs transition ${selected ? "border-emerald-300 bg-emerald-300/[.06] text-emerald-200" : "border-white/10 text-zinc-600 hover:text-zinc-300"}`
    : `block rounded-lg border-l-2 py-1.5 pl-3 text-sm transition ${selected ? "border-emerald-300 bg-white/5 text-white" : "border-transparent text-zinc-500 hover:bg-white/[.035] hover:text-white"}`;
  return <a aria-current={selected ? "location" : undefined} className={classes} href={`#${item.id}`} title={child ? item.label : undefined}>{item.label}</a>;
}

export function PageToc({ items }: { items: TocItem[] }) {
  const flatItems = useMemo(() => flatten(items), [items]);
  const ids = useMemo(() => flatItems.map((item) => item.id), [flatItems]);
  const activeId = useActiveSection(ids);
  return <aside className="sticky top-24 hidden w-64 shrink-0 self-start py-8 xl:block"><nav aria-label="On this page" className="w-64 border-l border-white/10 pl-6"><div className="mb-4 border-b border-white/10 pb-4"><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-zinc-400">On this page</p></div><div className="space-y-1">{items.map((item) => <div key={item.id}><TocLink item={item} active={activeId} />{item.children?.map((child) => <TocLink item={child} active={activeId} child key={child.id} />)}</div>)}</div></nav></aside>;
}
