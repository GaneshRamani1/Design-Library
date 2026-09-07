import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(root, "skills", "arcwell-ui");
const manifestPath = path.join(skillRoot, "manifest.json");

const normalize = (value = "") =>
  value
    .toLowerCase()
    .replace(/component|directive|service/g, "")
    .replace(/[^a-z0-9]+/g, "");

const safeReferencePath = (relativePath) => {
  const resolved = path.resolve(skillRoot, relativePath);
  if (
    !resolved.startsWith(`${skillRoot}${path.sep}`) ||
    !relativePath.endsWith(".md")
  ) {
    throw new Error("The catalog contains an invalid reference path.");
  }
  return resolved;
};

export async function loadCatalog() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  return {
    manifest,
    version: manifest.version,
    loadedAt: new Date().toISOString(),
  };
}

export function catalogSummary(catalog) {
  const { manifest } = catalog;
  return {
    name: "Arcwell UI",
    version: manifest.version,
    components: manifest.components.length,
    services: manifest.services.length,
    patterns: manifest.patterns.length,
    stories: manifest.storyIds.length,
  };
}

export function listCatalog(catalog, kind = "all") {
  const { manifest } = catalog;
  const result = {};
  if (kind === "all" || kind === "component") {
    result.components = manifest.components.map(
      ({ component, selector, file }) => ({ component, selector, file }),
    );
  }
  if (kind === "all" || kind === "service") {
    result.services = manifest.services.map(({ service, file }) => ({
      service,
      file,
    }));
  }
  if (kind === "all" || kind === "pattern") result.patterns = manifest.patterns;
  return result;
}

function findEntry(entries, value, fields) {
  const needle = normalize(value);
  return entries.find((entry) =>
    fields.some((field) => normalize(entry[field]) === needle),
  );
}

export async function getGuide(catalog, kind, name) {
  const collection =
    kind === "component"
      ? catalog.manifest.components
      : catalog.manifest.services;
  const fields =
    kind === "component"
      ? ["component", "selector", "file"]
      : ["service", "file"];
  const entry = findEntry(collection, name, fields);
  if (!entry) {
    const suggestions = searchCatalog(catalog, name, kind, 5).map(
      (item) => item.name,
    );
    throw new Error(
      `Unknown ${kind} “${name}”.${suggestions.length ? ` Try: ${suggestions.join(", ")}.` : ""}`,
    );
  }
  const markdown = await readFile(safeReferencePath(entry.file), "utf8");
  return { kind, ...entry, markdown };
}

export async function getPattern(catalog, id) {
  const entry = findEntry(catalog.manifest.patterns, id, ["id", "file"]);
  if (!entry) throw new Error(`Unknown pattern “${id}”.`);
  return {
    ...entry,
    markdown: await readFile(safeReferencePath(entry.file), "utf8"),
  };
}

export function getStory(catalog, id) {
  const exact = catalog.manifest.storyIds.find(
    (storyId) => normalize(storyId) === normalize(id),
  );
  if (!exact) {
    const matches = catalog.manifest.storyIds
      .filter((storyId) => normalize(storyId).includes(normalize(id)))
      .slice(0, 10);
    throw new Error(
      `Unknown story “${id}”.${matches.length ? ` Matches: ${matches.join(", ")}.` : ""}`,
    );
  }
  const pattern = catalog.manifest.patterns.find((item) => item.id === exact);
  return {
    id: exact,
    storybookUrl: `${process.env.STORYBOOK_BASE_URL || "http://127.0.0.1:6006"}/?path=/story/${exact}`,
    patternFile: pattern?.file,
    relatedComponents: pattern?.components || [],
  };
}

export function searchCatalog(catalog, query, kind = "all", limit = 10) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const records = [];
  if (kind === "all" || kind === "component") {
    for (const item of catalog.manifest.components)
      records.push({
        kind: "component",
        name: item.component,
        selector: item.selector,
        file: item.file,
        searchable: JSON.stringify(item),
      });
  }
  if (kind === "all" || kind === "service") {
    for (const item of catalog.manifest.services)
      records.push({
        kind: "service",
        name: item.service,
        file: item.file,
        searchable: JSON.stringify(item),
      });
  }
  if (kind === "all" || kind === "pattern") {
    for (const item of catalog.manifest.patterns)
      records.push({
        kind: "pattern",
        name: item.id,
        file: item.file,
        components: item.components,
        searchable: JSON.stringify(item),
      });
  }
  return records
    .map((record) => {
      const haystack =
        `${record.name} ${record.selector || ""} ${record.searchable}`.toLowerCase();
      const score = terms.reduce(
        (total, term) =>
          total +
          (haystack.includes(term) ? 2 : 0) +
          (normalize(record.name).includes(normalize(term)) ? 3 : 0),
        0,
      );
      return { ...record, score };
    })
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ searchable, ...record }) => record);
}

export function validateUsage(catalog, selector, inputs = [], outputs = []) {
  const component = findEntry(catalog.manifest.components, selector, [
    "component",
    "selector",
    "file",
  ]);
  if (!component)
    return {
      valid: false,
      errors: [`Unknown component or selector “${selector}”.`],
    };
  const inputNames = new Set(component.inputs.map((input) => input.name));
  const outputNames = new Set(component.outputs.map((output) => output.name));
  const errors = [
    ...inputs
      .filter((name) => !inputNames.has(name))
      .map((name) => `Unknown input “${name}”.`),
    ...outputs
      .filter((name) => !outputNames.has(name))
      .map((name) => `Unknown output “${name}”.`),
  ];
  return {
    valid: errors.length === 0,
    component: component.component,
    selector: component.selector,
    errors,
    availableInputs: component.inputs.map(
      ({ name, type, required, default: defaultValue }) => ({
        name,
        type,
        required,
        default: defaultValue,
      }),
    ),
    availableOutputs: component.outputs,
    slots: component.slots,
  };
}
