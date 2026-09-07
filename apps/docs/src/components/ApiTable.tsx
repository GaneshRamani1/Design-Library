import type { ApiItem } from "../pages/types";

interface Props {
  items: ApiItem[];
  emptyMessage?: string;
}

export function ApiTable({ items, emptyMessage = "No public inputs." }: Props) {
  if (!items.length) return <p className="rounded-2xl border border-white/10 p-5 text-sm text-zinc-500">{emptyMessage}</p>;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.025]">
      <div className="hidden overflow-x-auto xl:block"><table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-white/5 text-[10px] uppercase tracking-[.16em] text-zinc-500"><tr><th className="px-5 py-4">Input</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Default</th><th className="px-5 py-4">Purpose</th></tr></thead>
        <tbody>{items.map((item) => <tr id={`input-${item.name}`} className="scroll-mt-24 border-t border-white/10 align-top" key={item.name}><td className="px-5 py-5"><code className="font-semibold text-emerald-300">{item.name}</code></td><td className="px-5 py-5"><code className="inline-block rounded-md bg-white/5 px-2 py-1 text-xs leading-5 text-zinc-300">{item.type}</code></td><td className="px-5 py-5"><code className="inline-block rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-500">{item.defaultValue}</code></td><td className="max-w-md px-5 py-5 leading-6 text-zinc-400">{item.description}</td></tr>)}</tbody>
      </table></div>
      <div className="divide-y divide-white/10 xl:hidden">{items.map((item) => <article className="min-w-0 p-5" key={item.name}><div className="flex flex-wrap items-center justify-between gap-3"><code className="font-semibold text-emerald-300">{item.name}</code><code className="max-w-full break-all rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-500">{item.defaultValue}</code></div><code className="mt-3 block break-words text-xs leading-5 text-zinc-300">{item.type}</code><p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p></article>)}</div>
    </div>
  );
}
