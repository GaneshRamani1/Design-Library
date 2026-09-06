import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Arcwell UI / Angular",
    colorPrimary: "#285b45",
    colorSecondary: "#285b45",
    appBg: "#f6f7f4",
    appContentBg: "#ffffff",
    appBorderColor: "#e0e5dc",
    fontBase:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }),
});
