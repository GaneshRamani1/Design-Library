import type { StorybookConfig } from "@storybook/angular";
const config: StorybookConfig = {
  stories: ["../projects/**/*.stories.ts"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/angular", options: {} },
  docs: { defaultName: "Documentation" },
  core: { disableTelemetry: true },
};
export default config;
