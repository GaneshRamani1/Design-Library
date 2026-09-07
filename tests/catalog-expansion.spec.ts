import { test, expect } from "@playwright/test";
const story = (id: string, args = "") =>
  `/iframe.html?id=${id}&viewMode=story${args ? "&args=" + args : ""}`;
test("tooltip opens on focus and hover, associates its description, and dismisses with Escape", async ({
  page,
}) => {
  await page.goto(story("overlays-tooltip-directive--immediate"));
  const trigger = page.getByRole("button", { name: "Hover or focus me" });
  await trigger.focus();
  const tip = page.getByRole("tooltip");
  await expect(tip).toHaveText("Changes are saved automatically.");
  await expect(trigger).toHaveAttribute(
    "aria-describedby",
    (await tip.getAttribute("id")) as string,
  );
  await page.keyboard.press("Escape");
  await expect(tip).toHaveCount(0);
  await expect(trigger).not.toHaveAttribute("aria-describedby");
  await trigger.blur();
  await trigger.hover();
  await expect(tip).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(tip).toHaveCount(0);
});
test("interactive popover focuses content, closes outside and restores focus on Escape", async ({
  page,
}) => {
  await page.goto(story("overlays-popover-directive--interactive"));
  const trigger = page.getByRole("button", { name: "Open popover" });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Workspace details" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Done" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("disabled anchored directives do not open", async ({ page }) => {
  for (const id of [
    "overlays-tooltip-directive-configuration--disabled-true",
    "overlays-popover-directive-configuration--disabled-true",
  ]) {
    await page.goto(story(id));
    const trigger = page.getByRole("button");
    await trigger.hover();
    await trigger.focus();
    if (await trigger.isEnabled()) await trigger.click();
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});
test("datepicker selects local dates, skips disabled dates and clears through the form binding", async ({
  page,
}) => {
  await page.goto(story("inputs-datepicker--default"));
  const trigger = page.getByRole("button", { name: "Start date", exact: true });
  await trigger.click();
  const calendar = page.getByRole("dialog", { name: "Choose a date" });
  await expect(calendar).toBeVisible();
  await expect(page.locator('[data-date="2026-09-06"]')).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(page.locator("output")).toHaveText("2026-09-07");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.locator('[data-date="2026-09-12"]')).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Previous month" }),
  ).toBeDisabled();
  await page.locator('[data-date="2026-09-11"]').focus();
  await expect(page.locator('[data-date="2026-09-11"]')).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[data-date="2026-09-13"]')).toBeFocused();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator("output")).toBeEmpty();
  await expect(calendar).toBeHidden();
});
test("datepicker supports month/year keyboard navigation and localized headings", async ({
  page,
}) => {
  await page.goto(story("inputs-datepicker--monday-first"));
  await page.getByRole("button", { name: "Start date", exact: true }).click();
  await expect(page.locator('[data-date="2026-09-06"]')).toBeFocused();
  await page.keyboard.press("PageDown");
  await expect(page.getByRole("grid")).toHaveAttribute(
    "aria-label",
    "October 2026",
  );
  await page.keyboard.press("Home");
  await expect(page.locator('[data-date="2026-09-28"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
test("weekend filter and read-only datepicker respect constraints", async ({
  page,
}) => {
  await page.goto(story("inputs-datepicker--weekend-filter"));
  await page.getByRole("button", { name: "Start date", exact: true }).click();
  await expect(page.locator('[data-date="2026-09-06"]')).toBeDisabled();
  await expect(page.locator('[data-date="2026-09-07"]')).toBeFocused();
  await page.goto(story("inputs-datepicker--read-only"));
  await page.getByRole("button", { name: "Start date", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});
test("chips select, remove and preserve disabled items", async ({ page }) => {
  await page.goto(story("inputs-chips--default"));
  await expect(
    page.getByRole("button", { name: "Design", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Engineering", exact: true }).click();
  await expect(page.locator("output")).toHaveText("design,engineering");
  await expect(
    page.getByRole("button", { name: "Locked", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Remove Locked" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Remove Design" }).click();
  await expect(
    page.getByRole("button", { name: "Design", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("output")).toHaveText("engineering");
});
test("segmented buttons support radio keyboard navigation and independent multi-selection", async ({
  page,
}) => {
  await page.goto(story("inputs-segmented-buttons--default"));
  const list = page.getByRole("radio", { name: "List", exact: true });
  await list.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "Grid", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("output")).toHaveText("grid");
  await page.keyboard.press("ArrowRight");
  await expect(list).toBeFocused();
  await page.goto(story("inputs-segmented-buttons--multiple"));
  await page.getByRole("button", { name: "Grid", exact: true }).click();
  await expect(page.locator("output")).toHaveText("list,grid");
});
test("icon button and FAB retain native disabled behavior and matching dimensions", async ({
  page,
}) => {
  await page.goto(story("actions-icon-button--default"));
  const button = page.getByRole("button", { name: "Add to favorites" });
  await expect(button.locator("svg path")).not.toHaveCount(0);
  const box = await button.boundingBox();
  expect(box?.height).toBe(44);
  expect(box?.width).toBe(44);
  await page.goto(story("actions-icon-button-configuration--loading-true"));
  await expect(
    page.getByRole("button", { name: "Add to favorites" }),
  ).toBeDisabled();
  await page.goto(story("actions-fab-button--extended"));
  await expect(
    page.getByRole("button", { name: "Create workspace" }),
  ).toHaveText("Create workspace");
});
test("icon catalog searches its complete local SVG list and exposes the chosen icon name", async ({
  page,
}) => {
  await page.goto(story("data-display-icon-catalog--all-icons"));
  await expect(
    page.getByText("1807 Lucide icons.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Search icons" }).fill("heart");
  await page.getByRole("button", { name: "heart", exact: true }).click();
  await expect(page.locator(".chosen code")).toHaveText(
    '<dl-icon name="heart" />',
  );
  await expect(page.locator(".chosen svg path")).not.toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Search icons" })
    .fill("no-such-icon-xyz");
  await expect(page.getByText("No matching icons.")).toBeVisible();
});
test("skeleton announces loading, respects reduced motion, and reveals content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(story("feedback-loading-skeleton--default"));
  await expect(page.getByRole("status")).toHaveText("Loading content");
  expect(
    await page
      .locator(".bone")
      .first()
      .evaluate((el) => getComputedStyle(el, "::after").animationName),
  ).toBe("none");
  await page.goto(story("feedback-loading-skeleton--loaded"));
  await expect(page.getByText("Content has loaded.")).toBeVisible();
  await expect(page.locator(".bone")).toHaveCount(0);
});
test("toast timer pauses while hovered and dismisses after resuming", async ({
  page,
}) => {
  await page.goto(story("feedback-toast--timed", "duration:1000"));
  const toast = page.getByRole("status");
  await toast.hover();
  await page.waitForTimeout(1200);
  await expect(toast).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(toast).toHaveCount(0, { timeout: 2500 });
});
test("snackbar action dismisses a persistent notification", async ({
  page,
}) => {
  await page.goto(story("feedback-snackbar--persistent"));
  await expect(page.getByRole("status")).toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
});
test("notification service stacks messages, caps overflow, supports actions and preserves focus", async ({
  page,
}) => {
  await page.goto(story("feedback-notifications-service--default"));
  const launch = page.getByRole("button", { name: "Show toast" });
  await launch.focus();
  for (let i = 0; i < 4; i++) await launch.press("Enter");
  await expect(page.getByRole("status")).toHaveCount(3);
  await expect(launch).toBeFocused();
  await page.getByRole("button", { name: "Show snackbar" }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByText("Archive undone", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear notifications" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
});
