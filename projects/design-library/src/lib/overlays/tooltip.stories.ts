import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { TooltipDirective } from "./tooltip.directive";
import { ButtonComponent } from "../button.component";
const meta: Meta<TooltipDirective> = {
  id: "overlays-tooltip-directive",
  title: "Overlays/Tooltip directive/Variations",
  component: TooltipDirective,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [TooltipDirective, ButtonComponent] }),
  ],
  args: {
    dlTooltip: "Changes are saved automatically.",
    showDelay: 150,
    hideDelay: 100,
  },
  render: (args) => ({
    props: args,
    template: `<button dlButton variant="secondary" ${argsToTemplate(args)}>Hover or focus me</button>`,
  }),
};
export default meta;
type Story = StoryObj<TooltipDirective>;
export const Default: Story = {};
export const Immediate: Story = { args: { showDelay: 0, hideDelay: 0 } };

export const NestedAnchor: Story = {
  args: { placement: "bottom", showDelay: 0, hideDelay: 0 },
  parameters: {
    storyNote:
      "The panel follows the button inside a padded, transformed scrolling container. Scroll the container or resize the viewport to check alignment.",
  },
  render: (args) => ({
    props: args,
    template: `<div data-testid="anchor-scroll" style="height:360px;overflow:auto;transform:translateX(0);border:1px solid var(--dl-border);padding:24px"><div style="min-height:720px;padding:100px 30px"><button dlButton variant="secondary" ${argsToTemplate(args)}>Hover or focus me</button></div></div>`,
  }),
};
