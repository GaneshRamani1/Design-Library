import { addons } from "storybook/manager-api";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { catalogTheme, savedTheme, rememberTheme } from "./theme";

addons.setConfig({ theme: catalogTheme(savedTheme()) });
const updateTheme = ({ globals }: { globals: Record<string, unknown> }) => {
  rememberTheme(globals["theme"] === "light" ? "light" : "dark");
  addons.setConfig({
    theme: catalogTheme(globals["theme"] === "light" ? "light" : "dark"),
  });
};
addons.register("arcwell/theme", () => {
  addons.getChannel().on(SET_GLOBALS, updateTheme);
  addons.getChannel().on(GLOBALS_UPDATED, updateTheme);
});
