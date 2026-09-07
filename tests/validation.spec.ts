import { test, expect, type Page } from "@playwright/test";
const open = async (page: Page, name: string) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(
    `/iframe.html?id=inputs-validation-directive--${name}&viewMode=story`,
  );
  await expect(
    page.locator("[dlvalidation],dl-input,dl-dropdown,dl-checkbox").first(),
  ).toBeVisible();
  return errors;
};
const panel = (page: Page) => page.locator("dl-validation-message");
test("custom validators compose, accessible messages clear, and popover sits below the field", async ({
  page,
}) => {
  const errors = await open(page, "default");
  await expect(panel(page)).toContainText("Use your @example.com work email.");
  await expect(panel(page).locator("li")).toHaveCount(2);
  const field = page.getByRole("textbox");
  await expect(field).toHaveAttribute("aria-invalid", "true");
  const described = await field.getAttribute("aria-describedby");
  expect(described?.split(" ").length).toBeGreaterThan(1);
  const hostBox = await page.locator("dl-input").boundingBox();
  const popupBox = await panel(page).boundingBox();
  expect(popupBox!.y).toBeGreaterThanOrEqual(hostBox!.y + hostBox!.height);
  await field.fill("someone@example.com");
  await expect(panel(page)).toHaveCount(0);
  await expect(field).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("output")).toHaveText("VALID");
  expect(await field.getAttribute("aria-describedby")).not.toContain(
    "dl-validation-",
  );
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(panel(page)).toContainText("This field is required.");
  expect(errors).toEqual([]);
});
test("touched and submitted timing reset with their forms", async ({
  page,
}) => {
  await open(page, "on-blur");
  await expect(panel(page)).toHaveCount(0);
  await page.getByRole("textbox").focus();
  await page.getByRole("textbox").press("Tab");
  await expect(panel(page)).toBeVisible();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(panel(page)).toHaveCount(0);
  await open(page, "on-submit");
  await expect(panel(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Submit form" }).click();
  await expect(panel(page)).toContainText("This field is required.");
  await page.getByRole("button", { name: "Reset form" }).click();
  await expect(panel(page)).toHaveCount(0);
});
test("focus trigger and Escape do not steal input focus", async ({ page }) => {
  await open(page, "while-editing");
  const field = page.getByRole("textbox");
  await field.fill("personal@email.com");
  await expect(panel(page)).toBeVisible();
  await expect(field).toBeFocused();
  await field.press("Escape");
  await expect(panel(page)).toHaveCount(0);
  await field.press("Tab");
  await field.focus();
  await expect(panel(page)).toBeVisible();
  await field.press("Tab");
  await expect(panel(page)).toHaveCount(0);
});
test("async checks settle and stale checks cannot restore errors", async ({
  page,
}) => {
  const errors = await open(page, "async");
  await expect(panel(page)).toContainText("This name is already reserved.");
  const field = page.getByRole("textbox");
  await field.fill("reserved2");
  await expect(panel(page)).toContainText("Checking this value");
  await field.fill("reserved");
  await field.fill("available");
  await expect(page.locator("output")).toHaveText("VALID");
  await expect(panel(page)).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("changing validators preserves the control's original required validator", async ({
  page,
}) => {
  await open(page, "dynamic-validators");
  await expect(panel(page)).toContainText("This field is required.");
  await page.getByRole("textbox").fill("personal@email.com");
  await expect(panel(page)).toContainText("work email");
  await page.getByRole("button", { name: "Toggle company rule" }).click();
  await expect(panel(page)).toHaveCount(0);
  await page.getByRole("textbox").fill("");
  await expect(panel(page)).toContainText("This field is required.");
});
test("template-driven and non-text controls share the validation presentation", async ({
  page,
}) => {
  await open(page, "template-driven");
  await expect(panel(page)).toBeVisible();
  await page.getByRole("textbox").fill("someone@example.com");
  await expect(panel(page)).toHaveCount(0);
  await open(page, "checkbox");
  await expect(panel(page)).toContainText("Accept the terms");
  await page.getByRole("checkbox").check();
  await expect(panel(page)).toHaveCount(0);
  await open(page, "dropdown");
  await expect(panel(page)).toContainText("Choose a workspace.");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Design", exact: true }).click();
  await expect(panel(page)).toHaveCount(0);
});
test("inline feedback and narrow popovers remain inside the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await open(page, "inline");
  await expect(panel(page)).toBeVisible();
  await expect(
    page.locator(".cdk-overlay-pane dl-validation-message"),
  ).toHaveCount(0);
  await open(page, "custom-messages");
  await expect(panel(page)).toContainText(
    "Your address must end with @example.com.",
  );
  const box = await panel(page).boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
});
test("validation changes are logged in Storybook Actions", async ({ page }) => {
  await page.goto("/?path=/story/inputs-validation-directive--default");
  await page.getByRole("tab", { name: "Actions", exact: true }).click();
  const canvas = page.frameLocator("#storybook-preview-iframe");
  await canvas.getByRole("textbox").fill("someone@example.com");
  await expect(
    page
      .getByRole("treeitem", { name: /ValidationDirective.validationChange:/ })
      .first(),
  ).toBeVisible();
});
test("native inputs support the shorthand directive attribute", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-validation-directive--native-input&viewMode=story",
  );
  await expect(panel(page)).toContainText("This field is required.");
  await page.getByRole("textbox").fill("complete");
  await expect(panel(page)).toHaveCount(0);
});
