import { expect, test } from "@playwright/test";

test("two-column card supports configurable tracks and responsive stacking", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto(
    "/iframe.html?id=layout-card--two-column&viewMode=story",
  );
  const card = page.locator("dl-card");
  const split = card.locator(".split");
  await expect(split).toBeVisible();
  const desktopTracks = await split.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" "),
  );
  expect(desktopTracks).toHaveLength(2);
  await expect(card.locator("[cardLeft]")).toContainText("heading");
  await expect(card.locator("[cardRight]")).toContainText(
    "WHAT THIS VALUE CHANGES",
  );

  await page.setViewportSize({ width: 390, height: 800 });
  await expect
    .poll(() =>
      split.evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(" ").length,
      ),
    )
    .toBe(1);
});

test("two-column card can place the descriptive column on the right", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto(
    "/iframe.html?id=layout-card--two-column-right-label&viewMode=story",
  );
  const left = page.locator("dl-card .split-left");
  const right = page.locator("dl-card .split-right");
  expect(
    await left.evaluate((element) => getComputedStyle(element).order),
  ).toBe("2");
  expect(
    await right.evaluate((element) => getComputedStyle(element).order),
  ).toBe("0");
});
