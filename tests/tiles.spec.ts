import { test, expect } from "@playwright/test";
const story = (name: string) =>
  `/iframe.html?id=data-display-tiles--${name}&viewMode=story`;
test("tiles show metrics and expose named chart and goal", async ({ page }) => {
  await page.goto(story("default"));
  const tile = page.locator("dl-tiles");
  await expect(tile).toContainText("48,250");
  await expect(tile.getByRole("img", { name: "Metric history" })).toBeVisible();
  const path = await tile.locator("polyline").getAttribute("points");
  expect(path).not.toMatch(/NaN|Infinity/);
  await tile.getByRole("button", { name: "View report" }).focus();
  await page.keyboard.press("Enter");
  await expect(tile.getByRole("button")).toBeFocused();
  await page.goto(story("goal"));
  await expect(
    page.getByRole("progressbar", { name: "Monthly revenue goal" }),
  ).toHaveAttribute("aria-valuenow", "72");
});
test("loading, errors and empty state replace stale values", async ({
  page,
}) => {
  await page.goto(story("loading"));
  await expect(page.locator("dl-tiles")).toHaveAttribute("aria-busy", "true");
  await expect(
    page.getByRole("status", { name: "Loading metric" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "View report" }),
  ).toBeDisabled();
  await expect(page.locator(".metric")).toHaveCount(0);
  await page.goto(story("error"));
  await expect(page.getByRole("alert")).toHaveText(
    "The metric could not be loaded.",
  );
  await expect(page.getByRole("button", { name: "Retry" })).toBeEnabled();
  await page.goto(story("empty"));
  await expect(page.locator(".metric")).toHaveText("—");
  await expect(page.locator("svg.chart")).toHaveCount(0);
});
test("flat and single point history renders without invalid geometry", async ({
  page,
}) => {
  await page.goto(story("flat-history"));
  await expect(page.locator("polyline")).toHaveAttribute(
    "points",
    "0,40 100,40 200,40 300,40",
  );
  await page.goto(story("single-data-point"));
  await expect(page.locator("svg.chart circle")).toBeVisible();
  await expect(page.locator("svg.chart polygon")).toHaveCount(0);
});
test("dashboard tiles adapt to mobile and desktop grids", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 850 });
  await page.goto(story("dashboard"));
  await expect(page.locator("dl-tiles")).toHaveCount(4);
  const first = await page.locator("dl-tiles").nth(0).boundingBox();
  const second = await page.locator("dl-tiles").nth(1).boundingBox();
  expect(first!.y).toBe(second!.y);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  const mobileFirst = await page.locator("dl-tiles").nth(0).boundingBox();
  const mobileSecond = await page.locator("dl-tiles").nth(1).boundingBox();
  expect(mobileSecond!.y).toBeGreaterThan(mobileFirst!.y + mobileFirst!.height);
});
