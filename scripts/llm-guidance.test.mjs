import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const manifest = JSON.parse(read("skills/arcwell-ui/manifest.json"));
test("all catalog APIs have prompts, correctly resolved inherited types and projection slots", () => {
  const coverage = JSON.parse(
    read("projects/design-library/configuration-coverage.json"),
  );
  assert.equal(manifest.components.length, coverage.length);
  for (const c of coverage) {
    const item = manifest.components.find((i) => i.component === c.component);
    assert.ok(item, c.component);
    assert.deepEqual(
      item.inputs.map((i) => i.name).sort(),
      [...c.inputs].sort(),
    );
    assert.deepEqual(
      item.outputs.map((i) => i.name).sort(),
      [...c.events].sort(),
    );
    assert.ok(fs.existsSync(path.join(root, "skills/arcwell-ui", item.file)));
  }
  const number = manifest.components.find(
    (c) => c.component === "NumberInputComponent",
  );
  assert.equal(number.inputs.find((i) => i.name === "id").required, true);
  assert.equal(
    number.outputs.find((i) => i.name === "valueChange").type,
    "number | null",
  );
  assert.ok(
    manifest.components
      .find((c) => c.component === "HeaderComponent")
      .slots.includes("[headerRight]"),
  );
  assert.ok(
    manifest.patterns.some(
      (p) =>
        p.id === "navigation-carousel-directive--default" &&
        p.components.includes("card"),
    ),
  );
  assert.deepEqual(manifest.services.map((service) => service.service).sort(), [
    "IconRegistry",
    "NotificationService",
    "PopoverService",
  ]);
  for (const service of manifest.services)
    assert.ok(
      fs.existsSync(path.join(root, "skills/arcwell-ui", service.file)),
      service.service,
    );
  assert.ok(
    manifest.services
      .find((service) => service.service === "NotificationService")
      .methods.some((method) => method.name === "toast"),
  );
  assert.ok(
    manifest.services
      .find((service) => service.service === "PopoverService")
      .methods.some((method) => method.name === "open"),
  );
  assert.ok(
    manifest.services
      .find((service) => service.service === "IconRegistry")
      .properties.some((property) => property.name === "names"),
  );
});
test("all local Markdown links resolve and all Storybook IDs belong to current stories", () => {
  const files = JSON.parse(
    read("skills/arcwell-ui/.generated-files.json"),
  ).filter((p) => p.endsWith(".md"));
  const storyIds = new Set(manifest.storyIds);
  for (const file of files) {
    const source = read(file);
    for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
      const url = match[1];
      if (url.startsWith("http")) {
        if (storyIds && url.includes("?path=/story/"))
          assert.ok(storyIds.has(url.split("?path=/story/")[1]), url);
        continue;
      }
      if (url.startsWith("#")) continue;
      // Match only generated Markdown links, not arbitrary Angular/TS snippets.
      if (!/\.md$|\.ts$|\.mjs$/.test(url)) continue;
      assert.ok(
        fs.existsSync(path.resolve(root, path.dirname(file), url)),
        `${file}: ${url}`,
      );
    }
  }
});
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "arcwell-guidance-"));
  function write(file, body) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), body);
  }
  fs.symlinkSync(
    path.join(root, "node_modules"),
    path.join(dir, "node_modules"),
    "dir",
  );
  write(
    "scripts/generate-llm-guidance.mjs",
    read("scripts/generate-llm-guidance.mjs"),
  );
  write(
    ".storybook/tsconfig.json",
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        experimentalDecorators: true,
        skipLibCheck: true,
      },
      include: ["../projects/**/*.ts"],
    }),
  );
  write(
    "projects/design-library/src/lib/sample.component.ts",
    `import {Component,Directive,input,model,output} from '@angular/core';
 @Directive() export class Base<T>{readonly label=input.required<string>();readonly changed=output<T>();}
 @Component({selector:'dl-sample',standalone:true,template:'<ng-content select="[sampleActions]"/><ng-content/>'}) export class SampleComponent extends Base<number>{readonly count=model(2);readonly disabled=input(false);}`,
  );
  write(
    "projects/design-library/src/lib/companion.component.ts",
    `import {Component} from '@angular/core';@Component({selector:'button[dlCompanion]',standalone:true,template:'<ng-content/>'})export class CompanionComponent{}`,
  );
  write(
    "projects/design-library/src/lib/sample.stories.ts",
    `const children='<button dlCompanion>Go</button>'; const meta={title:'Test/Sample',args:{label:'Test'},render:(args:any)=>({props:args,template:\`<dl-sample>\${children}</dl-sample>\`})};export default meta;export const Default={};`,
  );
  write(
    "projects/design-library/src/lib/companion.stories.ts",
    `const meta={title:'Test/Companion'};export default meta;export const Default={};`,
  );
  write(
    "projects/design-library/src/public-api.ts",
    `export {SampleComponent} from './lib/sample.component';export {CompanionComponent} from './lib/companion.component';`,
  );
  write(
    "projects/design-library/configuration-coverage.json",
    JSON.stringify([
      {
        component: "SampleComponent",
        title: "Test/Sample",
        inputs: ["label", "count", "disabled"],
        events: ["changed", "countChange"],
        stories: [],
      },
      {
        component: "CompanionComponent",
        title: "Test/Companion",
        inputs: [],
        events: [],
        stories: [],
      },
    ]),
  );
  return {
    dir,
    write,
    run: (...args) =>
      spawnSync(
        process.execPath,
        ["scripts/generate-llm-guidance.mjs", ...args],
        { cwd: dir, encoding: "utf8" },
      ),
  };
}
test("generation is deterministic; check detects stale content without writing; regeneration preserves unrelated files", () => {
  const f = fixture();
  try {
    let result = f.run();
    assert.equal(result.status, 0, result.stderr);
    const file = path.join(
      f.dir,
      "skills/arcwell-ui/references/components/sample.md",
    );
    const original = fs.readFileSync(file, "utf8");
    result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(file, "utf8"), original);
    const m = JSON.parse(
      fs.readFileSync(
        path.join(f.dir, "skills/arcwell-ui/manifest.json"),
        "utf8",
      ),
    );
    assert.equal(
      m.components[0].outputs.find((o) => o.name === "changed").type,
      "number",
    );
    assert.equal(m.patterns.length, 1);
    assert.ok(m.patterns[0].components.includes("companion"));
    fs.writeFileSync(file, original + "stale");
    result = f.run("--check");
    assert.notEqual(result.status, 0);
    assert.equal(fs.readFileSync(file, "utf8"), original + "stale");
    f.write("skills/arcwell-ui/references/notes.md", "User-maintained notes");
    result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(file, "utf8"), original);
    assert.equal(
      fs.readFileSync(
        path.join(f.dir, "skills/arcwell-ui/references/notes.md"),
        "utf8",
      ),
      "User-maintained notes",
    );
  } finally {
    fs.rmSync(f.dir, { recursive: true, force: true });
  }
});
test("uncovered public components fail generation rather than silently disappearing", () => {
  const f = fixture();
  try {
    f.write(
      "projects/design-library/src/lib/new.component.ts",
      `import {Component} from '@angular/core';@Component({selector:'dl-new',standalone:true,template:''})export class NewComponent{}`,
    );
    fs.appendFileSync(
      path.join(f.dir, "projects/design-library/src/public-api.ts"),
      `export {NewComponent} from './lib/new.component';`,
    );
    const result = f.run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /lacks Storybook coverage/);
  } finally {
    fs.rmSync(f.dir, { recursive: true, force: true });
  }
});
test("watch mode regenerates on source changes and ignores generated story output", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "arcwell-watch-"));
  let child;
  try {
    for (const folder of [
      "scripts",
      ".storybook",
      "projects/design-library/src/lib/stories",
    ])
      fs.mkdirSync(path.join(dir, folder), { recursive: true });
    fs.copyFileSync(
      path.join(root, "scripts/watch-llm-guidance.mjs"),
      path.join(dir, "scripts/watch-llm-guidance.mjs"),
    );
    fs.writeFileSync(path.join(dir, "scripts/generate-config-stories.mjs"), "");
    fs.writeFileSync(
      path.join(dir, "scripts/generate-llm-guidance.mjs"),
      `import fs from 'node:fs';fs.appendFileSync('runs','x');`,
    );
    for (const name of ["tsconfig.json", "package.json"])
      fs.writeFileSync(path.join(dir, name), "{}");
    child = spawn(process.execPath, ["scripts/watch-llm-guidance.mjs"], {
      cwd: dir,
      stdio: "ignore",
    });
    const count = () =>
      fs.existsSync(path.join(dir, "runs"))
        ? fs.readFileSync(path.join(dir, "runs"), "utf8").length
        : 0;
    const until = async (condition) => {
      const deadline = Date.now() + 6000;
      while (!condition()) {
        assert.ok(Date.now() < deadline, "Watcher did not regenerate");
        await new Promise((r) => setTimeout(r, 100));
      }
    };
    await until(() => count() === 1);
    fs.writeFileSync(
      path.join(dir, "projects/design-library/src/lib/example.ts"),
      "export const x=1;",
    );
    await until(() => count() === 2);
    fs.writeFileSync(
      path.join(
        dir,
        "projects/design-library/src/lib/stories/generated.stories.ts",
      ),
      "generated",
    );
    await new Promise((r) => setTimeout(r, 1400));
    assert.equal(count(), 2);
  } finally {
    if (child) {
      const closed = new Promise((r) => child.once("exit", r));
      child.kill("SIGTERM");
      await closed;
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
