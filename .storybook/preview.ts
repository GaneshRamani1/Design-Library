import type { Preview } from "@storybook/angular";
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    options: { storySort: { order: ["Welcome", "Foundations", "Components"] } },
    a11y: { test: "error" },
    docs: { codePanel: true },
  },
};
export default preview;
