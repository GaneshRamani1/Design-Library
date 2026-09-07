import { test, expect } from "@playwright/test";
const url = (id: string, args = "") =>
  `/iframe.html?id=feedback-${id}&viewMode=story&args=${args}`;
test("inline feedback persists after its action and dismisses from layout", async ({
  page,
}) => {
  await page.goto(url("inline-notification--in-context"));
  const notice = page.locator("dl-inline-notification");
  await expect(notice.getByRole("status")).toContainText(
    "Check your billing details",
  );
  await notice.getByRole("button", { name: "Update card" }).click();
  await expect(notice).toBeVisible();
  await notice.getByRole("button", { name: "Dismiss notification" }).focus();
  await page.keyboard.press("Enter");
  await expect(notice).toBeHidden();
  await expect(page.getByText("Next renewal: October 1")).toBeVisible();
});
test("global fixed banner spans the viewport and dismisses", async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto(url("global-notification--fixed-bottom"));
  const notice = page.locator("dl-global-notification");
  const bounds = await notice.boundingBox();
  expect(bounds!.x).toBe(0);
  expect(bounds!.width).toBe(900);
  expect(Math.abs(bounds!.y + bounds!.height - 700)).toBeLessThan(2);
  await notice.getByRole("button", { name: "View details" }).click();
  await expect(notice).toBeVisible();
  await notice.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(notice).toBeHidden();
});
test("sticky banner remains at the scroll container edge", async ({ page }) => {
  await page.goto(url("global-notification--sticky"));
  const container = page.locator(".sb-story-content > section");
  await container.evaluate((el) => {
    el.scrollTop = 220;
  });
  const parent = await container.boundingBox();
  const notice = await page.locator("dl-global-notification").boundingBox();
  expect(Math.abs(notice!.y - parent!.y)).toBeLessThan(2);
});
test("notifications support all tones, live modes, styling and mobile wrapping", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const kind of ["inline", "global"]) {
    for (const tone of [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
      "custom",
    ]) {
      await page.goto(
        url(`${kind}-notification--default`, `tone:${tone};live:assertive`),
      );
      const notice = page.locator(`dl-${kind}-notification`);
      await expect(notice).toHaveAttribute("data-tone", tone);
      await expect(notice.getByRole("alert")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(375);
    }
    await page.goto(
      url(
        `${kind}-notification--default`,
        "live:off;dismissible:false;showIcon:false",
      ),
    );
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Dismiss notification" }),
    ).toHaveCount(0);
  }
});
test("inline timer pauses on keyboard focus", async ({ page }) => {
  await page.clock.install();
  await page.goto(url("inline-notification--timed"));
  const notice = page.locator("dl-inline-notification");
  await notice.getByRole("button", { name: "Update card" }).focus();
  await page.clock.fastForward(6000);
  await expect(notice).toBeVisible();
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  await page.clock.fastForward(6000);
  await expect(notice).toBeHidden();
});
