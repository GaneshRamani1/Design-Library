import path from "node:path";
import { delimiter } from "node:path";
import { spawn } from "node:child_process";
import { configureStorybookEditor } from "./storybook-editor.mjs";

const environment = configureStorybookEditor();
environment.PATH = `${path.resolve("scripts/editor-bin")}${delimiter}${environment.PATH ?? ""}`;
const editor =
  environment.LAUNCH_EDITOR ?? environment.VISUAL ?? environment.EDITOR;
console.log(`Storybook editor: ${editor}`);

const cli = path.resolve("node_modules/@angular/cli/bin/ng.js");
const child = spawn(
  process.execPath,
  [cli, "run", "design-library:storybook", ...process.argv.slice(2)],
  { env: environment, stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => child.kill(signal));
child.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
