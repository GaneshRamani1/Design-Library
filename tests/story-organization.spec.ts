import { test, expect } from "@playwright/test";

test("catalog groups every component into the ordered learning journey", async ({
  request,
}) => {
  const index = await (await request.get("/index.json")).json();
  expect(
    index.entries["actions-button-layout-and-sizing-size--size-sm"].name,
  ).toBe("Small");
  const titles = Object.values(index.entries).map(
    (entry: any) => entry.title as string,
  );
  const componentTitles = titles.filter(
    (title) => !/^(Welcome|Foundations)\//.test(title),
  );
  expect(
    componentTitles.every((title) =>
      ["Configuration", "Variations", "Events", "Appearance"].includes(
        title.split("/")[2],
      ),
    ),
  ).toBe(true);
  for (const title of [
    "Inputs/Input/Configuration/Masking/Mask Preset",
    "Actions/Button/Configuration/Layout and sizing/Size",
    "Overlays/Modal/Configuration/Behavior/Close On Escape",
    "Inputs/Input/Variations/Mask examples/Tax identifiers",
  ])
    expect(titles).toContain(title);
});

test("handwritten and generated stories explain their purpose above the example", async ({
  page,
}) => {
  for (const id of [
    "actions-button--default",
    "inputs-input-mask-examples-tax-identifiers--ssn",
    "actions-button-layout-and-sizing-size--size-sm",
  ]) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const note = page.getByRole("note", { name: "About this story" });
    await expect(note).toBeVisible();
    expect(
      (await note.locator(".sb-story-note-description").innerText()).length,
    ).toBeGreaterThan(40);
    expect(await note.getAttribute("aria-live")).toBeNull();
    const noteBounds = await note.boundingBox();
    const exampleBounds = await page.locator(".sb-story-example").boundingBox();
    expect(noteBounds!.y + noteBounds!.height).toBeLessThanOrEqual(
      exampleBounds!.y,
    );
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(
    page.getByRole("note", { name: "About this story" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("setting notes highlight the active property and the learning stage", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-toggle-events-value-change--event-value-change&viewMode=story",
  );
  await expect(page.locator(".sb-story-setting")).toContainText("valueChange");
  await expect(
    page.locator('.sb-story-journey [aria-current="step"]'),
  ).toHaveText("3. Events");
  await page.goto(
    "/iframe.html?id=actions-button-layout-and-sizing-size--size-sm&viewMode=story",
  );
  await expect(page.locator(".sb-story-setting")).toContainText("size");
  await expect(
    page.locator('.sb-story-journey [aria-current="step"]'),
  ).toHaveText("1. Configuration");
});

test("sidebar places configuration before variations, events and appearance", async ({
  page,
}) => {
  await page.goto(
    "/?path=/story/inputs-toggle-configuration-overview--overview",
  );
  const ids = [
    "inputs-toggle-configuration",
    "inputs-toggle-variations",
    "inputs-toggle-events",
    "inputs-toggle-appearance",
  ];
  for (const id of ids)
    await expect(page.locator(`[data-item-id="${id}"]`)).toBeVisible();
  const actual = await page
    .locator("[data-item-id]")
    .evaluateAll(
      (elements, expected) =>
        elements
          .map((element) => element.getAttribute("data-item-id"))
          .filter((id) => expected.includes(id ?? "")),
      ids,
    );
  expect(actual).toEqual(ids);
  await expect(
    page.locator(
      '[data-item-id="inputs-toggle-configuration-overview--overview"]',
    ),
  ).toBeVisible();
});
