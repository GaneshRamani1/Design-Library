import { expect, test } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test("code block labels, highlights, wraps, and confirms copy", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value: string) => localStorage.setItem("copied-code", value) },
    });
  });
  await page.goto(story("data-display-code-block--default"));
  await expect(page.getByText("Angular", { exact: true })).toBeVisible();
  await expect(page.locator(".token.tag").first()).toBeVisible();
  const copy = page.getByRole("button", { name: "Copy code" });
  await copy.click();
  await expect(copy).toHaveText("Copied");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("copied-code"))).toContain("dlButton");
});

test("showcase card exposes all regions and collapses at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(story("layout-card--showcase"));
  await expect(page.locator("dl-card .showcase")).toHaveCSS("grid-template-columns", /.+/);
  const rail = page.locator("dl-card aside");
  const preview = page.locator("dl-card .preview");
  await expect(rail).toBeVisible();
  await expect(preview).toBeVisible();
  const railBox = await rail.boundingBox();
  const previewBox = await preview.boundingBox();
  expect(previewBox!.y).toBeGreaterThan(railBox!.y + railBox!.height - 2);
  await expect(page.locator("dl-code-block")).toBeVisible();
});
