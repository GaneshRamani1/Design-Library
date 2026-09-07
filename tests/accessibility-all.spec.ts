import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const axe = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

test("all default component stories have no serious accessibility violations", async ({
  page,
  request,
}) => {
  test.setTimeout(180_000);
  const index = await (await request.get("/index.json")).json();
  const entries = Object.values(index.entries) as Array<{
    id: string;
    type: string;
    name: string;
    title: string;
  }>;
  const defaults = entries.filter(
    (entry) =>
      entry.type === "story" &&
      entry.name === "Default" &&
      entry.title.split("/").length === 3,
  );
  const failures: string[] = [];
  for (const entry of defaults) {
    await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`);
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(
      async () =>
        (
          await (window as any).axe.run(document, {
            resultTypes: ["violations"],
          })
        ).violations,
    );
    for (const violation of violations.filter((item: any) =>
      ["serious", "critical"].includes(item.impact),
    ))
      failures.push(`${entry.id}: ${violation.id} (${violation.nodes.length})`);
  }
  expect(failures, failures.join("\n")).toEqual([]);
});
