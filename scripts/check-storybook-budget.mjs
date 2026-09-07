import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../storybook-static", import.meta.url).pathname;
const files = [];
const visit = (dir) =>
  readdirSync(dir, { withFileTypes: true }).forEach((entry) =>
    entry.isDirectory()
      ? visit(join(dir, entry.name))
      : files.push(join(dir, entry.name)),
  );
visit(root);
const assets = files
  .filter((file) => /\.(?:js|css)$/.test(file))
  .map((file) => ({ file: relative(root, file), bytes: statSync(file).size }));
const total = assets.reduce((sum, asset) => sum + asset.bytes, 0);
const largest = assets.reduce(
  (max, asset) => (asset.bytes > max.bytes ? asset : max),
  { file: "", bytes: 0 },
);
const limits = { largest: 4.5 * 1024 * 1024, total: 90 * 1024 * 1024 };
if (largest.bytes > limits.largest || total > limits.total)
  throw Error(
    `Storybook budget exceeded: largest=${largest.file} ${(largest.bytes / 1048576).toFixed(2)}MiB; total=${(total / 1048576).toFixed(2)}MiB`,
  );
console.log(
  `Storybook budget passed: largest=${largest.file} ${(largest.bytes / 1048576).toFixed(2)}MiB; total=${(total / 1048576).toFixed(2)}MiB`,
);
