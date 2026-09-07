import { constants, accessSync } from "node:fs";
import { execFileSync } from "node:child_process";

export function commandExists(value) {
  const executable = value
    ?.trim()
    .match(/^(?:"([^"]+)"|'([^']+)'|(\S+))/)
    ?.slice(1)
    .find(Boolean);
  if (!executable) return false;
  try {
    if (executable.includes("/")) accessSync(executable, constants.X_OK);
    else
      execFileSync(
        process.platform === "win32" ? "where.exe" : "which",
        [executable],
        { stdio: "ignore" },
      );
    return true;
  } catch {
    return false;
  }
}

function isTerminalEditor(value) {
  const executable = value
    ?.trim()
    .match(/^(?:"([^"]+)"|'([^']+)'|(\S+))/)
    ?.slice(1)
    .find(Boolean);
  const name = executable?.split(/[\\/]/).at(-1)?.toLowerCase();
  return ["vi", "vim", "nvim", "nano", "emacs"].includes(name);
}

export function configureStorybookEditor(
  source = process.env,
  platform = process.platform,
  exists = commandExists,
) {
  const environment = { ...source };
  for (const name of ["LAUNCH_EDITOR", "VISUAL", "EDITOR"])
    if (
      environment[name] &&
      (!exists(environment[name]) || isTerminalEditor(environment[name]))
    )
      delete environment[name];
  if (!environment.LAUNCH_EDITOR && !environment.VISUAL && !environment.EDITOR)
    environment.EDITOR =
      platform === "darwin"
        ? "/usr/bin/open -a TextEdit"
        : platform === "win32"
          ? "notepad"
          : "xdg-open";
  return environment;
}
