import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonComponent } from "./button.component";
import { IconButtonComponent } from "./actions/icon-button.component";
import { FabButtonComponent } from "./actions/fab-button.component";
const meta: Meta<ButtonComponent> = {
  id: "actions-button",
  title: "Actions/Button/Variations",
  component: ButtonComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, IconButtonComponent, FabButtonComponent],
    }),
  ],
  args: { variant: "primary", size: "md", disabled: false, loading: false },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghost", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: (args) => ({
    props: args,
    template: `<button dlButton ${argsToTemplate(args)}>Continue →</button>`,
  }),
};
export default meta;
type Story = StoryObj<ButtonComponent>;
export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Danger: Story = { args: { variant: "danger" } };

export const Primary: Story = { args: { variant: "primary" } };
export const Tertiary: Story = {
  args: { variant: "tertiary" },
  parameters: {
    storyNote:
      "A low-emphasis text button with a transparent background and visible hover/focus feedback. Ghost remains available as a compatible alias.",
  },
};
export const Variants: Story = {
  render: () => ({
    props: { variants: ["primary", "secondary", "tertiary"] },
    template: `<div style="display:flex;flex-wrap:wrap;gap:32px">@for(v of variants;track v){<section style="display:flex;flex-direction:column;align-items:flex-start;gap:16px"><h3 style="margin:0;text-transform:capitalize">{{v}}</h3><button dlButton [variant]="v">Continue</button><button dlIconButton [variant]="v" icon="plus" [label]="v+' icon button'"></button><button dlFab [variant]="v" icon="plus" [label]="v+' floating action'"></button></section>}</div>`,
  }),
  parameters: {
    storyNote:
      "Primary is filled, secondary is outlined with a surface background, and tertiary is transparent. The same three variants work on standard buttons, icon buttons and floating action buttons. Click events appear in Actions.",
  },
};
