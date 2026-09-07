import { test, expect } from "@playwright/test";
for (const theme of ["dark", "light"])
  test(`button variants are distinct in ${theme} and shared by icon/FAB buttons`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=actions-button--variants&viewMode=story&globals=theme:${theme}`,
    );
    const buttons = page.getByRole("button", { name: "Continue", exact: true });
    await expect(buttons).toHaveCount(3);
    const backgrounds = await buttons.evaluateAll((elements) =>
      elements.map((e) => getComputedStyle(e).backgroundColor),
    );
    expect(new Set(backgrounds).size).toBe(3);
    for (const variant of ["primary", "secondary", "tertiary"]) {
      await expect(page.locator(`button[data-variant=${variant}]`)).toHaveCount(
        3,
      );
      const button = page.getByRole("button", {
        name: `${variant} icon button`,
        exact: true,
      });
      await button.focus();
      expect(
        await button.evaluate((e) => getComputedStyle(e).outlineStyle),
      ).not.toBe("none");
    }
    const tertiary = buttons.nth(2);
    await tertiary.hover();
    await expect
      .poll(() => tertiary.evaluate((e) => getComputedStyle(e).backgroundColor))
      .not.toBe("rgba(0, 0, 0, 0)");
  });
test("container variants preserve layout and respect appearance overrides", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(
    "/iframe.html?id=layout-container--variants&viewMode=story&globals=theme:dark",
  );
  const containers = page.locator("dl-container");
  await expect(containers).toHaveCount(3);
  const styles = await containers.evaluateAll((elements) =>
    elements.map((e) => ({
      background: getComputedStyle(e).backgroundColor,
      border: getComputedStyle(e).borderTopWidth,
    })),
  );
  expect(new Set(styles.map((s) => s.background)).size).toBe(3);
  expect(styles[2]!.border).toBe("0px");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto(
    "/iframe.html?id=layout-container-appearance-style-overrides-background--appearance-background&viewMode=story&args=variant:primary",
  );
  await expect(page.locator("dl-container").first()).toHaveAttribute(
    "data-variant",
    "primary",
  );
  await expect(page.locator("dl-container").first()).toHaveCSS(
    "background-color",
    "rgb(37, 28, 50)",
  );
});
test("tertiary preserves native disabled and loading behavior", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=actions-button--tertiary&viewMode=story&args=disabled:true",
  );
  await expect(page.getByRole("button")).toBeDisabled();
  await page.goto(
    "/iframe.html?id=actions-button--tertiary&viewMode=story&args=loading:true",
  );
  await expect(page.getByRole("button")).toBeDisabled();
  await expect(page.getByRole("button")).toHaveAttribute("aria-busy", "true");
});
