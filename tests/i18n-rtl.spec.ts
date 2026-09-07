import { expect, test } from "@playwright/test";

test("controls preserve layout with RTL and translated content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of [
    "inputs-input--default",
    "inputs-dropdown--default",
    "layout-card-configuration--default",
  ]) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await page.locator("html").evaluate((element) => {
      element.dir = "rtl";
      element.lang = "ar";
    });
    const content = page.locator(".sb-story-content");
    await expect(content).toBeVisible();
    expect(
      await content.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
      id,
    ).toBe(true);
  }
});
