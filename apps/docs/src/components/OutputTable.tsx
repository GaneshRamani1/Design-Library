import type { ApiItem } from "../pages/types";

export function OutputTable({ items }: { items: ApiItem[] }) {
  if (!items.length)
    return (
      <p className="rounded-2xl border border-white/10 p-5 text-sm leading-6 text-zinc-500">
        This API declares no Angular outputs. Native DOM events still behave
        according to the host element.
      </p>
    );
  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[.025]">
      {items.map((item) => (
        <article
          id={`output-${item.name}`}
          className="scroll-mt-24 grid gap-5 p-5 md:grid-cols-[10rem_minmax(0,1fr)] md:p-6"
          key={item.name}
        >
          <div>
            <code className="font-semibold text-emerald-300">{item.name}</code>
            <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-zinc-500">
              {item.defaultValue}
            </span>
          </div>
          <div>
            <code className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-300">
              $event: {item.type}
            </code>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {item.description}
            </p>
            <code className="mt-4 block overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-3 text-xs text-zinc-300">
              ({item.name})=&quot;handle($event)&quot;
            </code>
          </div>
        </article>
      ))}
    </div>
  );
}
