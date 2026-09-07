import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
async function open(page: Page, id: string) {
  await page.goto(`/?path=/story/${id}`);
  await page.getByRole("tab", { name: "Actions", exact: true }).click();
  const canvas = page.frameLocator("#storybook-preview-iframe");
  await canvas.locator(".sb-story-note").waitFor();
  return canvas;
}
async function logged(page: Page, name: string) {
  await expect(
    page.getByRole("treeitem", {
      name: new RegExp(name.replaceAll(".", "\\.") + ":"),
    }),
  ).toBeVisible();
}
test("every declared output has a generated observer and event story", () => {
  const manifest = JSON.parse(
    readFileSync("projects/design-library/configuration-coverage.json", "utf8"),
  );
  const source = readFileSync(
    ".storybook/output-observers.generated.ts",
    "utf8",
  );
  const catalog = JSON.parse(
    source.match(/export const STORY_OUTPUT_CATALOG = (.*);/)![1],
  );
  for (const component of manifest) {
    for (const event of component.events) {
      expect(
        catalog.find((c: any) => c.component === component.component)?.outputs,
      ).toContain(event);
      expect(
        component.stories.some((s: any) => s.prop === "event." + event),
      ).toBe(true);
    }
  }
});
test("default input and toggle changes display actual payloads", async ({
  page,
}) => {
  let canvas = await open(page, "inputs-input--default");
  await canvas.locator("dl-input input").fill("actions@example.com");
  await logged(page, "InputComponent.valueChange");
  await expect(
    page.getByRole("treeitem", { name: /InputComponent.valueChange/ }),
  ).toContainText("actions@example.com");
  canvas = await open(page, "inputs-toggle--default");
  await canvas.locator("dl-toggle input").check();
  await logged(page, "ToggleComponent.valueChange");
  await expect(
    page.getByRole("treeitem", { name: /ToggleComponent.valueChange/ }),
  ).toContainText("true");
});
test("models and inherited outputs both log while controls keep working", async ({
  page,
}) => {
  const canvas = await open(
    page,
    "inputs-checkbox-events--event-indeterminate-change",
  );
  await canvas.locator("dl-checkbox input").click();
  await logged(page, "CheckboxComponent.indeterminateChange");
  await logged(page, "CheckboxComponent.valueChange");
  await expect(canvas.locator("dl-checkbox input")).not.toHaveJSProperty(
    "indeterminate",
    true,
  );
});
test("mask outputs log without replacing the form demonstration handlers", async ({
  page,
}) => {
  const canvas = await open(
    page,
    "inputs-input-mask-examples-tax-identifiers--ssn",
  );
  await canvas.locator("dl-input input").fill("000123456");
  await logged(page, "InputComponent.maskAccept");
  await logged(page, "InputComponent.maskComplete");
  await logged(page, "InputComponent.valueChange");
  await expect(canvas.getByTestId("model-value")).toHaveText("000123456");
  await expect(canvas.getByTestId("mask-events")).not.toHaveText("0 / 0");
});
test("overlay model, confirmation and close reasons log", async ({ page }) => {
  const canvas = await open(page, "overlays-modal--default");
  await canvas.getByRole("button", { name: "Open modal" }).click();
  await canvas.getByRole("button", { name: "Save changes" }).click();
  await logged(page, "ModalComponent.openChange");
  await logged(page, "ModalComponent.confirmed");
  await logged(page, "ModalComponent.closed");
  await expect(canvas.getByRole("dialog")).toHaveCount(0);
  await expect(canvas.locator("output")).toHaveText("confirm");
});
test("event stories enable dismissal, tile actions and breadcrumb expansion", async ({
  page,
}) => {
  let canvas = await open(
    page,
    "feedback-alert-events--event-dismissed",
  );
  await canvas.getByRole("button", { name: "Dismiss alert" }).click();
  await logged(page, "AlertComponent.dismissed");
  await logged(page, "AlertComponent.visibleChange");
  canvas = await open(page, "data-display-tiles--default");
  await canvas.getByRole("button", { name: "View report" }).click();
  await logged(page, "TilesComponent.action");
  await expect(
    page.getByRole("treeitem", { name: /TilesComponent\.action:/ }),
  ).toHaveCount(1);
  canvas = await open(
    page,
    "navigation-breadcrumb-events--event-expanded",
  );
  await canvas
    .getByRole("button", { name: "Show full breadcrumb path" })
    .click();
  await logged(page, "BreadcrumbComponent.expanded");
});
test("nested form outputs and native button clicks log", async ({ page }) => {
  let canvas = await open(page, "inputs-form-playground--default");
  await canvas
    .getByRole("textbox", { name: "Workspace name" })
    .fill("Actions workspace");
  await logged(page, "InputComponent.valueChange");
  canvas = await open(page, "actions-button--default");
  await canvas.locator("button[dlButton]").click();
  await logged(page, "ButtonComponent.click");
});
test("service notification callbacks log and retain their demo state", async ({
  page,
}) => {
  const canvas = await open(page, "feedback-notifications-service--default");
  await canvas.getByRole("button", { name: "Show snackbar" }).click();
  await canvas.getByRole("button", { name: "Undo", exact: true }).click();
  await logged(page, "NotificationService.snackbar.onAction");
  await logged(page, "NotificationService.snackbar.afterDismissed");
  await expect(
    canvas.getByText("Archive undone", { exact: true }),
  ).toBeVisible();
});
