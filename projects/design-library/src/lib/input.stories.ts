import type { Meta, StoryObj } from "@storybook/angular";
import { InputComponent } from "./input.component";
const meta: Meta<InputComponent> = {
  id: "inputs-input",
  title: "Inputs/Input/Variations",
  component: InputComponent,
  tags: ["autodocs"],
  args: {
    id: "email-example",
    size: "md",
    stretch: false,
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

export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Clearable: Story = {
  args: { label: "Search", type: "search", showClear: true },
  parameters: { storyNote: "Enter a value and clear it with the labeled action. valueChange and cleared appear in Actions, and focus returns to the input." },
};
export const PasswordReveal: Story = {
  args: { label: "Password", type: "password", showPasswordToggle: true, autocomplete: "current-password" },
  parameters: { storyNote: "The reveal action changes only visual exposure. The form value is preserved and passwordVisibilityChange appears in Actions." },
};
export const PrefixAndSuffix: Story = {
  args: { label: "Monthly budget", prefix: "$", suffix: "USD", inputMode: "decimal" },
  parameters: { storyNote: "Prefix and suffix text remain outside the editable value. Rich projected content can use inputPrefix and inputSuffix." },
};
