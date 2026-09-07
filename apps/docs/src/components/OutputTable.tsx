import type { ApiItem } from "../pages/types";

export function OutputTable({ items }: { items: ApiItem[] }) {
  if (!items.length) return <p className="rounded-2xl border border-white/10 p-5 text-sm leading-6 text-zinc-500">This API declares no Angular outputs. Native DOM events still behave according to the host element.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="p-4">Output</th><th className="p-4">Payload</th><th className="p-4">Binding</th></tr></thead>
        <tbody>{items.map((item) => <tr id={`output-${item.name}`} className="scroll-mt-24 border-t border-white/10" key={item.name}><td className="p-4 font-mono text-emerald-300">{item.name}</td><td className="p-4 font-mono text-xs text-zinc-300">{item.type}</td><td className="p-4 font-mono text-xs text-zinc-500">({item.name})=&quot;handle($event)&quot;</td></tr>)}</tbody>
      </table>
    </div>
  );
}
