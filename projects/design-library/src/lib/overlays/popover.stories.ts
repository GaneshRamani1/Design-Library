import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { PopoverDirective } from "./popover.directive";
import { ButtonComponent } from "../button.component";
import { PopoverServiceDemo } from "./popover-service-demo";
const meta: Meta<PopoverDirective> = {
  id: "overlays-popover-directive",
  title: "Overlays/Popover directive/Variations",
  component: PopoverDirective,
  tags: ["autodocs"],
  parameters: { serviceApi: "PopoverService" },
  decorators: [
    moduleMetadata({ imports: [PopoverDirective, ButtonComponent] }),
  ],
  args: {
    dlPopover: "A little more context, right where you need it.",
    placement: "bottom",
    ariaLabel: "Workspace details",
  },
  render: (args) => ({
    props: args,
    template: `<button dlButton variant="secondary" ${argsToTemplate(args)}>Open popover</button>`,
  }),
};
export default meta;
type Story = StoryObj<PopoverDirective>;
export const Default: Story = {};
export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<button dlButton #p="dlPopover" [dlPopover]="details" ${argsToTemplate(args, { exclude: ["dlPopover"] })}>Open popover</button><ng-template #details><h3 style="margin:0 0 12px">Workspace details</h3><p>Invite your team to work together.</p><button dlButton (click)="p.close()">Done</button></ng-template>`,
  }),
};

export const NestedAnchor: Story = {
  args: { placement: "bottom", showDelay: 0, hideDelay: 0 },
  parameters: {
    storyNote:
      "The panel follows the button inside a padded, transformed scrolling container. Scroll the container or resize the viewport to check alignment.",
  },
  render: (args) => ({
    props: args,
    template: `<div data-testid="anchor-scroll" style="height:360px;overflow:auto;transform:translateX(0);border:1px solid var(--dl-border);padding:24px"><div style="min-height:720px;padding:100px 30px"><button dlButton variant="secondary" ${argsToTemplate(args)}>Open popover</button></div></div>`,
  }),
};

export const Service: Story = {
  decorators: [moduleMetadata({ imports: [PopoverServiceDemo] })],
  parameters: {
    storyNote:
      "Open text or interactive templates programmatically using PopoverService.open(anchor, content, config). The returned ref supports close(), updatePosition(), and afterClosed; lifecycle events appear in Actions. Escape, outside click, and owner destruction clean up the panel.",
  },
  render: () => ({ template: "<dl-popover-service-demo />" }),
};
