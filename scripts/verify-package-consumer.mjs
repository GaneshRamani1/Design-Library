import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const folder = mkdtempSync(join(tmpdir(), "arcwell-consumer-"));
try {
  const result = JSON.parse(
    execFileSync(
      "npm",
      ["pack", "./dist/design-library", "--pack-destination", folder, "--json"],
      {
        encoding: "utf8",
        env: { ...process.env, npm_config_cache: join(folder, ".npm-cache") },
      },
    ),
  );
  const files = new Set(result[0].files.map((entry) => entry.path));
  for (const required of [
    "package.json",
    "types/arcwell-ui.d.ts",
    "styles.css",
  ])
    if (!files.has(required))
      throw Error(`Packed package is missing ${required}`);
  if (
    ![...files].some(
      (file) => file.startsWith("fesm2022/") && file.endsWith(".mjs"),
    )
  )
    throw Error("Packed package is missing its ESM bundle");
  const manifest = JSON.parse(
    readFileSync("dist/design-library/package.json", "utf8"),
  );
  for (const peer of [
    "@angular/core",
    "@angular/common",
    "@angular/forms",
    "@angular/cdk",
  ])
    if (!manifest.peerDependencies?.[peer])
      throw Error(`Package is missing peer dependency ${peer}`);
  console.log(
    `Consumer package verified: ${result[0].filename} (${files.size} files)`,
  );
} finally {
  rmSync(folder, { recursive: true, force: true });
}
