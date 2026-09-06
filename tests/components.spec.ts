import { test, expect } from "@playwright/test";
test("overview composes interactive components and works on mobile", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=welcome-overview--default&viewMode=story");
  await expect(
    page.getByRole("heading", { name: /Good interfaces start/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByRole("button", { name: "Saved" })).toBeVisible();
  await page.getByLabel("Email address").fill("hello@example.com");
  await expect(page.getByLabel("Email address")).toHaveValue(
    "hello@example.com",
  );
  const toggle = page.getByRole("switch", { name: "Email notifications" });
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await expect(
    page.getByRole("heading", { name: /Good interfaces start/ }),
  ).toBeVisible();
});
test("disabled and loading buttons prevent interaction", async ({ page }) => {
  for (const story of ["disabled", "loading"]) {
    await page.goto(
      `/iframe.html?id=components-button--${story}&viewMode=story`,
    );
    await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  }
});
test("invalid inputs connect their error message", async ({ page }) => {
  await page.goto("/iframe.html?id=components-input--invalid&viewMode=story");
  const field = page.getByLabel("Email address");
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await expect(field).toHaveAccessibleDescription(
    "Enter a valid email address.",
  );
});
test("toggle supports keyboard interaction", async ({ page }) => {
  await page.goto("/iframe.html?id=components-toggle--default&viewMode=story");
  const toggle = page.getByRole("switch");
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
});
test("progress exposes its numeric value", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=components-progress--complete&viewMode=story",
  );
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
});
test("catalog links open documentation in the Storybook shell", async ({
  page,
}) => {
  await page.goto("/?path=/story/welcome-overview--default");
  await page
    .frameLocator("#storybook-preview-iframe")
    .getByRole("link", { name: "Explore components" })
    .click();
  await expect(page).toHaveURL(
    /\/\?path=\/docs\/components-button--documentation/,
  );
  await expect(
    page
      .frameLocator("#storybook-preview-iframe")
      .getByRole("heading", { name: "Button", exact: true }),
  ).toBeVisible();
});
