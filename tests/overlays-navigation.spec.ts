import { test, expect } from "@playwright/test";
for (const [story, label, role] of [
  ["modal", "modal", "dialog"],
  ["sidepanel", "sidepanel", "dialog"],
  ["bottom-sheet", "bottom sheet", "dialog"],
  ["confirmation-dialog", "confirmation dialog", "alertdialog"],
] as const) {
  test(`${label} opens, traps focus, closes and restores focus`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=overlays-${story}--default&viewMode=story`,
    );
    const trigger = page.getByRole("button", {
      name: `Open ${label}`,
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole(role);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(
      story === "confirmation-dialog"
        ? "Remove this workspace?"
        : label === "bottom sheet"
          ? "Bottom sheet"
          : label[0].toUpperCase() + label.slice(1),
    );
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((el) =>
          el.contains(el.ownerDocument.activeElement),
        ),
      ).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("output")).toHaveText("escape");
  });
}
test("overlay dismissal and confirmation are configurable", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=overlays-modal-configuration--close-on-escape-false&viewMode=story",
  );
  await page.getByRole("button", { name: "Open modal" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto(
    "/iframe.html?id=overlays-confirmation-dialog--default&viewMode=story",
  );
  await page.getByRole("button", { name: "Open confirmation dialog" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Remove workspace", exact: true })
    .click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator("output")).toHaveText("confirm");
});
test("tabs navigate by keyboard, skip disabled tabs and preserve panel state", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=navigation-tab-container--default&viewMode=story",
  );
  const overview = page.getByRole("tab", { name: "Overview", exact: true });
  await expect(overview).toHaveAttribute("aria-selected", "true");
  await page.getByLabel("Project name").fill("Edited project");
  await overview.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Activity 3" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("ArrowRight");
  await expect(overview).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Project name")).toHaveValue("Edited project");
});
test("manual tab activation waits for Enter", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=navigation-tab-container-configuration--activation-manual&viewMode=story",
  );
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  const activity = page.getByRole("tab", { name: "Activity 3" });
  await expect(activity).toBeFocused();
  await expect(activity).toHaveAttribute("aria-selected", "false");
  await page.keyboard.press("Enter");
  await expect(activity).toHaveAttribute("aria-selected", "true");
});
test("linear stepper requires completion and supports finishing", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=navigation-stepper-container-configuration--linear-true&viewMode=story",
  );
  const next = page.getByRole("button", { name: "Next", exact: true });
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "Mark account complete" }).click();
  await expect(next).toBeEnabled();
  await next.click();
  await expect(
    page.getByRole("heading", { name: "Choose your preferences" }),
  ).toBeVisible();
  await next.click();
  await page.getByRole("button", { name: "Finish", exact: true }).click();
  await expect(page.locator("output")).toHaveText("Setup complete");
});
test("checkbox supports indeterminate state and counter clamps edits", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-checkbox-configuration--indeterminate-true&viewMode=story",
  );
  const checkbox = page.getByRole("checkbox");
  await expect(checkbox).toHaveJSProperty("indeterminate", true);
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toHaveJSProperty("indeterminate", false);
  await page.goto("/iframe.html?id=inputs-counter--default&viewMode=story");
  const input = page.getByRole("spinbutton");
  await page.getByRole("button", { name: "Increase" }).click();
  await expect(input).toHaveValue("4");
  await input.fill("999");
  await input.blur();
  await expect(input).toHaveValue("10");
  await expect(page.getByRole("button", { name: "Increase" })).toBeDisabled();
});
test("alerts and badges offer five semantic states plus custom and dismiss actions", async ({
  page,
}) => {
  for (const component of ["feedback-alert", "data-display-badge"])
    for (const tone of [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
      "custom",
    ]) {
      await page.goto(
        `/iframe.html?id=${component}-variations--tone-${tone}&viewMode=story`,
      );
      await expect(
        page.locator(component === "feedback-alert" ? "dl-alert" : "dl-badge"),
      ).toHaveAttribute("data-tone", tone);
    }
  await page.goto(
    "/iframe.html?id=feedback-alert-configuration--dismissible-true&viewMode=story",
  );
  await page.getByRole("button", { name: "Dismiss alert" }).click();
  await expect(page.locator("dl-alert")).toBeHidden();
});

test("sidepanels and bottom sheets use their expected viewport edges", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto("/iframe.html?id=overlays-sidepanel--default&viewMode=story");
  await page.getByRole("button", { name: "Open sidepanel" }).click();
  let box = (await page.getByRole("dialog").boundingBox())!;
  expect(Math.abs(box.x + box.width - 1200)).toBeLessThan(2);
  expect(box.y).toBe(0);
  expect(box.height).toBe(800);
  await page.goto(
    "/iframe.html?id=overlays-bottom-sheet--default&viewMode=story",
  );
  await page.getByRole("button", { name: "Open bottom sheet" }).click();
  box = (await page.getByRole("dialog").boundingBox())!;
  expect(Math.abs(box.y + box.height - 800)).toBeLessThan(2);
  expect(Math.abs(box.height - 720)).toBeLessThan(2);
  await page.setViewportSize({ width: 375, height: 640 });
  box = (await page.getByRole("dialog").boundingBox())!;
  expect(Math.abs(box.height - 576)).toBeLessThan(2);
  expect(Math.abs(box.y + box.height - 640)).toBeLessThan(2);
  await page.goto(
    "/iframe.html?id=overlays-bottom-sheet-configuration--height&viewMode=story",
  );
  await page.getByRole("button", { name: "Open bottom sheet" }).click();
  box = (await page.getByRole("dialog").boundingBox())!;
  expect(Math.abs(box.height - 280)).toBeLessThan(2);
});
