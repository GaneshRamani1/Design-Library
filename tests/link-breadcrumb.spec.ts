import { test, expect } from "@playwright/test";
const story = (id: string) => `/iframe.html?id=navigation-${id}&viewMode=story`;
test("link supports keyboard navigation and blocks disabled activation", async ({
  page,
}) => {
  await page.goto(story("link-directive--default"));
  const link = page.getByRole("link", { name: "View workspace" });
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#link-destination$/);
  await page.goto(story("link-directive--disabled"));
  const disabled = page.getByRole("link", { name: "View workspace" });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await expect(disabled).not.toHaveAttribute("href");
  await expect(disabled).toHaveAttribute("tabindex", "-1");
  await disabled.dispatchEvent("click");
  await expect(page).not.toHaveURL(/#link-destination$/);
});
test("new-tab links preserve native target and add noopener", async ({
  page,
}) => {
  await page.goto(story("link-directive--new-tab"));
  const link = page.getByRole("link");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
});
test("breadcrumb marks current page and navigates ancestors", async ({
  page,
}) => {
  await page.goto(story("breadcrumb--default"));
  const nav = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(nav.locator('[aria-current="page"]')).toHaveText(
    "Design library",
  );
  await expect(nav.getByRole("link")).toHaveCount(3);
  await nav.getByRole("link", { name: "Workspace", exact: true }).click();
  await expect(page).toHaveURL(/#workspace$/);
});
test("collapsed breadcrumb expands with keyboard and restores useful focus", async ({
  page,
}) => {
  await page.goto(story("breadcrumb--collapsed"));
  await expect(page.getByRole("link")).toHaveCount(1);
  await page.getByRole("button", { name: "Show full breadcrumb path" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("link")).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "Workspace", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("button")).toHaveCount(0);
});
test("breadcrumb wraps on mobile and can link the current page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(story("breadcrumb--long-labels"));
  await expect(page.getByRole("navigation")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page.goto(story("breadcrumb--linked-current-page"));
  await expect(page.getByRole("link", { name: "Settings" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
