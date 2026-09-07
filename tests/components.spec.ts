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
    await page.goto(`/iframe.html?id=actions-button--${story}&viewMode=story`);
    await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  }
});
test("invalid inputs connect their error message", async ({ page }) => {
  await page.goto("/iframe.html?id=inputs-input--invalid&viewMode=story");
  const field = page.getByLabel("Email address");
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await expect(field).toHaveAccessibleDescription(
    "Enter a valid email address.",
  );
});

test("input adornments, clear action and password reveal preserve the form value", async ({ page }) => {
  await page.goto("/iframe.html?id=inputs-input--clearable&viewMode=story");
  const search = page.getByRole("searchbox", { name: "Search" });
  await search.fill("quarterly report");
  await page.getByRole("button", { name: "Clear value" }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();

  await page.goto("/iframe.html?id=inputs-input--password-reveal&viewMode=story");
  const password = page.getByRole("textbox", { name: "Password", exact: true });
  await password.fill("secret-value");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("secret-value");

  await page.goto("/iframe.html?id=inputs-input--prefix-and-suffix&viewMode=story");
  await expect(page.locator("dl-input")).toContainText("$", { useInnerText: true });
  await expect(page.locator("dl-input")).toContainText("USD", { useInnerText: true });
});
test("toggle supports keyboard interaction", async ({ page }) => {
  await page.goto("/iframe.html?id=inputs-toggle--default&viewMode=story");
  const toggle = page.getByRole("switch");
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
});
test("progress exposes its numeric value", async ({ page }) => {
  await page.goto("/iframe.html?id=feedback-progress--complete&viewMode=story");
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
    /\/\?path=\/docs\/actions-button--documentation/,
  );
  await expect(
    page
      .frameLocator("#storybook-preview-iframe")
      .getByRole("heading", { name: "Variations", exact: true }),
  ).toBeVisible();
});

test("theme switch updates the catalog, persists through navigation, and themes docs", async ({
  page,
}) => {
  await page.goto("/?path=/story/welcome-overview--default");
  const preview = page.frameLocator("#storybook-preview-iframe");
  await expect(preview.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(preview.locator("dl-welcome")).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)",
  );
  await expect(preview.locator(".specimen").first()).toHaveCSS(
    "background-color",
    "rgba(24, 24, 24, 0.66)",
  );
  await page
    .getByRole("button", { name: "Color theme Dark", exact: true })
    .click();
  await page.getByRole("option", { name: "Light", exact: true }).click();
  await expect(preview.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(preview.locator(".specimen").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await preview.getByRole("link", { name: "Explore components" }).click();
  await expect(
    preview.getByRole("heading", { name: "Variations", exact: true }),
  ).toBeVisible();
  await expect(preview.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Color theme Light", exact: true })
    .click();
  await page.getByRole("option", { name: "Dark", exact: true }).click();
  await expect(preview.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(preview.locator(".sbdocs-wrapper")).toHaveCSS(
    "background-color",
    "rgb(21, 21, 21)",
  );
  await expect(
    page.getByRole("link", { name: "Arcwell UI / Angular" }),
  ).toHaveCSS("color", "rgb(245, 245, 245)");
  await page.reload();
  await expect(preview.locator("html")).toHaveAttribute("data-theme", "dark");
});
