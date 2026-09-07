import { test, expect } from "@playwright/test";

const playground =
  "/iframe.html?id=inputs-form-playground--default&viewMode=story";

test("inputs write to a reactive form and reset restores every control", async ({
  page,
}) => {
  await page.goto(playground);
  const output = page.getByTestId("form-value");
  await page.getByLabel("Workspace name").fill("New studio");
  await page.getByRole("combobox", { name: "Region" }).click();
  await page.getByRole("option", { name: "Europe", exact: true }).click();
  const staging = page.getByRole("radio", { name: "Staging", exact: true });
  await page.getByRole("radio", { name: "Development", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(staging).toBeChecked();
  await expect(page.getByRole("radio", { name: "Production" })).toBeDisabled();
  await page.getByRole("radio", { name: /Personal/ }).check();
  const teams = page.getByRole("button", { name: /Teams Design/ });
  await teams.click();
  await page.getByRole("searchbox", { name: "Search Teams" }).fill("engi");
  await page.getByRole("checkbox", { name: "Engineering" }).check();
  await page.keyboard.press("Escape");
  await expect(teams).toBeFocused();
  await expect(teams).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("slider", { name: "Volume", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("slider", { name: "Budget minimum" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("switch", { name: "Email notifications" }).uncheck();
  await expect
    .poll(async () => JSON.parse(await output.innerText()))
    .toEqual({
      name: "New studio",
      region: "eu",
      environment: "stage",
      teams: ["design", "engineering"],
      plan: "personal",
      volume: 45,
      budget: [25, 80],
      notifications: false,
    });
  await page.getByRole("button", { name: "Reset form" }).click();
  await expect
    .poll(async () => JSON.parse(await output.innerText()))
    .toEqual({
      name: "Studio",
      region: "us",
      environment: "dev",
      teams: ["design"],
      plan: "team",
      volume: 40,
      budget: [20, 80],
      notifications: true,
    });
  await expect(page.getByRole("combobox", { name: "Region" })).toHaveText(
    "United States",
  );
  await expect(
    page.getByRole("radio", { name: "Development", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("slider", { name: "Budget minimum" }),
  ).toHaveValue("20");
});

test("form disabled state reaches all inputs and validation is associated", async ({
  page,
}) => {
  await page.goto(playground);
  await page.getByRole("button", { name: /Teams Design/ }).click();
  await page.getByRole("button", { name: "Disable form" }).focus();
  await page.keyboard.press("Enter");
  for (const element of await page
    .locator("form input, form select, form button")
    .all())
    await expect(element).toBeDisabled();
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await page.getByRole("button", { name: "Enable form" }).click();
  const name = page.getByLabel("Workspace name");
  await name.fill("");
  await name.blur();
  await expect(name).toHaveAccessibleDescription("Enter a workspace name.");
  await expect(name).toHaveAttribute("aria-invalid", "true");
});

test("multi-select preserves choices, skips disabled options, handles empty search and outside click", async ({
  page,
}) => {
  await page.goto(playground);
  const trigger = page.getByRole("button", { name: /Teams Design/ });
  await trigger.click();
  await expect(page.getByRole("checkbox", { name: "Support" })).toBeDisabled();
  await page
    .getByRole("searchbox", { name: "Search Teams" })
    .fill("not-a-team");
  await expect(page.getByText("No options found.")).toBeVisible();
  await page.getByRole("heading", { name: "Make yourself at home." }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(
    page.getByRole("checkbox", { name: "Design", exact: true }),
  ).toBeChecked();
  await page.getByRole("checkbox", { name: "Design", exact: true }).uncheck();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(trigger).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Teams Select options" }),
  ).toBeFocused();
});

test("range bounds cannot cross using keyboard", async ({ page }) => {
  await page.goto(playground);
  const lower = page.getByRole("slider", { name: "Budget minimum" });
  const upper = page.getByRole("slider", { name: "Budget maximum" });
  await lower.focus();
  await page.keyboard.press("End");
  await expect(lower).toHaveValue("80");
  await page.keyboard.press("ArrowRight");
  await expect(lower).toHaveValue("80");
  await upper.focus();
  await page.keyboard.press("Home");
  await expect(upper).toHaveValue("80");
  await page.keyboard.press("ArrowLeft");
  await expect(upper).toHaveValue("80");
});

test("layout props control width, flex direction and height", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=layout-container--flex-row&viewMode=story");
  const container = page.locator("dl-container");
  await expect(container).toHaveCSS("flex-direction", "row");
  const panes = page.locator("dl-pane");
  await expect(panes).toHaveCount(2);
  const first = (await panes.nth(0).boundingBox())!;
  const second = (await panes.nth(1).boundingBox())!;
  expect(Math.abs(first.y - second.y)).toBeLessThan(2);
  expect(second.x).toBeGreaterThan(first.x + first.width);
  await page.goto("/iframe.html?id=layout-pane--fixed-height&viewMode=story");
  await expect(page.locator("dl-pane")).toHaveCSS("height", "320px");
  await page.goto("/iframe.html?id=layout-container--compact&viewMode=story");
  await expect(page.locator("dl-container")).toHaveCSS("max-width", "480px");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(playground);
  await expect(
    page.getByRole("heading", { name: "Make yourself at home." }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("all new component documentation loads under the right sections", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const id of [
    "layout-container",
    "layout-section",
    "layout-pane",
    "inputs-dropdown",
    "inputs-context-selector",
    "inputs-radio",
    "inputs-multi-select-dropdown",
    "inputs-range-selector",
  ]) {
    await page.goto(`/iframe.html?id=${id}--documentation&viewMode=docs`);
    await expect(page.locator(".sbdocs-title")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
