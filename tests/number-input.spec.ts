import { test, expect, type Page } from "@playwright/test";
import {
  formatNumber,
  parseNumber,
  numericErrors,
  currencyValidator,
  percentageValidator,
  precisionValidator,
} from "../projects/design-library/src/lib/inputs/number-format";
const open = async (page: Page, name = "default", args = "") => {
  await page.goto(
    `/iframe.html?id=inputs-number-input--${name}&viewMode=story${args ? "&args=" + args : ""}`,
  );
  await expect(page.getByRole("textbox")).toBeVisible();
};
const errors = (page: Page) => page.locator("dl-validation-message");
test("formatters and localized parsers agree on currency, decimals and percent models", () => {
  expect(formatNumber(1234.5, { format: "currency" })).toBe("$1,234.50");
  expect(
    parseNumber("1.234,50 €", {
      format: "currency",
      locale: "de-DE",
      currency: "EUR",
    }),
  ).toBe(1234.5);
  expect(formatNumber(12.5, { format: "percent", precision: 1 })).toBe("12.5%");
  expect(
    formatNumber(0.125, {
      format: "percent",
      percentValue: "fraction",
      precision: 1,
    }),
  ).toBe("12.5%");
  expect(
    parseNumber("12.5%", { format: "percent", percentValue: "fraction" }),
  ).toBe(0.125);
  expect(parseNumber("-$1,234.50", { format: "currency" })).toBe(-1234.5);
  expect(parseNumber("hello", { format: "currency" })).toBeNaN();
  expect(parseNumber("")).toBeNull();
  expect(formatNumber(12.345, { precision: 2 })).toBe("12.35");
});
test("validators cover empty, nonnumeric, precision, range and decimal steps without rounding", () => {
  expect(numericErrors(null, { min: 1 })).toBeNull();
  expect(numericErrors("abc")).toHaveProperty("numeric");
  expect(numericErrors(Infinity)).toHaveProperty("numeric");
  expect(numericErrors(12.345, { precision: 2 })).toEqual({
    precision: { requiredPrecision: 2, actualPrecision: 3 },
  });
  expect(numericErrors(0.000001, { precision: 5 })).toHaveProperty("precision");
  expect(numericErrors(0.3, { step: 0.1 })).toBeNull();
  expect(numericErrors(0.35, { step: 0.1 })).toHaveProperty("step");
  expect(currencyValidator({ min: 0 })({ value: -2 } as any)).toHaveProperty(
    "min",
  );
  expect(percentageValidator()({ value: 101 } as any)).toHaveProperty("max");
  expect(
    percentageValidator({ percentValue: "fraction", precision: 1 })({
      value: 0.125,
    } as any),
  ).toBeNull();
  expect(precisionValidator(0)({ value: 2.1 } as any)).toHaveProperty(
    "precision",
  );
});
test("currency edits keep a numeric model, reject text and reset to null", async ({
  page,
}) => {
  await open(page, "currency");
  const field = page.getByRole("textbox");
  await expect(field).toHaveValue("$1,234.50");
  await field.focus();
  await expect(field).toHaveValue("1234.5");
  await field.fill("9876.5");
  await field.press("Tab");
  await expect(field).toHaveValue("$9,876.50");
  await expect(page.locator("output")).toHaveText("9876.5");
  await field.focus();
  await field.fill("not a number");
  await expect(field).toHaveValue("9876.5");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(field).toHaveValue("");
  await expect(page.locator("output")).toHaveText("null");
});
test("localized currency paste and live formatting preserve the parsed amount", async ({
  page,
}) => {
  await open(page, "euro");
  const field = page.getByRole("textbox");
  await field.fill("2.345,67 €");
  await field.press("Tab");
  await expect(field).toHaveValue(/2\.345,67.*€/);
  await expect(page.locator("output")).toHaveText("2345.67");
  await open(page, "live-currency-mask");
  await field.fill("9876.54");
  await expect(field).toHaveValue("$9,876.54");
  await expect(page.locator("output")).toHaveText("9876.54");
});
test("precision errors stay visible and retain the unrounded model", async ({
  page,
}) => {
  await open(page, "default");
  const field = page.getByRole("textbox");
  await field.fill("12.345");
  await field.press("Tab");
  await expect(errors(page)).toContainText(
    "Use no more than 2 decimal places.",
  );
  await expect(field).toHaveValue("12.345");
  await expect(page.locator("output")).toHaveText("12.345");
  await expect(page.locator("[data-status]")).toHaveText("INVALID");
  await field.fill("12.34");
  await expect(errors(page)).toHaveCount(0);
  await expect(page.locator("[data-status]")).toHaveText("VALID");
  await open(page, "precision-validation");
  await expect(errors(page)).toContainText("2 decimal places");
});
test("percentage point and fraction models validate in their chosen units", async ({
  page,
}) => {
  await open(page, "percentage");
  let field = page.getByRole("textbox");
  await expect(field).toHaveValue("12.5%");
  await field.fill("101");
  await field.press("Tab");
  await expect(errors(page)).toContainText("100");
  await open(page, "fraction-percentage");
  field = page.getByRole("textbox");
  await expect(field).toHaveValue("12.5%");
  await field.focus();
  await expect(field).toHaveValue("12.5");
  await field.fill("25.5");
  await field.press("Tab");
  await expect(page.locator("output")).toHaveText("0.255");
  await expect(field).toHaveValue("25.5%");
  await field.fill("25.55");
  await expect(errors(page)).toContainText("1 decimal places");
});
test("range and step rules compose, and unmasked invalid drafts report numeric errors", async ({
  page,
}) => {
  await open(page, "step-validation");
  const field = page.getByRole("textbox");
  await field.fill("2.3");
  await expect(errors(page)).toContainText("increments of 0.25");
  await field.fill("2.5");
  await expect(errors(page)).toHaveCount(0);
  await open(page, "default", "maskInput:false");
  await field.fill("abc");
  await expect(errors(page)).toContainText("Enter a valid number.");
});
test("reusable validators and ngModel work with numeric controls", async ({
  page,
}) => {
  await open(page, "reusable-validators");
  await expect(errors(page)).toContainText("2 decimal places");
  await page.getByRole("textbox").fill("50");
  await expect(errors(page)).toHaveCount(0);
  await open(page, "template-driven");
  await page.getByRole("textbox").fill("9.25");
  await expect(page.locator("output")).toHaveText("9.25");
});
test("counter button supports bounded keyboard changes and decimal increments", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inputs-counter-button--default&viewMode=story",
  );
  const value = page.getByRole("spinbutton");
  await expect(value).toHaveAttribute("aria-valuenow", "2");
  await page.getByRole("button", { name: "Increase", exact: true }).click();
  await expect(page.locator("output")).toHaveText("3");
  await value.focus();
  await value.press("End");
  await expect(value).toHaveAttribute("aria-valuenow", "10");
  await expect(
    page.getByRole("button", { name: "Increase", exact: true }),
  ).toBeDisabled();
  await value.press("Home");
  await expect(
    page.getByRole("button", { name: "Decrease", exact: true }),
  ).toBeDisabled();
  await page.goto(
    "/iframe.html?id=inputs-counter-button--decimal-steps&viewMode=story",
  );
  await page.getByRole("button", { name: "Increase", exact: true }).click();
  await expect(page.locator("output")).toHaveText("2.25");
  await page.getByRole("button", { name: "Increase", exact: true }).click();
  await expect(page.locator("output")).toHaveText("2.5");
});
test("counter read-only state and mobile layouts retain accessibility", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(
    "/iframe.html?id=inputs-counter-button--read-only&viewMode=story",
  );
  await expect(
    page.getByRole("button", { name: "Increase", exact: true }),
  ).toBeDisabled();
  await page.getByRole("spinbutton").press("ArrowUp");
  await expect(page.locator("output")).toHaveText("2");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await open(page, "currency");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("numeric and counter outputs are connected to Actions", async ({
  page,
}) => {
  await page.goto("/?path=/story/inputs-number-input--default");
  await page.getByRole("tab", { name: "Actions", exact: true }).click();
  let frame = page.frameLocator("#storybook-preview-iframe");
  await frame.getByRole("textbox").fill("42.5");
  await expect(
    page
      .getByRole("treeitem", { name: /NumberInputComponent.valueChange:/ })
      .first(),
  ).toBeVisible();
  await expect(
    page
      .getByRole("treeitem", { name: /NumberInputComponent.formattedChange:/ })
      .first(),
  ).toBeVisible();
  await page.goto("/?path=/story/inputs-counter-button--default");
  await page.getByRole("tab", { name: "Actions", exact: true }).click();
  frame = page.frameLocator("#storybook-preview-iframe");
  await frame.getByRole("button", { name: "Increase", exact: true }).click();
  await expect(
    page
      .getByRole("treeitem", { name: /CounterButtonComponent.incremented:/ })
      .first(),
  ).toBeVisible();
  await expect(
    page
      .getByRole("treeitem", { name: /CounterButtonComponent.valueChange:/ })
      .first(),
  ).toBeVisible();
});

test("fraction editing retains high precision without an extra focus-time rounding step", async ({
  page,
}) => {
  await open(page, "fraction-percentage", "precision:14");
  const field = page.getByRole("textbox");
  await field.fill("12.34567890123456");
  await field.press("Tab");
  await expect(page.locator("output")).toHaveText("0.1234567890123456");
  await field.focus();
  await expect(field).toHaveValue("12.34567890123456");
});
