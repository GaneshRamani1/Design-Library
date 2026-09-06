import type { Meta, StoryObj } from "@storybook/angular";
import { ToggleComponent } from "./toggle.component";
const meta: Meta<ToggleComponent> = {
  title: "Components/Toggle",
  component: ToggleComponent,
  tags: ["autodocs"],
  args: { label: "Email notifications", disabled: false },
  argTypes: {},
};
export default meta;
type Story = StoryObj<ToggleComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
