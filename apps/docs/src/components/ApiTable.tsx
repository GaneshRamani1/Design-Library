import type { ApiItem } from "../pages/types";

interface Props {
  items: ApiItem[];
  emptyMessage?: string;
}

export function ApiTable({ items, emptyMessage = "No public inputs." }: Props) {
  if (!items.length) return <p className="rounded-2xl border border-white/10 p-5 text-sm text-zinc-500">{emptyMessage}</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Default</th><th className="p-4">Purpose</th></tr></thead>
        <tbody>{items.map((item) => <tr id={`input-${item.name}`} className="scroll-mt-24 border-t border-white/10" key={item.name}><td className="p-4 font-mono text-emerald-300">{item.name}</td><td className="p-4 font-mono text-xs text-zinc-300">{item.type}</td><td className="p-4 font-mono text-xs text-zinc-500">{item.defaultValue}</td><td className="p-4 leading-6 text-zinc-400">{item.description}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
