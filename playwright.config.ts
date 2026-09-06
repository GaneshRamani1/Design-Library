import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:6006", browserName: "chromium" },
  webServer: {
    command: "npx http-server storybook-static -p 6006 -a 127.0.0.1 -c-1",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env["CI"],
  },
});
