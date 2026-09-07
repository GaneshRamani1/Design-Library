import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../apps/docs/src");
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(ts|tsx|css|json)$/.test(entry.name)) files.push(path);
  }
}

await walk(root);
const oversized = [];
for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n").length;
  if (lines > 300) oversized.push(`${file.replace(`${root}/`, "")}: ${lines} lines`);
}

if (oversized.length) {
  console.error(`Documentation files must stay at or below 300 lines:\n${oversized.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} documentation files; all are at or below 300 lines.`);
}
