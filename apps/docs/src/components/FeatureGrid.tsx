import type { ComponentDoc, ConfigurationExample } from "../pages/types";
import { ConfigurationGroup } from "./ConfigurationGroup";

export function FeatureGrid({
  component,
  items,
  emptyMessage,
}: {
  component: ComponentDoc;
  items: ConfigurationExample[];
  emptyMessage: string;
}) {
  if (!items.length)
    return (
      <p className="rounded-2xl border border-white/10 p-5 text-sm text-zinc-500">
        {emptyMessage}
      </p>
    );
  const groups = Object.values(
    items.reduce<Record<string, ConfigurationExample[]>>((result, item) => {
      (result[item.property] ??= []).push(item);
      return result;
    }, {}),
  );
  return (
    <div className="space-y-5">
      {groups.map((examples) => (
        <ConfigurationGroup
          component={component}
          examples={examples}
          key={examples[0]?.property}
        />
      ))}
    </div>
  );
}
