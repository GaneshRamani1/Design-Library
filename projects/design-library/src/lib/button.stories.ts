import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonComponent } from "./button.component";
const meta: Meta<ButtonComponent> = {
  title: "Components/Button",
  component: ButtonComponent,
  tags: ["autodocs"],
  args: { variant: "primary", size: "md", disabled: false, loading: false },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: (args) => ({
    props: args,
    template:
      '<button dlButton [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Continue →</button>',
  }),
};
export default meta;
type Story = StoryObj<ButtonComponent>;
export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Danger: Story = { args: { variant: "danger" } };
