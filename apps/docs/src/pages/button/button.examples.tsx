import type { ComponentExample } from "../types";

export const buttonExamples: ComponentExample[] = [
  {
    id: "primary",
    title: "Primary",
    description: "Use once per region for the action most likely to move the task forward.",
    preview: <arc-button variant="primary">Continue</arc-button>,
    source: `<button
  dlButton
  variant="primary"
>
  Continue
</button>`,
  },
  {
    id: "secondary",
    title: "Secondary",
    description: "Use for an important alternative that should not compete with the primary action.",
    preview: <arc-button variant="secondary">Save draft</arc-button>,
    source: `<button
  dlButton
  variant="secondary"
>
  Save draft
</button>`,
  },
  {
    id: "tertiary",
    title: "Tertiary",
    description: "Use for lower-emphasis actions in compact interfaces.",
    preview: <arc-button variant="tertiary">Learn more</arc-button>,
    source: `<button
  dlButton
  variant="tertiary"
>
  Learn more
</button>`,
  },
  {
    id: "ghost",
    title: "Ghost",
    description: "Use for quiet actions on dense surfaces where a visible container would add unnecessary weight.",
    preview: <arc-button variant="ghost">Dismiss</arc-button>,
    source: `<button
  dlButton
  variant="ghost"
>
  Dismiss
</button>`,
  },
  {
    id: "danger",
    title: "Danger",
    description: "Use for destructive actions. Pair it with clear wording and confirmation when the result is difficult to reverse.",
    preview: <arc-button variant="danger">Delete account</arc-button>,
    source: `<button
  dlButton
  variant="danger"
>
  Delete account
</button>`,
  },
];
