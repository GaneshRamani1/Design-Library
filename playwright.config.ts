import { defineConfig } from "@playwright/test";
const storybookPort = process.env["STORYBOOK_TEST_PORT"] ?? "6006";
const storybookUrl = `http://127.0.0.1:${storybookPort}`;
export default defineConfig({
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  testDir: "./tests",
  fullyParallel: true,
  // Storybook renders thousands of generated stories; limiting browser
  // concurrency prevents focus/timer starvation in CI and local release runs.
  workers: 2,
  retries: process.env["CI"] ? 2 : 0,
  use: { baseURL: storybookUrl },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "webkit",
      testMatch: [
        "**/custom-selects.spec.ts",
        "**/overlays-navigation.spec.ts",
        "**/catalog-expansion.spec.ts",
        "**/input-masks.spec.ts",
        "**/notifications.spec.ts",
        "**/link-breadcrumb.spec.ts",
        "**/tiles.spec.ts",
        "**/responsive.spec.ts",
        "**/story-actions.spec.ts",
        "**/validation.spec.ts",
        "**/carousel.spec.ts",
        "**/header.spec.ts",
        "**/number-input.spec.ts",
        "**/variants.spec.ts",
        "**/anchored-position.spec.ts",
        "**/code-block-card.spec.ts",
        "**/card-split.spec.ts",
        "**/i18n-rtl.spec.ts",
      ],
      use: { browserName: "webkit" },
    },
  ],
  webServer: {
    command: `npx http-server storybook-static -p ${storybookPort} -a 127.0.0.1 -c-1`,
    url: storybookUrl,
    reuseExistingServer: !process.env["CI"],
  },
});
