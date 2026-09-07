import { useMemo } from "react";
import { useActiveSection } from "../hooks/useActiveSection";

export interface TocItem {
  id: string;
  label: string;
  children?: TocItem[];
}
const flatten = (items: TocItem[]): TocItem[] =>
  items.flatMap((item) => [item, ...flatten(item.children ?? [])]);

function TocLink({
  item,
  active,
  child = false,
  complete = false,
}: {
  item: TocItem;
  active: string;
  child?: boolean;
  complete?: boolean;
}) {
  const selected =
    active === item.id ||
    (!child && item.children?.some((entry) => entry.id === active));
  return (
    <a
      aria-current={active === item.id ? "location" : undefined}
      className={`group relative block rounded-lg transition ${child ? "py-1.5 pl-5 text-xs" : "py-2 pl-7 text-sm font-medium"} ${selected ? "bg-white/5 text-white" : "text-zinc-500 hover:bg-white/[.025] hover:text-zinc-300"}`}
      href={`#${item.id}`}
      title={child ? item.label : undefined}
    >
      <span
        aria-hidden="true"
        className={`absolute rounded-full border bg-zinc-950 transition ${child ? "left-[-4px] top-[13px] size-2" : "left-[-4px] top-[13px] size-3"} ${selected ? "border-emerald-300 bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,.1)]" : complete ? "border-emerald-500 bg-emerald-500" : "border-zinc-700 group-hover:border-zinc-500"}`}
      />
      {item.label}
    </a>
  );
}

export function PageToc({ items }: { items: TocItem[] }) {
  const flatItems = useMemo(() => flatten(items), [items]);
  const ids = useMemo(() => flatItems.map((item) => item.id), [flatItems]);
  const activeId = useActiveSection(ids);
  const activeIndex = Math.max(0, ids.indexOf(activeId));
  return (
    <aside className="sticky top-24 hidden w-64 shrink-0 self-start py-8 xl:block">
      <nav aria-label="On this page" className="w-64">
        <div className="mb-5 border-b border-white/10 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-zinc-400">
            On this page
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Follow the component reference
          </p>
        </div>
        <div className="relative ml-1 space-y-1 before:absolute before:bottom-3 before:left-[1px] before:top-3 before:w-px before:bg-white/10">
          {items.map((item) => (
            <div className="relative" key={item.id}>
              <TocLink
                item={item}
                active={activeId}
                complete={ids.indexOf(item.id) < activeIndex}
              />
              {item.children?.length ? (
                <div className="relative ml-6 border-l border-white/10 py-1 before:absolute before:-left-6 before:top-0 before:h-px before:w-6 before:bg-white/10">
                  {item.children.map((child) => (
                    <TocLink
                      item={child}
                      active={activeId}
                      child
                      complete={ids.indexOf(child.id) < activeIndex}
                      key={child.id}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
