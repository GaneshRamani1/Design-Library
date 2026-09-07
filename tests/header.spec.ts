import { test, expect, type Page } from "@playwright/test";
const open = async (page: Page, name = "default", args = "") => {
  await page.goto(
    `/iframe.html?id=layout-header--${name}&viewMode=story${args ? "&args=" + args : ""}`,
  );
  await expect(page.locator("dl-header")).toBeVisible();
};
test("header renders semantic text, metadata and functioning projected actions", async ({
  page,
}) => {
  await open(page);
  await expect(
    page.getByRole("heading", { level: 1, name: "Workspace overview" }),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Workspace details" }),
  ).toContainText("Design team");
  await expect(page.getByRole("listitem")).toHaveCount(3);
  await expect(page.locator("dl-header .left")).toContainText("Back");
  await expect(page.locator("dl-header .right")).toContainText("New project");
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("New project selected");
  await page.getByRole("button", { name: "← Back", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Back selected");
});
test("empty slots collapse and section headings use the requested level", async ({
  page,
}) => {
  await open(page, "text-only");
  await expect(page.locator("dl-header .left")).toBeHidden();
  await expect(page.locator("dl-header .right")).toBeHidden();
  await expect(page.locator("dl-header .metadata")).toHaveCount(0);
  await open(page, "section-header");
  await expect(
    page.getByRole("heading", { level: 2, name: "Recent activity" }),
  ).toBeVisible();
  await expect(page.locator("dl-header header")).toHaveClass(/divided/);
});
test("rich text and custom metadata project into their intended slots", async ({
  page,
}) => {
  await open(page, "custom-text");
  await expect(
    page.getByRole("heading", { level: 2, name: "Project Atlas" }),
  ).toBeVisible();
  await expect(page.locator(".projected-subheading")).toContainText(
    "your own markup",
  );
  await expect(page.locator("dl-header .extra")).toContainText(
    "Unmarked projected content",
  );
  await open(page, "custom-metadata");
  await expect(page.locator(".projected-metadata dl-badge")).toHaveText(
    "Published",
  );
  await expect(page.locator(".projected-metadata time")).toHaveAttribute(
    "datetime",
    "2026-09-06",
  );
});
test("container responsiveness preserves form state and avoids mobile overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await open(page, "right-content");
  await expect(page.locator("dl-header header")).not.toHaveClass(/stacked/);
  await page.getByRole("textbox", { name: "Search projects" }).fill("Atlas");
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(page.locator("dl-header header")).toHaveClass(/stacked/);
  await expect(
    page.getByRole("textbox", { name: "Search projects" }),
  ).toHaveValue("Atlas");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1100, height: 800 });
  await open(page, "narrow-container");
  await expect(page.locator("dl-header header")).toHaveClass(/stacked/);
  await page.setViewportSize({ width: 320, height: 740 });
  await open(page, "long-content");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("visibility and layout controls update the header", async ({ page }) => {
  await open(
    page,
    "default",
    "showHeading:false;showSubheading:false;showMetadata:false;showLeft:false;layout:column",
  );
  await expect(page.locator("dl-header h1")).toHaveCount(0);
  await expect(page.locator("dl-header .subheading")).toHaveCount(0);
  await expect(page.locator("dl-header .metadata")).toHaveCount(0);
  await expect(page.locator("dl-header .left")).toBeHidden();
  await expect(page.locator("dl-header header")).toHaveClass(/stacked/);
  await expect(
    page.getByRole("button", { name: "New project", exact: true }),
  ).toBeVisible();
});
test("projected button events appear in Storybook Actions", async ({
  page,
}) => {
  await page.goto("/?path=/story/layout-header--default");
  await page.getByRole("tab", { name: "Actions", exact: true }).click();
  const canvas = page.frameLocator("#storybook-preview-iframe");
  await canvas.getByRole("button", { name: "Export", exact: true }).click();
  await expect(canvas.getByRole("status")).toHaveText("Export selected");
  await expect(
    page.getByRole("treeitem", { name: /ButtonComponent.click:/ }).first(),
  ).toBeVisible();
});
