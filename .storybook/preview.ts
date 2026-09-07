import { STORY_OUTPUT_OBSERVERS } from "./output-observers.generated";
import { componentWrapperDecorator, moduleMetadata } from "@storybook/angular";
import { storyNote } from "./story-notes";
import type { Preview } from "@storybook/angular";
import { ThemedDocsContainer } from "./docs-container";
import { savedTheme, rememberTheme } from "./theme";
const preview: Preview = {
  initialGlobals: { theme: savedTheme() },
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: STORY_OUTPUT_OBSERVERS }),
    (story, context) => {
      document.documentElement.dataset["theme"] =
        context.globals["theme"] === "light" ? "light" : "dark";
      rememberTheme(document.documentElement.dataset["theme"]);
      const escape = (value: string) =>
        value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("{", "&#123;")
          .replaceAll("}", "&#125;")
          .replaceAll("@", "&#64;");
      const note =
        context.parameters["storyNote"] ??
        context.parameters["docs"]?.description?.story ??
        storyNote(context.title, context.name, context.args);
      const section = context.title.split("/")[2];
      const journey = ["Configuration", "Variations", "Events", "Appearance"];
      const steps = journey.includes(section)
        ? `<ol class="sb-story-journey" aria-label="Component guide">${journey.map((step, index) => `<li${step === section ? ' aria-current="step"' : ""}>${index + 1}. ${step}</li>`).join("")}</ol>`
        : "";
      const configuration = context.parameters["configuration"];
      const setting = configuration
        ? `<p class="sb-story-setting">${section === "Events" ? "Output" : "Property"}: <code>${escape(configuration.property)}</code>${configuration.value === undefined ? "" : ` <span>=</span> <code>${escape(String(JSON.stringify(configuration.value)))}</code>`}</p>`
        : "";
      const layout = context.parameters["layout"] ?? "centered";
      return componentWrapperDecorator(
        (template) =>
          `<div class="sb-story-layout" data-layout="${escape(layout)}"><aside role="note" aria-label="About this story" class="sb-story-note" ngNonBindable><span class="sb-story-note-icon" aria-hidden="true">i</span><div><p class="sb-story-note-path">${escape(context.title.replaceAll("/", " / "))}</p><h2 class="sb-story-note-title">${escape(context.name)}</h2><p class="sb-story-note-description">${escape(String(note))}</p>${setting}${steps}</div></aside><div class="sb-story-example"><div class="sb-story-content">${template}</div></div></div>`,
      )(story, context);
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    layout: "centered",
    controls: { expanded: true },
    options: {
      storySort: (
        a = { id: "", title: "", name: "" },
        b = { id: "", title: "", name: "" },
      ) => {
        if (a.id === b.id) return 0;
        const roots = [
          "Welcome",
          "Foundations",
          "Layout",
          "Inputs",
          "Navigation",
          "Overlays",
          "Actions",
          "Data display",
          "Feedback",
        ];
        const sections = [
          "Configuration",
          "Variations",
          "Events",
          "Appearance",
        ];
        const left = a.title.split("/"),
          right = b.title.split("/");
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
          const x = left[i] ?? "",
            y = right[i] ?? "";
          if (x === y) continue;
          const order =
            i === 0 ? roots : i === 2 ? sections : i === 3 ? ["Overview"] : [];
          const rank = (value = "") => {
            const index = order.indexOf(value);
            return index < 0 ? order.length : index;
          };
          return (
            rank(x) - rank(y) ||
            x.localeCompare(y, undefined, { numeric: true })
          );
        }
        if (a.name === "Default") return -1;
        if (b.name === "Default") return 1;
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      },
    },
    a11y: { test: "error" },
    docs: { codePanel: true, container: ThemedDocsContainer },
  },
};
export default preview;
