import { test, expect } from "@playwright/test";
type Entry = { id: string; title: string; type: string };
for (const width of [320, 768]) {
  test(`all default components fit a ${width}px viewport`, async ({
    page,
    request,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 740 });
    const index = await (await request.get("/index.json")).json();
    const entries = (Object.values(index.entries) as Entry[]).filter(
      (e) =>
        e.type === "story" &&
        e.id.endsWith("--default") &&
        e.title.split("/").length === 2,
    );
    for (const entry of entries) {
      await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`);
      await expect(page.locator(".sb-story-note")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        entry.id,
      ).toBeLessThanOrEqual(width + 1);
    }
  });
}
test("handwritten examples fit narrow phones", async ({
  page,
  request,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Default components and interactions are checked in both engines.",
  );
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 320, height: 740 });
  const index = await (await request.get("/index.json")).json();
  for (const entry of (Object.values(index.entries) as Entry[]).filter(
    (e) => e.type === "story" && e.title.split("/").length === 2,
  )) {
    await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`);
    await expect(page.locator(".sb-story-note")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      entry.id,
    ).toBeLessThanOrEqual(321);
  }
});
test("menus and overlays remain inside portrait and landscape viewports", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 667, height: 320 },
  ]) {
    await page.setViewportSize(viewport);
    for (const id of [
      "inputs-dropdown--default",
      "inputs-multi-select-dropdown--default",
      "inputs-datepicker--default",
      "overlays-modal--default",
      "overlays-bottom-sheet--default",
      "overlays-sidepanel--default",
      "overlays-popover-directive--default",
    ]) {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.locator(".sb-story-note").waitFor();
      await page
        .locator("button.trigger, .sb-story-content button[dlButton]")
        .first()
        .click();
      const panel = page
        .locator("[popover]:popover-open,.cdk-overlay-pane")
        .last();
      await expect(panel).toBeVisible();
      const box = (await panel.boundingBox())!;
      expect(box.x, id).toBeGreaterThanOrEqual(-1);
      expect(box.y, id).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width, id).toBeLessThanOrEqual(viewport.width + 1);
      expect(box.y + box.height, id).toBeLessThanOrEqual(viewport.height + 1);
    }
  }
});
test("vertical navigation stacks its content and long snackbar actions remain readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const id of [
    "navigation-tab-container-layout-and-sizing-orientation--orientation-vertical",
    "navigation-stepper-container-layout-and-sizing-orientation--orientation-vertical",
  ]) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await expect(page.locator(".vertical")).toHaveCSS(
      "flex-direction",
      "column",
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  }
  await page.goto("/iframe.html?id=feedback-snackbar--default&viewMode=story");
  await page
    .locator(".action")
    .evaluate(
      (el) => (el.textContent = "Review all workspace configuration changes"),
    );
  expect((await page.locator(".copy").boundingBox())!.width).toBeGreaterThan(
    180,
  );
  const action = await page.locator(".action").boundingBox();
  const notice = await page.locator(".notice").boundingBox();
  expect(action!.x + action!.width).toBeLessThanOrEqual(
    notice!.x + notice!.width,
  );
});
test("touch phone fields use readable text without changing control heights", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto(
    "http://127.0.0.1:6006/iframe.html?id=inputs-input--default&viewMode=story",
  );
  const input = page.locator("dl-input input");
  await expect(input).toHaveCSS("font-size", "16px");
  await expect(input).toHaveCSS("height", "44px");
  await context.close();
});

test("long segmented choices scroll inside the control and remain keyboard reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const [id, labels, controls] of [
    [
      "inputs-context-selector--default",
      ".segment span",
      ".segment input:not(:disabled)",
    ],
    [
      "inputs-segmented-buttons--default",
      ".segments button span",
      ".segments button:not(:disabled)",
    ],
  ]) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await expect(page.locator(labels).first()).toBeVisible();
    await page
      .locator(labels)
      .evaluateAll((els) =>
        els.forEach(
          (el, i) =>
            (el.textContent = `Workspace configuration option ${i + 1}`),
        ),
      );
    const segments = page.locator(".segments");
    expect(
      await segments.evaluate((el) => el.scrollWidth > el.clientWidth),
    ).toBe(true);
    await page.locator(controls).last().focus();
    await expect
      .poll(async () => {
        const focused = (await page.locator(controls).last().boundingBox())!;
        const box = (await segments.boundingBox())!;
        return focused.x + focused.width <= box.x + box.width + 1;
      })
      .toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  }
});
