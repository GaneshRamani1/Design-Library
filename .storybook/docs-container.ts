import {
  createElement,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { catalogTheme, rememberTheme } from "./theme";

export function ThemedDocsContainer(
  props: PropsWithChildren<DocsContainerProps>,
) {
  const story = props.context.componentStories()[0];
  const initialTheme = story
    ? props.context.getStoryContext(story)["globals"]["theme"]
    : "dark";
  const [theme, setTheme] = useState(
    initialTheme === "light" ? "light" : "dark",
  );
  useEffect(() => {
    const channel = addons.getChannel();
    const update = ({ globals }: { globals: Record<string, unknown> }) =>
      setTheme(globals["theme"] === "light" ? "light" : "dark");
    channel.on(GLOBALS_UPDATED, update);
    return () => {
      channel.off(GLOBALS_UPDATED, update);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset["theme"] = theme;
    rememberTheme(theme);
  }, [theme]);
  return createElement(DocsContainer, { ...props, theme: catalogTheme(theme) });
}
