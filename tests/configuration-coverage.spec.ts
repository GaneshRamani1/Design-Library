import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const manifest = JSON.parse(
  readFileSync("projects/design-library/configuration-coverage.json", "utf8"),
) as Array<{
  component: string;
  title: string;
  inputs: string[];
  stories: Array<{
    prop: string;
    story: string;
    id: string;
    title: string;
    description: string;
  }>;
}>;

test("every public input and appearance setting has a registered story", async ({
  request,
}) => {
  const index = await (await request.get("/index.json")).json();
  for (const component of manifest) {
    for (const input of component.inputs)
      expect(
        component.stories.some((story) => story.prop === input),
        `${component.component}.${input}`,
      ).toBe(true);
    for (const story of component.stories) {
      const id = story.id;
      expect(["Configuration", "Variations", "Events", "Appearance"]).toContain(
        story.title.split("/")[2],
      );
      expect(story.description.length).toBeGreaterThan(30);
      expect(index.entries[id], id).toBeDefined();
    }
  }
});
for (let shard = 0; shard < 6; shard++) {
  test(`configuration stories render without errors, group ${shard + 1}`, async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const errors: string[] = [];
    let current = "";
    page.on("pageerror", (error) =>
      errors.push(`${current}: ${error.message}`),
    );
    page.on("console", (message) => {
      if (message.type() === "error" && /NG\d{4}|Error:/.test(message.text()))
        errors.push(`${current}: ${message.text()}`);
    });
    const stories = manifest
      .filter((_, index) => index % 6 === shard)
      .flatMap((component) => component.stories.map((story) => story.id));
    for (const id of stories) {
      current = id;
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await expect(page.locator("#storybook-root > *"), id).not.toHaveCount(0);
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      await expect(page.locator(".sb-errordisplay")).toBeHidden();
      await expect(
        page.getByRole("note", {
          name: "About this story",
          includeHidden: true,
        }),
      ).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
