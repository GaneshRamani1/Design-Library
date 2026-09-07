import type { ApiItem, ConfigurationExample } from "../pages/types";
import { OutputTable } from "./OutputTable";

export function EventReference({
  outputs,
  examples,
}: {
  outputs: ApiItem[];
  examples: ConfigurationExample[];
}) {
  return (
    <div className="space-y-6">
      <OutputTable items={outputs} />
      {examples.map((event, index) => (
        <article
          className="rounded-2xl border border-white/10 bg-white/[.025] p-5"
          key={`${event.property}-${index}`}
        >
          <code className="text-sm text-emerald-300">
            {event.property.replace("event.", "")}
          </code>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {event.description}
          </p>
        </article>
      ))}
    </div>
  );
}
