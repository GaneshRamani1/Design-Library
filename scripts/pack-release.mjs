import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const cache = mkdtempSync(join(tmpdir(), "arcwell-pack-cache-"));
try {
  execFileSync(
    "npm",
    ["pack", "./dist/design-library", "--pack-destination", "./dist"],
    { stdio: "inherit", env: { ...process.env, npm_config_cache: cache } },
  );
} finally {
  rmSync(cache, { recursive: true, force: true });
}
