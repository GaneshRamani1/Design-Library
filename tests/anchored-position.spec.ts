import { test, expect } from "@playwright/test";

for (const kind of ["popover", "tooltip"]) {
  test(`${kind} stays anchored after rendering, nested scrolling and resize`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=overlays-${kind}-directive--nested-anchor&viewMode=story`,
    );
    const trigger = page.getByRole("button");
    if (kind === "popover") await trigger.click();
    else await trigger.focus();
    const panel = page.getByRole(kind === "popover" ? "dialog" : "tooltip");
    await expect(panel).toBeVisible();
    const aligned = async () => {
      await expect
        .poll(async () => {
          const a = await trigger.boundingBox(),
            b = await panel.boundingBox();
          if (!a || !b) return 999;
          return Math.max(
            Math.abs(b.y - (a.y + a.height + 8)),
            Math.abs(b.x + b.width / 2 - (a.x + a.width / 2)),
          );
        })
        .toBeLessThan(2);
    };
    await aligned();
    await page.getByTestId("anchor-scroll").evaluate((el) => {
      el.scrollTop = 50;
    });
    await aligned();
    await page.setViewportSize({ width: 900, height: 700 });
    await aligned();
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(page.locator(".cdk-overlay-pane")).toHaveCount(0);
  });
}

test("service opens templates and text with lifecycle, focus and anchor cleanup", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=overlays-popover-directive--service&viewMode=story",
  );
  const trigger = page.getByRole("button", {
    name: "Open template from service",
  });
  await trigger.click();
  const panel = page.getByRole("dialog", { name: "Service details" });
  await expect(panel).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Done", exact: true }),
  ).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const a = (await trigger.boundingBox())!,
    b = (await panel.boundingBox())!;
  expect(Math.abs(a.x - b.x)).toBeLessThan(2);
  expect(Math.abs(b.y - a.y - a.height - 8)).toBeLessThan(2);
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).not.toHaveAttribute("aria-controls");
  const text = page.getByRole("button", { name: "Open text from service" });
  await text.click();
  await expect(panel).toContainText("This text was opened");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(text).toBeFocused();
  await trigger.click();
  await page.mouse.click(4, 4);
  await expect(panel).toHaveCount(0);
  await trigger.click();
  await page.getByRole("button", { name: "Close all popovers" }).click();
  await expect(page.locator(".cdk-overlay-pane")).toHaveCount(0);
});
