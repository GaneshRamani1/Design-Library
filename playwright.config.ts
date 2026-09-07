import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:6006" },
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
      ],
      use: { browserName: "webkit" },
    },
  ],
  webServer: {
    command: "npx http-server storybook-static -p 6006 -a 127.0.0.1 -c-1",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env["CI"],
  },
});
