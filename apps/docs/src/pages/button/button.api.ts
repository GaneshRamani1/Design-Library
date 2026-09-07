import type { ComponentApi } from "../types";

export const buttonApi: ComponentApi = {
  inputs: [
    {
      name: "variant",
      type: '"primary" | "secondary" | "tertiary" | "ghost" | "danger"',
      defaultValue: '"primary"',
      description: "Sets the button's visual importance and semantic treatment.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "Controls the button's padding and text size.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Prevents interaction and applies the disabled appearance.",
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: "Shows progress and disables the button while work is running.",
    },
    {
      name: "loadingLabel",
      type: "string",
      defaultValue: '""',
      description: "Replaces projected text while the button is loading.",
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: "Expands the button to the width of its container.",
    },
    {
      name: "icon",
      type: "string",
      defaultValue: '""',
      description: "Adds a text or symbol icon beside the button label.",
    },
    {
      name: "iconPosition",
      type: '"start" | "end"',
      defaultValue: '"start"',
      description: "Places the configured icon before or after the label.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      defaultValue: '"button"',
      description: "Sets the native button type used in forms.",
    },
  ],
  outputs: [
    {
      name: "click",
      type: "MouseEvent",
      defaultValue: "native event",
      description: "Fires when the user activates the button. Disabled and loading buttons do not emit it.",
    },
  ],
};
