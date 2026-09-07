import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
let last = "",
  running = false,
  pending = false,
  child,
  stopping = false;
function fingerprint() {
  const hash = crypto.createHash("sha256");
  for (const dir of ["projects/design-library/src", ".storybook", "scripts"]) {
    for (const name of fs
      .readdirSync(path.join(root, dir), { recursive: true })
      .sort()) {
      const file = path.join(root, dir, name);
      if (
        !/\.(ts|mjs|json)$/.test(name) ||
        name.includes("/stories/") ||
        name.startsWith("stories/") ||
        name.includes(".generated.") ||
        !fs.statSync(file).isFile()
      )
        continue;
      hash.update(dir + "/" + name).update(fs.readFileSync(file));
    }
  }
  for (const name of ["tsconfig.json", "package.json"])
    hash.update(fs.readFileSync(path.join(root, name)));
  return hash.digest("hex");
}
function run(script) {
  return new Promise((resolve) => {
    child = spawn(process.execPath, [script], { cwd: root, stdio: "inherit" });
    child.on("error", (e) => {
      console.error(e.message);
      resolve(false);
    });
    child.on("exit", (code) => {
      child = null;
      resolve(code === 0);
    });
  });
}
async function generate() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  do {
    pending = false;
    const ok = await run("scripts/generate-config-stories.mjs");
    if (ok && !stopping) await run("scripts/generate-llm-guidance.mjs");
  } while (pending && !stopping);
  running = false;
}
last = fingerprint();
console.log("Watching Angular, Storybook and guidance sources. Ctrl+C stops.");
generate();
const timer = setInterval(() => {
  try {
    const next = fingerprint();
    if (next !== last) {
      last = next;
      generate();
    }
  } catch (e) {
    console.error("Watch scan failed:", e.message);
  }
}, 1000);
function stop() {
  stopping = true;
  clearInterval(timer);
  child?.kill("SIGTERM");
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
