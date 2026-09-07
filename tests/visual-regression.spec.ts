import { expect, test } from "@playwright/test";

test("representative components match light and dark responsive baselines", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const stories = [
    "actions-button--default",
    "layout-card--showcase",
    "inputs-input--default",
    "inputs-dropdown--default",
    "data-display-code-block--default",
    "overlays-modal--default",
  ];
  for (const theme of ["dark", "light"])
    for (const width of [390, 1024])
      for (const id of stories) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(
          `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`,
        );
        await expect(page.locator(".sb-story-content")).toBeVisible();
        await expect(page).toHaveScreenshot(`${id}-${theme}-${width}.png`, {
          animations: "disabled",
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        });
      }
});
