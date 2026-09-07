import { argsToTemplate } from "@storybook/angular";
import type { Meta, StoryObj } from "@storybook/angular";
import { AlertComponent } from "./alert.component";
const meta: Meta<AlertComponent> = {
  id: "feedback-alert",
  title: "Feedback/Alert/Variations",
  component: AlertComponent,
  tags: ["autodocs"],
  args: { heading: "You’re all set", tone: "success" },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "custom"],
    },
  },
  render: (args) => ({
    props: args,
    template: `<dl-alert ${argsToTemplate(args)}>Your changes have been saved successfully.</dl-alert>`,
  }),
};
export default meta;
type Story = StoryObj<AlertComponent>;
export const Default: Story = {};
export const Danger: Story = {
  args: { heading: "Something needs attention", tone: "danger" },
};

export const Neutral: Story = { args: { tone: "neutral" } };

export const Info: Story = { args: { tone: "info" } };

export const Success: Story = { args: { tone: "success" } };

export const Warning: Story = { args: { tone: "warning" } };

export const Custom: Story = { args: { tone: "custom" } };
