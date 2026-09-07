import { test, expect, type Page } from "@playwright/test";
const open = async (page: Page, name = "default", args = "") => {
  await page.goto(
    `/iframe.html?id=navigation-carousel-directive--${name}&viewMode=story${args ? "&args=" + args : ""}`,
  );
  await expect(page.locator("[aria-roledescription=carousel]")).toBeVisible();
  await expect(
    page.locator("[aria-roledescription=carousel] > *").first(),
  ).toHaveAttribute("aria-label", /1/);
};
const track = (page: Page) => page.locator("[aria-roledescription=carousel]");
const position = (page: Page) => page.getByRole("status");
test("navigation, bounds, keyboard and nested buttons preserve component content", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await open(page);
  await expect(position(page)).toHaveText("Position 1 of 5");
  await expect(
    page.getByRole("button", { name: "Previous", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(position(page)).toHaveText("Position 2 of 5");
  await expect
    .poll(() => track(page).evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(10);
  await track(page).focus();
  await track(page).press("End");
  await expect(position(page)).toHaveText("Position 5 of 5");
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  await track(page).press("Home");
  await track(page).press("ArrowRight");
  await expect(position(page)).toHaveText("Position 2 of 5");
  await page
    .getByRole("button", { name: "Open project 2", exact: true })
    .focus();
  await page
    .getByRole("button", { name: "Open project 2", exact: true })
    .press("ArrowRight");
  await expect(position(page)).toHaveText("Position 2 of 5");
  await expect(track(page).locator("dl-card")).toHaveCount(5);
  expect(errors).toEqual([]);
});
test("native scrolling updates the active position", async ({ page }) => {
  await open(page, "default", "behavior:instant");
  await track(page).evaluate((e) => (e.scrollLeft = e.scrollWidth));
  await expect(position(page)).toHaveText("Position 5 of 5");
});
test("responsive cards resize without page overflow and clamp the index", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await open(page, "responsive");
  await expect(position(page)).toHaveText("Position 1 of 3");
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(position(page)).toHaveText("Position 1 of 5");
  await track(page).focus();
  await track(page).press("End");
  await expect(position(page)).toHaveText("Position 5 of 5");
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(position(page)).toHaveText("Position 3 of 3");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("vertical and RTL orientations scroll to the correct slide", async ({
  page,
}) => {
  await open(page, "vertical", "behavior:instant");
  await track(page).focus();
  await track(page).press("ArrowDown");
  await expect(position(page)).toHaveText("Position 2 of 4");
  await expect
    .poll(() => track(page).evaluate((e) => e.scrollTop))
    .toBeGreaterThan(10);
  await open(page, "right-to-left", "behavior:instant");
  await track(page).focus();
  await track(page).press("ArrowLeft");
  await expect(position(page)).toHaveText("Position 2 of 5");
  await expect
    .poll(() => track(page).evaluate((e) => e.scrollLeft))
    .toBeLessThan(-10);
});
test("loop wraps and dynamic children keep the position valid", async ({
  page,
}) => {
  await open(page, "loop", "behavior:instant");
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(position(page)).toHaveText("Position 5 of 5");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(position(page)).toHaveText("Position 1 of 5");
  await open(page, "dynamic-slides", "behavior:instant");
  await track(page).focus();
  await track(page).press("End");
  await page.getByRole("button", { name: "Remove slide" }).click();
  await expect(position(page)).toHaveText("Position 2 of 2");
  await page.getByRole("button", { name: "Add slide" }).click();
  await expect(track(page).locator("dl-card")).toHaveCount(3);
  await expect(track(page).locator("dl-card").last()).toHaveAttribute(
    "aria-label",
    "Slide 3 / 3",
  );
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Remove slide" }).click();
  await expect(track(page).locator("dl-card")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
});
test("autoplay pauses manually, on focus and for reduced motion", async ({
  page,
}) => {
  await open(page, "autoplay", "interval:350;behavior:instant");
  await expect(position(page)).not.toHaveText("Position 1 of 5");
  await page.getByRole("button", { name: "Pause rotation" }).click();
  const stopped = await position(page).innerText();
  await page.waitForTimeout(800);
  await expect(position(page)).toHaveText(stopped);
  await page.getByRole("button", { name: "Resume rotation" }).click();
  await track(page).focus();
  const focused = await position(page).innerText();
  await page.waitForTimeout(800);
  await expect(position(page)).toHaveText(focused);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "autoplay", "interval:350");
  await page.waitForTimeout(800);
  await expect(position(page)).toHaveText("Position 1 of 5");
});
test("custom pagination and disabled navigation", async ({ page }) => {
  await open(page, "custom-pagination", "behavior:instant");
  await page.getByRole("button", { name: "Go to slide 4" }).click();
  await expect(
    page.getByRole("button", { name: "Go to slide 4" }),
  ).toHaveAttribute("aria-current", "true");
  await open(page, "default", "disabled:true");
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  await track(page).press("ArrowRight");
  await expect(position(page)).toHaveText("Position 1 of 5");
});
test("carousel outputs appear in Storybook Actions", async ({ page }) => {
  await page.goto("/?path=/story/navigation-carousel-directive--default");
  await page.getByRole("tab", { name: "Actions", exact: true }).click();
  await page
    .frameLocator("#storybook-preview-iframe")
    .getByRole("button", { name: "Next", exact: true })
    .click();
  await expect(
    page
      .getByRole("treeitem", { name: /CarouselDirective.slideChange:/ })
      .first(),
  ).toBeVisible();
  await expect(
    page
      .getByRole("treeitem", { name: /CarouselDirective.indexChange:/ })
      .first(),
  ).toBeVisible();
});
test("mixed slides preserve form values when navigating away and back", async ({
  page,
}) => {
  await open(page, "mixed-content", "behavior:instant");
  await page.getByRole("textbox", { name: "Project name" }).fill("Saved draft");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "First", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Project name" })).toHaveValue(
    "Saved draft",
  );
});
