import { test, expect } from "@playwright/test";

test("text input and both dropdowns share height and padding at every size", async ({
  page,
}) => {
  for (const [size, height, padding] of [
    ["sm", 36, "7px 10px"],
    ["md", 44, "11px 12px"],
    ["lg", 52, "15px 16px"],
  ] as const) {
    for (const story of [
      "inputs-input",
      "inputs-dropdown",
      "inputs-multi-select-dropdown",
    ]) {
      await page.goto(
        `/iframe.html?id=${story}--default&viewMode=story&args=size:${size}`,
      );
      const field = page.locator(
        story === "inputs-input" ? "dl-input input" : ".trigger",
      );
      await expect(field).toHaveCSS("height", `${height}px`);
      await expect(field).toHaveCSS("padding", padding);
      await expect(field).toHaveCSS("line-height", "20px");
    }
    await page.goto(
      `/iframe.html?id=inputs-context-selector--default&viewMode=story&args=size:${size}`,
    );
    await expect(page.locator(".segments")).toHaveCSS("height", `${height}px`);
  }
});
test("custom dropdown supports selection, typeahead, disabled choices and Escape", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=inputs-dropdown--default&viewMode=story");
  const dropdown = page.getByRole("combobox", { name: "Workspace" });
  await expect(page.locator("select")).toHaveCount(0);
  await dropdown.focus();
  await page.keyboard.press("ArrowDown");
  await expect(dropdown).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("End");
  const engineeringId = await page
    .getByRole("option", { name: "Engineering", exact: true })
    .getAttribute("id");
  await expect(dropdown).toHaveAttribute(
    "aria-activedescendant",
    engineeringId!,
  );
  await page.keyboard.press("Escape");
  await expect(dropdown).toHaveText("Design studio");
  await expect(dropdown).toBeFocused();
  await dropdown.click();
  await expect(
    page.getByRole("option", { name: "Archived workspace" }),
  ).toHaveAttribute("aria-disabled", "true");
  await page.getByRole("option", { name: "Engineering", exact: true }).click();
  await expect(dropdown).toHaveText("Engineering");
  await expect(dropdown).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("output")).toHaveText("engineering");
  await dropdown.focus();
  await page.keyboard.press("d");
  await page.keyboard.press("Enter");
  await expect(dropdown).toHaveText("Design studio");
  await dropdown.click();
  await page.getByRole("option", { name: "Select an option" }).click();
  await expect(page.locator("output")).toBeEmpty();
});
test("multi-select custom menu retains selections and returns keyboard focus", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--default&viewMode=story",
  );
  const trigger = page.getByRole("button", { name: /Teams Design/ });
  await trigger.click();
  await page.getByRole("searchbox").fill("Engineering");
  await page.getByRole("checkbox", { name: "Engineering" }).check();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toContainText("Design, Engineering");
});

test("bulk actions select enabled options and clear the form value", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--default&viewMode=story",
  );
  const trigger = page.getByRole("button", { name: /Teams Design/ });
  await trigger.click();
  await page.getByRole("button", { name: "Select all", exact: true }).click();
  await expect(page.locator("output")).toHaveText(
    "design,engineering,marketing",
  );
  await expect(
    page.getByRole("checkbox", { name: "Support", exact: true }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("button", { name: "Select all", exact: true }),
  ).toBeDisabled();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator("output")).toBeEmpty();
  await expect(
    page.getByRole("button", { name: "Clear", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Teams Select options" }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("filtered bulk actions leave selections outside the search intact", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--filtered-bulk-actions&viewMode=story",
  );
  await page.getByRole("button", { name: /Teams Design/ }).click();
  await page.getByRole("searchbox").fill("Engineering");
  await page.getByRole("button", { name: "Select results" }).click();
  await expect(page.locator("output")).toHaveText("design,engineering");
  await page.getByRole("button", { name: "Clear results" }).click();
  await expect(page.locator("output")).toHaveText("design");
  await expect(
    page.getByRole("button", { name: "Clear results" }),
  ).toBeDisabled();
});

test("selection limit applies to bulk and individual selections", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--selection-limit&viewMode=story",
  );
  await page.getByRole("button", { name: /Teams Design/ }).click();
  await page.getByRole("button", { name: "Select all", exact: true }).click();
  await expect(page.locator("output")).toHaveText("design,engineering");
  await expect(
    page.getByRole("checkbox", { name: "Marketing" }),
  ).toBeDisabled();
  await expect(page.getByText("You can select up to 2 options.")).toBeVisible();
  await page.getByRole("checkbox", { name: "Engineering" }).uncheck();
  await expect(page.getByRole("checkbox", { name: "Marketing" })).toBeEnabled();
  await page.getByRole("checkbox", { name: "Marketing" }).check();
  await expect(page.locator("output")).toHaveText("design,marketing");
});

test("clear preserves disabled preselected options", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--locked-selection&viewMode=story",
  );
  await page.getByRole("button", { name: /Teams Design/ }).click();
  await page.getByRole("button", { name: "Select all", exact: true }).click();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator("output")).toHaveText("design");
  await expect(
    page.getByRole("checkbox", { name: "Design", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Design", exact: true }),
  ).toBeDisabled();
});

test("labels, visibility, sizing and close-on-select are configurable", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--custom-labels&viewMode=story",
  );
  await page.getByRole("button", { name: /Project teams Design/ }).click();
  await expect(
    page.getByRole("button", { name: "Add all teams" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove teams" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
  await expect(page.locator(".panel")).toHaveCSS("width", "360px");
  await expect(page.locator(".options")).toHaveCSS("max-height", "140px");
  await page.getByRole("searchbox", { name: "Find project teams" }).fill("zzz");
  await expect(page.getByText("No matching teams")).toBeVisible();
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--minimal&viewMode=story",
  );
  await page.getByRole("button", { name: /Teams Design/ }).click();
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /^(Select all|Clear|Done)$/ }),
  ).toHaveCount(0);
  await page.goto(
    "/iframe.html?id=inputs-multi-select-dropdown--close-after-selection&viewMode=story",
  );
  await page.getByRole("button", { name: /Teams Design/ }).click();
  await page.getByRole("checkbox", { name: "Engineering" }).check();
  await expect(
    page.getByRole("button", { name: /Teams Design/ }),
  ).toHaveAttribute("aria-expanded", "false");
});
