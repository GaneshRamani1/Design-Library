import test from "node:test";
import assert from "node:assert/strict";
import { configureStorybookEditor } from "./storybook-editor.mjs";

test("missing code CLI falls back to the macOS system editor", () => {
  const environment = configureStorybookEditor(
    { EDITOR: "code" },
    "darwin",
    () => false,
  );
  assert.equal(environment.EDITOR, "/usr/bin/open -a TextEdit");
  assert.equal(environment.LAUNCH_EDITOR, undefined);
});

test("an available explicit editor remains configured", () => {
  const environment = configureStorybookEditor(
    { EDITOR: "/usr/bin/open -a Preview" },
    "darwin",
    () => true,
  );
  assert.equal(environment.EDITOR, "/usr/bin/open -a Preview");
});

test("an invalid LAUNCH_EDITOR cannot override the fallback", () => {
  const environment = configureStorybookEditor(
    { LAUNCH_EDITOR: "missing-editor" },
    "linux",
    () => false,
  );
  assert.equal(environment.LAUNCH_EDITOR, undefined);
  assert.equal(environment.EDITOR, "xdg-open");
});

test("a terminal-only shell editor uses a windowed macOS fallback", () => {
  const environment = configureStorybookEditor(
    { EDITOR: "vi" },
    "darwin",
    () => true,
  );
  assert.equal(environment.EDITOR, "/usr/bin/open -a TextEdit");
});
