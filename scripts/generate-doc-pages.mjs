import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const references = resolve(root, "skills/arcwell-ui/references/components");
const target = resolve(root, "apps/docs/src/pages/catalog");
const indexSource = await readFile(resolve(root, "skills/arcwell-ui/references/index.md"), "utf8");
const rows = [...indexSource.matchAll(/^\| ([^|]+) \| \[([^\]]+)\]\(components\/([^)]+)\.md\) \| `([^`]+)` \|$/gm)];

function clean(value) {
  return value.trim().replaceAll("`", "").replaceAll("\\|", "|");
}

function section(source, heading, nextHeading = "## ") {
  const start = source.indexOf(`## ${heading}`);
  if (start < 0) return "";
  const contentStart = source.indexOf("\n", start) + 1;
  const end = source.indexOf(`\n${nextHeading}`, contentStart);
  return source.slice(contentStart, end < 0 ? undefined : end).trim();
}

function table(source, heading) {
  const body = section(source, heading);
  return body.split("\n").filter((line) => line.startsWith("|")).slice(2).map((line) => {
    const protectedLine = line.replaceAll("\\|", "__PIPE__");
    return protectedLine.split("|").slice(1, -1).map((cell) => clean(cell.replaceAll("__PIPE__", "|")));
  });
}

function bullets(source, heading) {
  return section(source, heading).split("\n").filter((line) => line.startsWith("- ")).map((line) => line.slice(2).trim());
}

function links(source, heading) {
  return bullets(source, heading).map((line) => {
    const match = line.match(/^\[([^\]]+)\]\(([^)]+)\)(?: — (.+))?$/);
    return match ? { label: match[1], href: match[2], description: match[3] ?? "" } : { label: line, href: "", description: "" };
  });
}

function configuration(source) {
  return bullets(source, "Configuration coverage").map((line) => {
    const match = line.match(/^`([^`]+)`: \[([^\]]+)\]\(([^)]+)\) — (.+)$/);
    if (!match) return null;
    const [, property, label, href, description] = match;
    const kind = property.startsWith("event.") ? "event" : href.includes("-variations--") ? "variation" : href.includes("-appearance--") ? "appearance" : "configuration";
    return { property, label, href, description, kind };
  }).filter((item) => item !== null);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

const registryEntries = [];
const loaderEntries = [];

for (const [, category, className, slug, selector] of rows) {
  const source = await readFile(resolve(references, `${slug}.md`), "utf8");
  const title = source.match(/^# [^/]+\/(.+)$/m)?.[1] ?? className.replace(/Component|Directive$/, "");
  const description = source.match(/^# .+\n\n([^\n]+)/m)?.[1] ?? "Arcwell UI building block.";
  const kind = source.match(/^- Kind: (.+)$/m)?.[1] ?? "standalone component";
  const inputs = table(source, "Inputs and models").map(([name, type, defaultValue, inputKind, declaredIn, guidance]) => ({ name, type, defaultValue, kind: inputKind, declaredIn, description: guidance }));
  const outputs = table(source, "Outputs").map(([name, payload]) => ({ name, type: payload, defaultValue: "Angular output", kind: "output", declaredIn: className, description: `Emits a ${payload} payload.` }));
  const projectionText = section(source, "Projection slots");
  const slots = projectionText.startsWith("No content") ? [] : projectionText.split("\n").filter((line) => line.startsWith("-")).map((line) => line.slice(1).trim());
  const methods = bullets(source, "Public instance state and methods");
  const integration = bullets(source, "Integration decisions");
  const behavioralExamples = links(source, "Behavioral examples");
  const patterns = links(source, "Composition patterns");
  const config = configuration(source);
  const defaults = section(source, "Storybook defaults").match(/```ts\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "No defaults documented.";
  const relatedTypes = section(source, "Related data types").match(/```ts\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "No related public types.";
  const doc = { slug, title, category, className, selector, kind, description, integration, inputs, outputs, slots, methods, behavioralExamples, configuration: config, patterns, defaults, relatedTypes };
  const folder = resolve(target, slug);
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, "docs.json"), `${JSON.stringify(doc)}\n`);
  await writeFile(resolve(folder, "index.ts"), `export { default as docs } from "./docs.json";\n`);
  registryEntries.push(`  { slug: ${JSON.stringify(slug)}, title: ${JSON.stringify(title)}, category: ${JSON.stringify(category)} }`);
  loaderEntries.push(`  ${JSON.stringify(slug)}: () => import("./${slug}/docs.json").then((module) => module.default as ComponentDoc)`);
}

const registry = `import type { ComponentDoc } from "../types";\n\nexport interface ComponentSummary { slug: string; title: string; category: string; }\n\nexport const componentCatalog: ComponentSummary[] = [\n${registryEntries.join(",\n")}\n];\n\nexport const componentLoaders: Record<string, () => Promise<ComponentDoc>> = {\n${loaderEntries.join(",\n")}\n};\n`;
await writeFile(resolve(target, "index.ts"), registry);
