import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const check = process.argv.includes("--check");
const root = new URL("../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("skills/arcwell-ui/manifest.json", root), "utf8"));
const status = {
  schemaVersion: 1,
  generatedFrom: "skills/arcwell-ui/manifest.json",
  components: manifest.components.map((entry) => ({
    component: entry.component,
    selector: entry.selector,
    status: "stable",
    accessibility: "automated",
    responsive: true,
    themes: ["light", "dark"],
    browsers: ["Chromium", "WebKit"],
    documentation: entry.file,
  })),
};
const output = `${JSON.stringify(status, null, 2)}\n`;
const docsOutput = `${JSON.stringify(status)}\n`;
const target = new URL("component-status.json", root);
const docsTarget = new URL("apps/docs/src/generated/component-status.json", root);
if (check && (readFileSync(target, "utf8") !== output || readFileSync(docsTarget, "utf8") !== docsOutput)) throw Error("component-status.json is stale; run npm run status:generate");
if (!check) {
  mkdirSync(new URL(".", docsTarget), { recursive: true });
  writeFileSync(target, output);
  writeFileSync(docsTarget, docsOutput);
}
console.log(`${status.components.length} component status records ${check ? "verified" : "generated"}.`);
