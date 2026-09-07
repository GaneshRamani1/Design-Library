import { test, expect } from "@playwright/test";
const maskStories: Record<string, string> = {
  "custom-pattern":
    "inputs-input-mask-examples-custom-patterns--custom-pattern",
  "custom-definitions":
    "inputs-input-mask-examples-custom-patterns--custom-definitions",
  "formatted-model":
    "inputs-input-mask-examples-formatting-and-editing--formatted-model",
  "visible-guide":
    "inputs-input-mask-examples-formatting-and-editing--visible-guide",
  "obscured-characters":
    "inputs-input-mask-examples-formatting-and-editing--obscured-characters",
  overwrite: "inputs-input-mask-examples-formatting-and-editing--overwrite",
  "partial-allowed":
    "inputs-input-mask-examples-formatting-and-editing--partial-allowed",
  "phone-us": "inputs-input-mask-examples-phone-numbers--phone-us",
  "phone-international":
    "inputs-input-mask-examples-phone-numbers--phone-international",
  "optional-extension":
    "inputs-input-mask-examples-phone-numbers--optional-extension",
  zip: "inputs-input-mask-examples-postal-and-numeric-patterns--zip",
  "zip-plus-4":
    "inputs-input-mask-examples-postal-and-numeric-patterns--zip-plus-4",
  "card-16": "inputs-input-mask-examples-postal-and-numeric-patterns--card-16",
  "date-pattern":
    "inputs-input-mask-examples-postal-and-numeric-patterns--date-pattern",
  "time-pattern":
    "inputs-input-mask-examples-postal-and-numeric-patterns--time-pattern",
  "read-only": "inputs-input-mask-examples-states-and-sizing--read-only",
  disabled: "inputs-input-mask-examples-states-and-sizing--disabled",
  small: "inputs-input-mask-examples-states-and-sizing--small",
  large: "inputs-input-mask-examples-states-and-sizing--large",
  ssn: "inputs-input-mask-examples-tax-identifiers--ssn",
  itin: "inputs-input-mask-examples-tax-identifiers--itin",
  "tin-individual":
    "inputs-input-mask-examples-tax-identifiers--tin-individual",
  "tin-business": "inputs-input-mask-examples-tax-identifiers--tin-business",
  ein: "inputs-input-mask-examples-tax-identifiers--ein",
};
const story = (name: string) =>
  `/iframe.html?id=${maskStories[name]}&viewMode=story`;
for (const [name, raw, formatted] of [
  ["ssn", "000123456", "000-12-3456"],
  ["ein", "001234567", "00-1234567"],
  ["tin-business", "001234567", "00-1234567"],
  ["phone-us", "2025550123", "(202) 555-0123"],
  ["phone-international", "442079460123", "+442079460123"],
  ["zip-plus-4", "123456789", "12345-6789"],
  ["card-16", "0000000000000000", "0000 0000 0000 0000"],
] as const) {
  test(`mask ${name} formats input and emits raw form values`, async ({
    page,
  }) => {
    await page.goto(story(name));
    const field = page.getByRole("textbox");
    await field.fill(raw);
    await expect(field).toHaveValue(formatted);
    await expect(page.getByTestId("model-value")).toHaveText(raw);
    await expect(page.getByTestId("formatted-value")).toHaveText(formatted);
    await expect(page.getByTestId("mask-validity")).toHaveText("Valid");
  });
}
test("mask handles formatted paste, rejected characters, selection edits and deletion", async ({
  page,
}) => {
  await page.goto(story("ssn"));
  const field = page.getByRole("textbox");
  await field.fill("000-12-3456");
  await expect(page.getByTestId("model-value")).toHaveText("000123456");
  await field.evaluate((el: HTMLInputElement) => el.setSelectionRange(4, 6));
  await page.keyboard.insertText("98");
  await expect(field).toHaveValue("000-98-3456");
  await expect(page.getByTestId("model-value")).toHaveText("000983456");
  await field.fill("a0b0c0d1e2f3g4h5i6j7");
  await expect(field).toHaveValue("000-12-3456");
  await field.press("End");
  await field.press("Backspace");
  await expect(page.getByTestId("model-value")).toHaveText("00012345");
  await expect(page.getByTestId("mask-validity")).toHaveText("Invalid");
});
test("programmatic writes and reset update the view without emitting user accept events", async ({
  page,
}) => {
  await page.goto(story("ssn"));
  await page.getByRole("button", { name: "Set example value" }).click();
  await expect(page.getByRole("textbox")).toHaveValue("000-12-3456");
  await expect(page.getByTestId("mask-events")).toHaveText("0 / 0");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("");
  await expect(page.getByTestId("model-value")).toBeEmpty();
  await expect(page.getByTestId("mask-events")).toHaveText("0 / 0");
});
test("formatted model excludes placeholder guides and character obscuring", async ({
  page,
}) => {
  await page.goto(story("formatted-model"));
  await page.getByRole("textbox").fill("000123456");
  await expect(page.getByTestId("model-value")).toHaveText("000-12-3456");
  await page.goto(story("visible-guide"));
  await expect(page.getByRole("textbox")).toHaveValue("___-__-____");
  await page.getByRole("textbox").fill("00012");
  await expect(page.getByRole("textbox")).toHaveValue("000-12-____");
  await expect(page.getByTestId("model-value")).toHaveText("00012");
  await expect(page.getByTestId("formatted-value")).toHaveText("000-12");
  await page.goto(story("obscured-characters"));
  await page.getByRole("textbox").fill("000123456");
  await expect(page.getByRole("textbox")).toHaveValue("•••-••-••••");
  await expect(page.getByTestId("model-value")).toHaveText("000123456");
});
test("custom masks support case conversion, custom tokens and optional extensions", async ({
  page,
}) => {
  await page.goto(story("custom-pattern"));
  await page.getByRole("textbox").fill("abc1234");
  await expect(page.getByRole("textbox")).toHaveValue("ABC-1234");
  await expect(page.getByTestId("model-value")).toHaveText("ABC1234");
  await page.goto(story("custom-definitions"));
  await page.getByRole("textbox").fill("a1b2c3");
  await expect(page.getByRole("textbox")).toHaveValue("#A1B2C3");
  await page.goto(story("optional-extension"));
  await page.getByRole("textbox").fill("2025550123");
  await expect(page.getByTestId("mask-validity")).toHaveText("Valid");
  await page.getByRole("textbox").fill("20255501234567");
  await expect(page.getByRole("textbox")).toHaveValue(
    "(202) 555-0123 ext. 4567",
  );
});
test("mask completeness validation can be disabled and touched state is preserved", async ({
  page,
}) => {
  await page.goto(story("ssn"));
  await page.getByRole("textbox").fill("000");
  await page.getByRole("textbox").blur();
  await expect(page.getByTestId("mask-validity")).toHaveText(
    "Invalid · touched",
  );
  await page.goto(story("partial-allowed"));
  await page.getByRole("textbox").fill("000");
  await expect(page.getByTestId("mask-validity")).toHaveText("Valid");
});
test("mask updates live and disabled/read-only controls prevent edits", async ({
  page,
}) => {
  await page.goto(story("ssn"));
  await page.getByRole("textbox").fill("000123456");
  await page.getByRole("button", { name: "Switch SSN / EIN" }).click();
  await expect(page.getByRole("textbox")).toHaveValue("00-0123456");
  await expect(page.getByTestId("model-value")).toHaveText("000123456");
  await page.getByRole("button", { name: "Toggle disabled" }).click();
  await expect(page.getByRole("textbox")).toBeDisabled();
  await page.goto(story("read-only"));
  await expect(page.getByRole("textbox")).toHaveAttribute("readonly", "");
});
