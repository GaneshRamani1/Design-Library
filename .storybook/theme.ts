import { create } from "storybook/theming";

export function catalogTheme(theme: string) {
  const dark = theme === "dark";
  return create({
    base: dark ? "dark" : "light",
    brandTitle: "Arcwell UI / Angular",
    colorPrimary: dark ? "#ffffff" : "#285b45",
    colorSecondary: dark ? "#ffffff" : "#285b45",
    appBg: dark ? "#000000" : "#f6f7f4",
    appContentBg: dark ? "#151515" : "#ffffff",
    appPreviewBg: dark ? "#000000" : "#f7f8f5",
    appBorderColor: dark ? "#333333" : "#e0e5dc",
    textInverseColor: dark ? "#080808" : "#ffffff",
    textColor: dark ? "#f5f5f5" : "#202a24",
    barBg: dark ? "#151515" : "#ffffff",
    barTextColor: dark ? "#a6a6a6" : "#647068",
    inputBg: dark ? "#000000" : "#ffffff",
    inputTextColor: dark ? "#f5f5f5" : "#202a24",
    inputBorder: dark ? "#333333" : "#dce2da",
    fontBase:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  });
}

export function savedTheme(): "light" | "dark" {
  try {
    return localStorage.getItem("arcwell-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function rememberTheme(theme: string) {
  try {
    localStorage.setItem("arcwell-theme", theme);
  } catch {
    /* Storage may be unavailable in embedded catalogs. */
  }
}
