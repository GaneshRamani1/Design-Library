import type { Meta, StoryObj } from "@storybook/angular";
import { InputComponent } from "./input.component";
const meta: Meta<InputComponent> = {
  title: "Components/Input",
  component: InputComponent,
  tags: ["autodocs"],
  args: {
    id: "email-example",
    label: "Email address",
    placeholder: "you@company.com",
    hint: "We’ll only use this for account updates.",
    error: "",
    type: "email",
    disabled: false,
    required: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url"],
    },
  },
};
export default meta;
type Story = StoryObj<InputComponent>;
export const Default: Story = {};
export const Invalid: Story = {
  args: { error: "Enter a valid email address." },
};
export const Disabled: Story = { args: { disabled: true } };
