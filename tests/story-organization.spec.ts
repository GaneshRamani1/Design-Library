import { test, expect } from "@playwright/test";

test("catalog groups every component into the ordered learning journey", async ({
  request,
}) => {
  const index = await (await request.get("/index.json")).json();
  expect(index.entries["actions-button-configuration--size-sm"].name).toBe(
    "Size Sm",
  );
  const titles = Object.values(index.entries).map(
    (entry: any) => entry.title as string,
  );
  const componentTitles = titles.filter(
    (title) => !/^(Welcome|Foundations)\//.test(title),
  );
  expect(
    componentTitles.every((title) =>
      [
        "Documentation",
        "Playground",
        "Configuration",
        "Variations",
        "Events",
        "Appearance",
        "Recipes",
      ].includes(title.split("/")[2]),
    ),
  ).toBe(true);
  for (const title of [
    "Inputs/Input/Configuration",
    "Actions/Button/Configuration",
    "Overlays/Modal/Configuration",
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
    "actions-button-configuration--size-sm",
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
    "/iframe.html?id=inputs-toggle-events--event-value-change&viewMode=story",
  );
  await expect(page.locator(".sb-story-setting")).toContainText("valueChange");
  await expect(
    page.locator('.sb-story-journey [aria-current="step"]'),
  ).toHaveText("3. Events");
  await page.goto(
    "/iframe.html?id=actions-button-configuration--size-sm&viewMode=story",
  );
  await expect(page.locator(".sb-story-setting")).toContainText("size");
  await expect(
    page.locator('.sb-story-journey [aria-current="step"]'),
  ).toHaveText("1. Configuration");
});

test("Card uses concise groups with its playground last", async ({ page }) => {
  await page.goto("/?path=/story/layout-card-configuration--default");
  const ids = [
    "layout-card-documentation--documentation",
    "layout-card-configuration",
    "layout-card-variations",
    "layout-card-appearance",
    "layout-card-recipes",
    "layout-card-playground--playground",
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
    page.locator('[data-item-id="layout-card-configuration--hide-header"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-item-id*="layout-card-content-heading-level"]'),
  ).toHaveCount(0);
});

test("Card has webpage documentation and a controlled playground", async ({
  request,
  page,
}) => {
  const index = await (await request.get("/index.json")).json();
  const titles = Object.values(index.entries).map(
    (entry: any) => entry.title as string,
  );
  expect(titles).toContain("Layout/Card/Documentation");
  expect(titles).toContain("Layout/Card/Playground");
  expect(titles.filter((title) => title.endsWith("/Documentation")).length).toBe(
    49,
  );
  for (const story of [
    "padding",
    "gap",
    "radius",
    "border-width",
    "border-color",
    "background",
    "color",
    "font-size",
    "shadow",
    "focus-color",
  ])
    expect(index.entries[`layout-card-appearance--${story}`]).toBeTruthy();
  await page.goto("/?path=/docs/layout-card-documentation--documentation");
  const preview = page.frameLocator("#storybook-preview-iframe");
  await expect(
    preview.getByRole("heading", { name: "Start with the default" }),
  ).toBeVisible();
  await expect(
    preview.getByRole("heading", { name: "Configuration" }),
  ).toBeVisible();
  await expect(preview.getByRole("heading", { name: "Inputs" })).toBeVisible();
  await expect(preview.getByRole("heading", { name: "Outputs" })).toBeVisible();
  await expect(
    preview.getByRole("link", { name: "Hide the generated header" }),
  ).toHaveAttribute(
    "href",
    "?path=/story/layout-card-configuration--hide-header",
  );
});

test("Card heading-level stories render the requested semantic heading", async ({
  page,
}) => {
  const sizes: number[] = [];
  for (const level of [2, 3, 4]) {
    await page.goto(
      `/iframe.html?id=layout-card-configuration--heading-level-${level}&viewMode=story`,
    );
    const heading = page.getByRole("heading", {
      level,
      name: "A little structure. A lot of possibility.",
    });
    await expect(heading).toBeVisible();
    sizes.push(
      Number.parseFloat(
        await heading.evaluate((element) => getComputedStyle(element).fontSize),
      ),
    );
  }
  expect(sizes).toEqual([22, 18, 15]);

  await page.goto(
    "/iframe.html?id=layout-card-configuration--default&viewMode=story&args=headingLevel:2",
  );
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "A little structure. A lot of possibility.",
    }),
  ).toHaveCSS("font-size", "22px");
});

test("every Card story connects shared controls to the rendered component", async ({
  page,
  request,
}) => {
  const index = await (await request.get("/index.json")).json();
  const storyIds = Object.entries(index.entries)
    .filter(
      ([, entry]: [string, any]) =>
        entry.type === "story" && entry.title.startsWith("Layout/Card/"),
    )
    .map(([id]) => id);
  for (const id of storyIds) {
    await page.goto(
      `/iframe.html?id=${id}&viewMode=story&args=heading:Controls%20connected;showHeader:true;showFooter:true;headingLevel:2`,
    );
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Controls connected",
      }),
      id,
    ).toBeVisible();
    await expect(page.locator("dl-card footer"), id).toContainText(
      "Optional footer content",
    );
  }
});
